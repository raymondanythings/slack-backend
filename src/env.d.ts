declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ProcessEnv {
    NODE_ENV: 'prod' | 'dev' | 'test'
    PORT: string
    DB_HOST: string
    DB_PORT: string
    DB_USERNAME: string
    DB_PASSWORD: string
    DB_DATABASE: string
    DB_TYPE: 'mysql' | 'mariadb'
    HASH_SALT: string
    COOKIE_SECRET: string
  }
}
