import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const clientDist = resolve(root, 'client', 'dist');
const adminDist = resolve(root, 'admin', 'dist');
const authDist = resolve(root, 'auth', 'dist');
const bundledAdminDist = resolve(clientDist, 'admin');
const bundledAuthDist = resolve(clientDist, 'auth');

const run = (command) => {
  execSync(command, {
    cwd: root,
    stdio: 'inherit',
  });
};

run('npm run build:client');
run('npm run build:admin');
run('npm run build:auth');

if (!existsSync(clientDist) || !existsSync(adminDist) || !existsSync(authDist)) {
  throw new Error('Expected client/dist, admin/dist, and auth/dist to exist after the build.');
}

rmSync(bundledAdminDist, { recursive: true, force: true });
mkdirSync(bundledAdminDist, { recursive: true });
cpSync(adminDist, bundledAdminDist, { recursive: true });

rmSync(bundledAuthDist, { recursive: true, force: true });
mkdirSync(bundledAuthDist, { recursive: true });
cpSync(authDist, bundledAuthDist, { recursive: true });
