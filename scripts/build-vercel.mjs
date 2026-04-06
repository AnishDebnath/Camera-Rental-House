import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const clientDist = resolve(root, 'apps', 'client', 'dist');
const adminDist = resolve(root, 'apps', 'admin', 'dist');
const bundledAdminDist = resolve(clientDist, 'admin');

const run = (command) => {
  execSync(command, {
    cwd: root,
    stdio: 'inherit',
  });
};

run('npm run build:client');
run('npm run build:admin');

if (!existsSync(clientDist) || !existsSync(adminDist)) {
  throw new Error('Expected apps/client/dist and apps/admin/dist to exist after the build.');
}

rmSync(bundledAdminDist, { recursive: true, force: true });
mkdirSync(bundledAdminDist, { recursive: true });
cpSync(adminDist, bundledAdminDist, { recursive: true });
