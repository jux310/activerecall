/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_PDFJS_WORKER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}