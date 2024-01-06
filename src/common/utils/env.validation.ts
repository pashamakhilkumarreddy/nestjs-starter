// Import necessary modules and classes for validation and transformation
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { AppEnvironment, Environment } from '../constants';

// Define a class to represent environment variables with validation decorators
class EnvironmentVariables {
  // Set default values and apply validation decorators for NODE_ENV
  @IsString()
  @IsEnum(Environment)
  // The current environment (e.g., 'development', 'production', etc.)
  NODE_ENV = 'development';

  // Set default values and apply validation decorators for APP_ENV
  @IsString()
  @IsEnum(AppEnvironment)
  // The application environment (e.g., 'development', 'staging', 'production', etc.)
  APP_ENV = 'development';

  // The port on which the application should run
  @IsString()
  PORT: string;

  // The log level for external integrations (e.g., 'info', 'debug', 'error', etc.)
  @IsString()
  LOG_LEVEL = 'info';

  // The host for the database connection
  @IsString()
  DATABASE_HOST: string;

  // The port for the database connection
  @IsString()
  DATABASE_PORT: string;

  // The username for the database connection
  @IsString()
  DATABASE_USER: string;

  // The password for the database connection
  @IsString()
  DATABASE_PASSWORD: string;

  // The name of the database
  @IsString()
  DATABASE_NAME: string;

  // The host for the Redis server
  @IsString()
  REDIS_HOST: string;

  // The port for the Redis server
  @IsString()
  REDIS_PORT: string;

  // The password for the Redis server
  @IsString()
  REDIS_PASSWORD: string;

  // The admin username for Keycloak
  @IsString()
  KEYCLOAK_ADMIN_EMAIL: string;

  // The admin password for Keycloak
  @IsString()
  KEYCLOAK_ADMIN_PASSWORD: string;

  // The base URL for Keycloak
  @IsString()
  KEYCLOAK_BASE_URL: string;

  // The name of the Keycloak realm
  @IsString()
  KEYCLOAK_REALM_NAME: string;

  // The client ID for Keycloak
  @IsString()
  KEYCLOAK_CLIENT_ID: string;

  // The JWT secret
  @IsString()
  JWT_SECRET: string;

  // The time the JWT token is valid for
  @IsString()
  JWT_EXPIRY: string;
}

// Export a validation function that converts and validates a configuration object
export const validate = (config: Record<string, unknown>) => {
  // Transform plain configuration object to instance of EnvironmentVariables class
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });

  // Validate the transformed configuration object using class-validator
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  // If validation errors are found, throw an error with the details
  if (errors.length) {
    throw new Error(errors.toString());
  }

  // Return the validated configuration object
  return validatedConfig;
};
