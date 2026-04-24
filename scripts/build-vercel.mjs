import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

try {
  console.log('🚀 Starting Vercel Build Process...');

  // 1. Build the Main Client (Store)
  console.log('\n--- Building Client (Store) ---');
  execSync('npm run build:client', { stdio: 'inherit' });

  // 2. Build the Admin Panel
  console.log('\n--- Building Admin Panel ---');
  execSync('npm run build:admin', { stdio: 'inherit' });

  // 3. Prepare the deployment structure
  // Vercel expects everything in apps/client/dist based on vercel.json
  const clientDist = path.join(root, 'apps/client/dist');
  const adminDist = path.join(root, 'apps/admin/dist');
  const targetAdminFolder = path.join(clientDist, 'admin');

  console.log('\n--- Merging Admin into Client Dist ---');
  
  if (fs.existsSync(targetAdminFolder)) {
    fs.rmSync(targetAdminFolder, { recursive: true, force: true });
  }

  // Create the /admin folder inside client dist
  fs.mkdirSync(targetAdminFolder, { recursive: true });

  // Copy admin dist contents to client dist /admin
  copyRecursiveSync(adminDist, targetAdminFolder);

  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
