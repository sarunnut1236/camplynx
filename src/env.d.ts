/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIFF_ID: string;
  readonly VITE_LIFF_ID_DEV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 