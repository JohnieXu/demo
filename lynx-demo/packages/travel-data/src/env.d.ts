interface ImportMetaEnv {
  DEV: boolean
  PROD: boolean
  MODE: string
  /** Optional override for the travel API base URL (see .env / .env.mock). */
  readonly PUBLIC_TRAVEL_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
