import crypto from 'crypto';
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import supabase from '../db/supabase.ts';
import { uploadFile as uploadToCloudinary } from '../storage/cloudinary.ts';
import { uploadToSupabase } from '../storage/supabaseStorage.ts';
import { processImage } from '../utils/imageProcessor.ts';
import generateQrBase64 from '../utils/qrGenerator.ts';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const refreshCookieOptions: any = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const createAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

const createRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

const issueTokens = (res: Response, payload: any) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  return { accessToken, refreshToken };
};

const validateSignupPayload = (body: any, files: any) => {
  const errors: string[] = [];
  const requiredFields = [
    'fullName',
    'phone',
    'email',
    'password',
    'aadhaarNo',
    'voterNo',
  ];

  requiredFields.forEach((field) => {
    if (!body[field]) {
      errors.push(`${field} is required.`);
    }
  });

  if (!/^\d{10}$/.test(String(body.phone || '').replace(/\D/g, ''))) {
    errors.push('Phone number must be 10 digits.');
  }

  if (!/^\d{12}$/.test(String(body.aadhaarNo || '').replace(/\D/g, ''))) {
    errors.push('Aadhaar number must be 12 digits.');
  }

  if (String(body.password || '').length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (!files?.selfie?.[0]) {
    errors.push('Profile capture is required.');
  }

  if (!files?.aadhaarDoc?.[0]) {
    errors.push('Aadhaar photocopy is required.');
  }

  if (!files?.voterDoc?.[0]) {
    errors.push('Voter Card photocopy is required.');
  }

  return errors;
};

router.post('/check-exists', async (req: Request, res: Response) => {
  try {
    const { email, phone, aadhaarNo, voterNo } = req.body;
    let query = supabase.from('users').select('email, phone, aadhaar_no, voter_no');

    const conditions: string[] = [];
    if (email) conditions.push(`email.eq.${email.toLowerCase()}`);
    if (phone) conditions.push(`phone.eq.${phone.replace(/\D/g, '')}`);
    if (aadhaarNo) conditions.push(`aadhaar_no.eq.${aadhaarNo.replace(/\D/g, '')}`);
    if (voterNo) conditions.push(`voter_no.eq.${voterNo.trim().toUpperCase()}`);

    if (conditions.length === 0) return res.json({ exists: false });

    const { data: users, error } = await query.or(conditions.join(','));

    if (error) throw error;

    if (users && users.length > 0) {
      const fieldErrors: Record<string, string> = {};
      const fields: string[] = [];

      for (const data of users) {
        if (email && data.email === email.toLowerCase() && !fields.includes('Email')) {
          fieldErrors.email = 'error';
          fields.push('Email');
        }
        if (phone && data.phone === phone.replace(/\D/g, '') && !fields.includes('Phone Number')) {
          fieldErrors.phone = 'error';
          fields.push('Phone Number');
        }
        if (aadhaarNo && data.aadhaar_no === aadhaarNo.replace(/\D/g, '') && !fields.includes('Aadhaar Number')) {
          fieldErrors.aadhaarNo = 'error';
          fields.push('Aadhaar Number');
        }
        if (voterNo && data.voter_no === voterNo.trim().toUpperCase() && !fields.includes('Voter ID')) {
          fieldErrors.voterNo = 'error';
          fields.push('Voter ID');
        }
      }

      let message = 'User is already registered.';
      if (fields.length === 1) message = `This ${fields[0]} is already registered.`;
      else if (fields.length === 2) message = `These ${fields[0]} and ${fields[1]} are already registered.`;
      else if (fields.length > 2) {
        const last = fields.pop();
        message = `These ${fields.join(', ')}, and ${last} are already registered.`;
      }

      return res.status(409).json({
        exists: true,
        message,
        fieldErrors
      });
    }

    return res.json({ exists: false });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.post(
  '/signup',
  upload.fields([
    { name: 'aadhaarDoc', maxCount: 1 },
    { name: 'voterDoc', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      console.log('Signup request received for:', req.body.email);

      const errors = validateSignupPayload(req.body, files);
      if (errors.length) {
        return res.status(400).json({ message: 'Validation failed.', errors });
      }

      const phone = String(req.body.phone).replace(/\D/g, '');
      const email = String(req.body.email).toLowerCase();
      const aadhaarNo = String(req.body.aadhaarNo).replace(/\D/g, '');
      const voterNo = String(req.body.voterNo).trim().toUpperCase();

      // Check for existing user (Email, Phone, Aadhaar, or Voter ID)
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email, phone, aadhaar_no, voter_no')
        .or(`email.eq.${email},phone.eq.${phone},aadhaar_no.eq.${aadhaarNo},voter_no.eq.${voterNo}`);

      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        const fieldErrors: Record<string, string> = {};
        const fields: string[] = [];

        for (const existingUser of existingUsers) {
          if (existingUser.email === email && !fields.includes('Email')) {
            fieldErrors.email = 'error';
            fields.push('Email');
          }
          if (existingUser.phone === phone && !fields.includes('Phone number')) {
            fieldErrors.phone = 'error';
            fields.push('Phone number');
          }
          if (existingUser.aadhaar_no === aadhaarNo && !fields.includes('Aadhaar number')) {
            fieldErrors.aadhaarNo = 'error';
            fields.push('Aadhaar number');
          }
          if (existingUser.voter_no === voterNo && !fields.includes('Voter ID')) {
            fieldErrors.voterNo = 'error';
            fields.push('Voter ID');
          }
        }

        let message = 'User is already registered. Please check your details.';
        if (fields.length === 1) message = `${fields[0]} is already registered.`;
        else if (fields.length === 2) message = `${fields[0]} and ${fields[1]} are already registered.`;
        else if (fields.length > 2) {
          const last = fields.pop();
          message = `${fields.join(', ')}, and ${last} are already registered.`;
        }

        return res.status(409).json({ message, fieldErrors });
      }

      const userId = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(req.body.password, 12);

      console.log('Processing images for userId:', userId);

      // 1. Process and Upload Selfie to Cloudinary
      let avatarUrl = null;
      if (files.selfie?.[0]) {
        console.log('Uploading profile picture to Cloudinary...');
        const { buffer, mimetype } = await processImage(files.selfie[0].buffer, { maxWidth: 800, maxHeight: 800, quality: 85 });
        avatarUrl = await uploadToCloudinary({
          buffer,
          key: `avatar-${userId}-${Date.now()}`,
          mimetype,
          folder: 'Camera Rental House/Profile Picture',
        });
        console.log('Profile picture uploaded successfully.');
      }

      // 2. Process and Upload Aadhaar to Supabase Storage
      console.log('Uploading Aadhaar to Supabase Storage...');
      const { buffer: aadhaarBuf, mimetype: aadhaarMim } = await processImage(files.aadhaarDoc[0].buffer, { maxWidth: 1500, quality: 90 });
      const aadhaarDocUrl = await uploadToSupabase({
        buffer: aadhaarBuf,
        key: `users/${userId}/aadhaar-${Date.now()}.${aadhaarMim.split('/')[1]}`,
        mimetype: aadhaarMim,
      });
      console.log('Aadhaar uploaded successfully.');

      // 3. Process and Upload Voter Card to Supabase Storage
      console.log('Uploading Voter Card to Supabase Storage...');
      const { buffer: voterBuf, mimetype: voterMim } = await processImage(files.voterDoc[0].buffer, { maxWidth: 1500, quality: 90 });
      const voterDocUrl = await uploadToSupabase({
        buffer: voterBuf,
        key: `users/${userId}/voter-${Date.now()}.${voterMim.split('/')[1]}`,
        mimetype: voterMim,
      });
      console.log('Voter Card uploaded successfully.');

      console.log('Inserting user into Supabase database...');
      const userQrBase64 = await generateQrBase64({
        userId,
        name: req.body.fullName,
        phone,
        email: req.body.email,
        aId: aadhaarNo // including Aadhaar number as a unique identity marker
      });

      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          full_name: req.body.fullName,
          phone,
          email: req.body.email,
          password_hash: passwordHash,
          aadhaar_no: aadhaarNo,
          aadhaar_doc_url: aadhaarDocUrl,
          voter_no: req.body.voterNo,
          voter_doc_url: voterDocUrl,
          avatar_url: avatarUrl,
          facebook: req.body.facebook || null,
          instagram: req.body.instagram || null,
          youtube: req.body.youtube || null,
          user_qr_base64: userQrBase64,
        })
        .select('id, full_name, phone, email, avatar_url, user_qr_base64, aadhaar_no, aadhaar_doc_url, voter_no, voter_doc_url, created_at')
        .single();

      if (error) {
        throw error;
      }

      const tokens = issueTokens(res, { id: userId, email: req.body.email, role: 'user' });

      return res.status(201).json({
        message: 'Signup successful.',
        user: {
          id: data.id,
          fullName: data.full_name,
          phone: data.phone,
          email: data.email,
          avatarUrl: data.avatar_url,
          userQrBase64: data.user_qr_base64,
          aadhaarNo: data.aadhaar_no,
          aadhaarDocUrl: data.aadhaar_doc_url,
          voterNo: data.voter_no,
          voterDocUrl: data.voter_doc_url,
          createdAt: data.created_at,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Unable to sign up.' });
    }
  },
);

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: 'Identifier and password are required.' });
    }

    const normalizedPhone = String(identifier).replace(/\D/g, '');
    const field = /^\d{10}$/.test(normalizedPhone) ? 'phone' : 'email';

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq(field, field === 'phone' ? normalizedPhone : identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up to create an account." });
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: 'This account has been blocked.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const tokens = issueTokens(res, {
      id: user.id,
      email: user.email,
      role: 'user',
    });

    return res.json({
      message: 'Login successful.',
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        aadhaarNo: user.aadhaar_no,
        aadhaarDocUrl: user.aadhaar_doc_url,
        voterNo: user.voter_no,
        voterDocUrl: user.voter_doc_url,
        facebook: user.facebook,
        instagram: user.instagram,
        youtube: user.youtube,
        avatarUrl: user.avatar_url,
        userQrBase64: user.user_qr_base64,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Unable to log in.' });
  }
});

router.post('/admin/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  const matchedRole =
    username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
      ? 'admin'
      : username === process.env.MANAGER_USERNAME &&
        password === process.env.MANAGER_PASSWORD
        ? 'manager'
        : null;

  if (!matchedRole) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const tokens = issueTokens(res, {
    id: `${matchedRole}-${username}`,
    username,
    role: matchedRole,
  });

  return res.json({
    message: 'Admin login successful.',
    accessToken: tokens.accessToken,
    role: matchedRole,
  });
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token is missing.' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    const accessToken = createAccessToken({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    });

    return res.json({ accessToken });
  } catch (_error) {
    return res
      .status(401)
      .json({ message: 'Refresh token is invalid or expired.' });
  }
});

import authMiddleware from '../middleware/authMiddleware.ts';

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        aadhaarNo: user.aadhaar_no,
        aadhaarDocUrl: user.aadhaar_doc_url,
        voterNo: user.voter_no,
        voterDocUrl: user.voter_doc_url,
        facebook: user.facebook,
        instagram: user.instagram,
        youtube: user.youtube,
        avatarUrl: user.avatar_url,
        userQrBase64: user.user_qr_base64,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/logout', async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', refreshCookieOptions);
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
