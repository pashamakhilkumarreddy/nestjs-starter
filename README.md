# Nest.JS Starter API

This project is a RESTful API built with Nest.js, a framework designed for efficient and scalable Node.js server-side applications. It also employs Docker for containerization, Postgres as the database, NVM for managing Node.js versions, and Swagger for API documentation and testing.

## Prerequisites

-   Node.js version 20.x.x (LTS)
-   Postgres
-   Docker
-   Docker Compose
-   NVM (optional, for managing Node.js versions)

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Swagger](#swagger)
-   [Docker](#docker)
-   [Database](#database)
-   [Database Migrations](#database-migrations)
-   [Testing](#testing)
-   [Linting and Formatting](#linting-and-formatting)

## Installation

Before starting, ensure you have [Node.js](https://nodejs.org/) installed. It's recommended to use [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions. The project uses the Node.js version specified in `.nvmrc`.

1. Clone this repository:

    ```bash
    git clone https://github.com/pashamakhilkumarreddy/nestjs-starter.git
    ```

2. Navigate to the project directory:

    ```bash
    cd nestjs-starter
    ```

3. If using NVM, set the correct Node.js version:

    ```bash
    nvm use
    ```

4. Create a `.env` file in the project root directory and add the required environment variables (use `.env.example` as a reference).

    ```bash
    cp .env.example .env
    ```

5. Install dependencies:

    ```bash
    npm install
    ```

## Usage

To start the application:

-   Development Mode:

    ```bash
    npm run start:dev
    ```

-   Production Mode:

    ```bash
    npm run start:prod
    ```

## Project Structure

```bash
├── src
│   ├── common
│   │   ├── config
│   │   ├── constants
│   │   ├── decorators
│   │   ├── dtos
│   │   ├── filters
│   │   ├── guards
│   │   ├── interceptors
│   │   ├── middlewares
│   │   ├── services
│   │   ├── utils
│   ├── entities
│   ├── infrastructure
│   ├── modules
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
├── config
├── nginx
├── seeders
├── test
├── .commitlintrc.json
├── .dockerignore
├── .editorconfig
├── .env
├── .env.example
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── .sequelize
├── CONTRIBUTING.md
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── Dockerfile.prod
├── jest.config.js
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

## Detailed Project Structure

-   `src`: Main source code directory.
    -   `common`: Contains shared utilities, configurations, and constants.
        -   `config`: Configuration files.
        -   `constants`: Constant values used across the application.
        -   `decorators`: Custom decorators for NestJS.
        -   `dtos`: Data Transfer Objects for defining data structures.
        -   `filters`: Custom exception filters.
        -   `guards`: Custom guards.
        -   `interceptors`: Custom interceptors.
        -   `middlewares`: Custom middlewares.
        -   `services`: Shared services.
        -   `utils`: Utility functions.
    -   `entities`: Database entities.
    -   `infrastructure`: Code related to infrastructure (e.g., database connections).
    -   `modules`: NestJS modules organizing features.
    -   `app.controller.ts`: Main application controller.
    -   `app.module.ts`: Main application module.
    -   `main.ts`: Application entry point.
-   `config`: Additional configuration files.
-   `nginx`: NGINX configuration files (if applicable).
-   `seeders`: Database seeders.
-   `test`: Testing configurations and files.
-   Various configuration files for Commitlint, Docker, EditorConfig, ESLint, Git, NPM, Prettier, and Sequelize.

## Swagger

Access the Swagger UI at [Swagger API Docs](http://localhost:5000/api-docs).

## Docker

The project includes Docker Compose files for various environments. Ensure the necessary environment variables are set in the corresponding `.env` files (use `.env.example` as a reference).

#### Building Docker Images

To build Docker images:

-   Development Mode:

    ```bash
    npm run docker:dev:build
    ```

-   Production Mode:

    ```bash
    npm run docker:prod:build
    ```

#### Running Docker Containers

To run Docker containers:

-   Development Mode:

    ```bash
    npm run docker:dev:start
    ```

-   Production Mode:

    ```bash
    npm run docker:prod:start
    ```

#### Stopping and Cleaning Docker Containers

To stop and clean Docker containers:

```bash
npm run docker:dev:stop
npm run docker:dev:clean
```

## Database

This application uses [PostgreSQL](https://www.postgresql.org/). Set up and configure the database as follows:

1. Ensure PostgreSQL is installed.
2. Create a new database and user:

    ```bash
    psql -U postgres
    CREATE DATABASE nestjs;
    CREATE USER nestjs_admin WITH PASSWORD 'your_password';
    GRANT ALL PRIVILEGES ON DATABASE nestjs TO nestjs_admin;
    \q
    ```

## Database Migrations

The API uses Sequelize for database migrations. Manage migrations with these commands:

1. Generate Migration:

    ```bash
    npm run db:generate
    ```

2. Run Migrations:

    ```bash
    npm run db:migrate
    ```

3. Undo Migrations:

    ```bash
    npm run db:migrate:down
    ```

## Testing

1. Run Tests:

    ```bash
    npm test
    ```

2. Watch Tests:

    ```bash
    npm run test:watch
    ```

3. Test Coverage:

    ```bash
    npm run test:coverage
    ```

4. Debug Tests:

    ```bash
    npm run test:debug
    ```

5. End-to-End Tests:

    ```bash
    npm run test:e2e
    ```

## Linting and Formatting

1. Run ESLint:

    ```bash
    npm run lint
    ```

2. Fix ESLint Issues:

    ```bash
    npm run lint:fix
    ```

3. Format Code:

    ```bash
    npm run format:fix
    ```

### Pre-commit Hook

Pre-commit hooks using Husky and lint-staged enforce linting and formatting. To bypass these hooks temporarily:

```bash
git commit --no-verify -m "Your commit message"
```

## Scripts

Key npm scripts include:

-   `npm run build`: Build the application for production.
-   `npm run format`: Format code using Prettier.
-   `npm run lint`: Lint code using ESLint.
-   `npm run start`: Start the application in production mode.
-   `npm run start:dev`: Start the application in development mode.
-   `npm run start:debug`: Start the application in debug mode.
-   `npm run db:migrate`: Apply database migrations.
-   `npm run db:migrate:down`: Revert the last migration.
-   `npm run test`: Run unit and integration tests.
-   `npm run test:watch`: Run tests in watch mode.
-   `npm run test:cov`: Generate code coverage report.
-   `npm run test:debug`: Debug tests.
-   `npm run test:e2e`: Run end-to-end tests.

Refer to the `package.json` file for more details.

## Keycloak Setup

For Keycloak setup, see the [Keycloak guide](./Keycloak.md).

## Contributing

For contributing guidelines, see the [Contributing guide](./CONTRIBUTING.md).
