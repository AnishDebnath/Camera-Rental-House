# Vercel Deployment Setup

This repository is a monorepo with four separate deployable apps:

- `client`: public storefront
- `auth`: shared login/signup frontend
- `admin`: admin and manager frontend
- `server`: API as Vercel Functions

Do not deploy the repository root as a single Vercel project. The current failed deployment used a root-level custom install command and cannot work correctly for this layout.

## Create Four Vercel Projects

Create one Vercel project for each workspace and set its Root Directory:

1. `client` project
   Root Directory: `client`
   Framework Preset: `Vite`
   Install Command: leave empty or use `npm install`
   Build Command: leave empty or use `npm run build`
   Output Directory: `dist`

2. `auth` project
   Root Directory: `auth`
   Framework Preset: `Vite`
   Install Command: leave empty or use `npm install`
   Build Command: leave empty or use `npm run build`
   Output Directory: `dist`

3. `admin` project
   Root Directory: `admin`
   Framework Preset: `Vite`
   Install Command: leave empty or use `npm install`
   Build Command: leave empty or use `npm run build`
   Output Directory: `dist`

4. `server` project
   Root Directory: `server`
   Framework Preset: `Other`
   Install Command: leave empty or use `npm install`
   Build Command: leave empty

Remove any custom Install Command such as `npm install --prefix=..`. That command is what caused the `ENOENT /vercel/package.json` failure.

## Required Environment Variables

Set the deployed app URLs so the frontends do not point back to localhost:

### `client`

- `VITE_AUTH_APP_URL=https://your-auth-project.vercel.app`

### `auth`

- `VITE_CLIENT_APP_URL=https://your-client-project.vercel.app`
- `VITE_ADMIN_APP_URL=https://your-admin-project.vercel.app`

### `admin`

- `VITE_AUTH_APP_URL=https://your-auth-project.vercel.app`
- `VITE_API_BASE_URL=https://your-server-project.vercel.app/api`

### `server`

Copy from [server/.env.example](C:\Users\PC\Desktop\Camera-Rental-House\server\.env.example) and set production values, especially:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `MANAGER_USERNAME`
- `MANAGER_PASSWORD`
- `ALLOWED_ORIGINS`

Example `ALLOWED_ORIGINS`:

```text
https://your-client-project.vercel.app,https://your-admin-project.vercel.app,https://your-auth-project.vercel.app
```

## Recommended Deployment Order

1. Deploy `server`
2. Add `VITE_API_BASE_URL` to `admin`
3. Deploy `auth`
4. Add `VITE_AUTH_APP_URL` to `client` and `admin`
5. Add `VITE_CLIENT_APP_URL` and `VITE_ADMIN_APP_URL` to `auth`
6. Redeploy `client`, `auth`, and `admin`
