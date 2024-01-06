import { AppEnvironment, Environment } from '../constants';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

interface KeycloakConfig {
  keycloakAdminEmail: string;
  keycloakAdminPassword: string;
  keycloakBaseUrl: string;
  keycloakRealmName: string;
  keycloakClientId: string;
}

interface SecretsConfig {
  jwtSecret: string;
  jwtExpiry: string;
}

interface EnvironmentVariables {
  env: Environment;
  appEnv: AppEnvironment;
  port: number;
  logLevel: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  keycloak: KeycloakConfig;
  secrets: SecretsConfig;
}

const {
  APP_ENV,
  NODE_ENV,
  PORT,
  LOG_LEVEL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  KEYCLOAK_ADMIN_EMAIL,
  KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_BASE_URL,
  KEYCLOAK_REALM_NAME,
  KEYCLOAK_CLIENT_ID,
  JWT_SECRET,
  JWT_EXPIRY
} = process.env;

export default (): EnvironmentVariables => ({
  env: (NODE_ENV || 'development') as Environment,
  appEnv: (APP_ENV || 'development') as AppEnvironment,
  port: parseInt(PORT, 10) || 5000,
  logLevel: LOG_LEVEL,
  database: {
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT, 10) || 5432,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    name: DATABASE_NAME
  },
  redis: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10) || 6379,
    password: REDIS_PASSWORD
  },
  keycloak: {
    keycloakAdminEmail: KEYCLOAK_ADMIN_EMAIL,
    keycloakAdminPassword: KEYCLOAK_ADMIN_PASSWORD,
    keycloakBaseUrl: KEYCLOAK_BASE_URL,
    keycloakRealmName: KEYCLOAK_REALM_NAME,
    keycloakClientId: KEYCLOAK_CLIENT_ID
  },
  secrets: {
    jwtSecret: JWT_SECRET,
    jwtExpiry: JWT_EXPIRY
  }
});
