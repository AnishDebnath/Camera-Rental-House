import crypto from 'crypto';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import supabase from '../db/supabase.js';
import { uploadFile as uploadToCloudinary } from '../storage/cloudinary.js';
import { uploadToSupabase } from '../storage/supabaseStorage.js';
import { processImage } from '../utils/imageProcessor.js';
import generateQrBase64 from '../utils/qrGenerator.js';

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
      const aadhaarNo = String(req.body.aadhaarNo).replace(/\D/g, '');

      const { data: existingUser, error: existingError } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${req.body.email},phone.eq.${phone}`)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingUser) {
        return res.status(409).json({
          message: 'User already exists with this email or phone number.',
        });
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
      const userQrBase64 = await generateQrBase64({ userId });

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
        .select('id, full_name, phone, email, avatar_url, user_qr_base64, created_at')
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
        voterNo: user.voter_no,
        facebook: user.facebook,
        instagram: user.instagram,
        youtube: user.youtube,
        avatarUrl: user.avatar_url,
        userQrBase64: user.user_qr_base64,
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

router.post('/logout', async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', refreshCookieOptions);
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
