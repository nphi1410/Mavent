/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_APP_NAME: string;
  // thêm các biến môi trường khác ở đây
}
