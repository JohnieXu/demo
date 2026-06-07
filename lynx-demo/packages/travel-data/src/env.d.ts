interface ImportMetaEnv {
  DEV: boolean
  PROD: boolean
  MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
