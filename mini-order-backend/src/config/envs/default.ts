export const config = {
  DATABASE_URL: process.env.DATABASE_URL,

  hello: 'world',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
};
