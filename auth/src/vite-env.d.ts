/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_APP_URL?: string;
  readonly VITE_CLIENT_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
