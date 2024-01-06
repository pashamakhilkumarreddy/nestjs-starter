const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

console.info(`
  Running migration against \
  postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}
`);

module.exports = {
  development: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
    schema: 'public',
  },
  staging: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
    schema: 'public',
  },
  uat: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
    schema: 'public',
  },
  production: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
    schema: 'public',
  }
};