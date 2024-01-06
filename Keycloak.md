# Keycloak Setup Guide

If you prefer to use a hosted Keycloak instance, please contact the team for the necessary details. Below are the steps to integrate your application with the hosted Keycloak instance.

This guide provides step-by-step instructions for setting up a Keycloak server and configuring it for your application.

### Step 1: Set Up a Keycloak Server

Follow the official Keycloak installation instructions to set up and configure your Keycloak server.

### Step 2: Create a Realm

-   Log in to the Keycloak admin console.
-   Create a new realm and configure the necessary settings for your application.

### Step 3: Create a Client

-   Within the created realm, add a new client with the required settings for your application.

### Step 4: Add Client Scopes

-   Create a client scope that includes `openid`.
-   Create another client scope that includes `userId-roles`.

### Step 5: Configure Client Scope and Protocol Mappers

-   Add the created client scopes to the client to fetch user attributes like `userId` and roles.
-   Configure protocol mappers as needed for user attribute mapping.

### Step 6: Assign Scopes to the Client

-   Assign both `openid` and `userId-roles` scopes to the client.

### Step 7: Disable Client Authentication (If Not Required)

-   Disable client authentication if it's not required for your application.
-   Enable `Login with email` under the `Login` tab in `Realm Settings`.

### Step 8: Assign Roles to the Admin User

-   Assign the `manage_users` and `manage_clients` roles to the admin user for user management capabilities.

### Step 9: Configure Email and SMTP Settings

-   Add email and SMTP settings to enable features like Forgot Password. If using Gmail, set up app secrets and enable 2FA.

### Step 10: Create an Initial User

-   Create an initial user directly in Keycloak.
-   Under the user's attributes, add a role with the key `roles` and the value `super_admin`.

### Step 11: Set the User Password

-   Set the password for the initial user.
-   Your Keycloak server is now configured and ready for integration with your application. Ensure you follow best practices and security guidelines for your specific use case.

### Step 12: Obtain Hosted Keycloak Details

Gather the following information:

-   Keycloak Host
-   Realm Information
-   Client Details

### Step 13: Configure Your Application

Update your application configuration with the provided Keycloak details:

-   Use the obtained Keycloak Host.
-   Configure the realm settings.
-   Update the client details in your application.

### Step 14: Follow the Keycloak Setup Guide

Refer to the provided setup guide or documentation from the development team to configure your application with the hosted Keycloak instance. Follow the specific instructions tailored for the hosted environment.

### Step 15: Test and Verify

After configuring your application, test the integration with the hosted Keycloak instance. Verify that authentication, authorization, and user management functionalities work as expected.

### Step 16: Create an Admin User via the Keycloak REST API

-   Use the Keycloak REST API (via Swagger or Postman) to create an initial admin user with the details created directly in Keycloak.
-   Do not use the user created directly in Keycloak to log in to the application. Instead, use the Keycloak host, realm, and client details to connect to the application. Use the newly created admin user from the API to continue creating users, etc.
