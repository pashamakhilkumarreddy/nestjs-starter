import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyCloakService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(KeyCloakService.name);

  /**
   * Retrieves the Keycloak base URL for user management.
   *
   * @returns The Keycloak base URL.
   */
  private getKeycloakBaseURL(): string {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/users`;
    return keycloakBaseURL;
  }

  /**
   * Creates a Keycloak user with the provided data.
   *
   * @param token - Authorization token.
   * @param keyCloakBody - Body containing user data.
   *
   * @returns A Promise resolving to the response from Keycloak.
   *
   * @throws Error if user creation fails.
   */
  async createKeycloakUser({ token, keyCloakBody }: any): Promise<any> {
    const baseURL = this.getKeycloakBaseURL();

    const { userId, firstName, lastName, email, roles } = keyCloakBody;

    // create keycloak user
    const response = await fetch(baseURL, {
      headers: {
        authorization: token,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        email,
        firstName,
        lastName,
        requiredActions: [],
        emailVerified: false,
        groups: [],
        attributes: {
          userId,
          roles: roles.map((role: any) => role.name).join(', ')
        },
        enabled: true
      }),
      method: 'POST'
    });

    if (!response.ok) {
      const resp = await response.json();
      throw new Error(
        resp.errorMessage ||
          `error creating a keycloak user due to ${response.statusText}`
      );
    }
    return response;
  }

  /**
   * Logs in a user to obtain Keycloak tokens.
   * @param username - User's username.
   * @param password - User's password.
   *
   * @returns A Promise resolving to the Keycloak tokens.
   *
   * @throws Error if login fails.
   */
  async login({
    username,
    password
  }: {
    username: string;
    password: string;
  }): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    const grantType = 'password';

    const getKeycloakTokenURL = `${keycloakHost}/realms/${keycloakRealmName}/protocol/openid-connect/token`;

    // Format data as x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('grant_type', grantType);
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(getKeycloakTokenURL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Error obtaining tokens due to ${response.statusText}`);
    }

    const tokens = await response.json();
    return tokens;
  }

  /**
   * Retrieves user information from Keycloak using the provided bearer token.
   *
   * @param bearerToken - Bearer token for authentication.
   *
   * @returns A Promise resolving to the user information.
   *
   * @throws HttpException if session has expired.
   */
  async userInfo({ bearerToken }: any): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakBaseURL = `${keycloakHost}/realms/${keycloakRealmName}/protocol/openid-connect/userinfo`;
    const userResponse = await fetch(keycloakBaseURL, {
      headers: {
        accept: 'application/json',
        authorization: bearerToken
      },
      method: 'GET'
    });
    if (!userResponse.ok) {
      throw new HttpException('Session has expired', HttpStatus.UNAUTHORIZED);
    }
    const response = await userResponse.json();
    return response;
  }

  /**
   * Revokes tokens using the provided bearer token and refresh token.
   *
   * @param bearerToken - Bearer token for authentication.
   * @param refreshToken - Refresh token to be revoked.
   *
   * @throws Error if token revocation fails.
   */
  async revokeTokens({ bearerToken, refreshToken }: any): Promise<any> {
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    // revoke refresh token for edgebox
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakBaseURL = `${keycloakHost}/realms/${keycloakRealmName}/protocol/openid-connect/logout`;

    // Format data as x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('refresh_token', refreshToken);

    const response = await fetch(keycloakBaseURL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
        authorization: bearerToken
      },
      body: formData.toString(),
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Error revoking tokens - Invalid refresh token');
    }
  }

  /**
   * Refreshes Keycloak tokens using a refresh token.
   *
   * @param refreshToken - Refresh token for obtaining new tokens.
   *
   * @returns A Promise resolving to the new Keycloak tokens.
   *
   * @throws Error if refreshing tokens fails.
   */
  async refreshTokens({ refreshToken }: any): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    const grantType = 'refresh_token';
    // Make an HTTP request to obtain tokens
    const getKeycloakTokenURL = `${keycloakHost}/realms/${keycloakRealmName}/protocol/openid-connect/token`;

    // Format data as x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('grant_type', grantType);
    formData.append('refresh_token', refreshToken);

    const response = await fetch(getKeycloakTokenURL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Error obtaining tokens - Invalid refresh token');
    }

    const tokens = await response.json();
    return tokens;
  }

  /**
   * Fetches the Keycloak user with the given email.
   *
   * @param token - Authorization token.
   * @param email - Email of the user to fetch.
   *
   * @returns A Promise resolving to the response from Keycloak.
   *
   * @throws Error if fetching user data fails.
   */
  async fetchKeycloakUser({
    bearerToken,
    email,
    keycloakUserId
  }: {
    bearerToken: string;
    email?: string;
    keycloakUserId?: string;
  }): Promise<any> {
    const baseURL = this.getKeycloakBaseURL();
    let keycloakURL = '';
    if (keycloakUserId) {
      keycloakURL = `${baseURL}/${keycloakUserId}`;
    } else {
      keycloakURL = `${baseURL}?username=${email}`;
    }
    // fetch created keycloak user for unique ID
    const response = await fetch(keycloakURL, {
      headers: {
        authorization: bearerToken,
        'content-type': 'application/json'
      },
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(
        `error fetching keycloak user data due to ${response.statusText}`
      );
    }

    const resp = await response.json();
    return resp;
  }

  /**
   * Sends an update password mail to a Keycloak user.
   *
   * @param token - Authorization token.
   * @param userId - ID of the user.
   *
   * @returns A Promise resolving to the response from Keycloak.
   * @throws Error if sending the update password mail fails.
   */
  async sendUpdatePasswordMail({
    bearerToken,
    keycloakUserId
  }: {
    bearerToken: string;
    keycloakUserId: string;
  }): Promise<any> {
    // execute action on user to update password
    const baseURL = this.getKeycloakBaseURL();

    const response = await fetch(
      `${baseURL}/${keycloakUserId}/execute-actions-email?lifespan=43200`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: bearerToken
        },
        body: JSON.stringify(['UPDATE_PASSWORD'])
      }
    );
    if (!response.ok) {
      throw new Error(
        `error sending update password mail due to ${response.statusText}`
      );
    }
    return response;
  }

  /**
   * Deletes a Keycloak user.
   *
   * @param token - Authorization token.
   * @param userId - ID of the user to be deleted.
   *
   * @returns A Promise resolving to the response from Keycloak.
   *
   * @throws Error if deleting a user fails.
   */
  async deleteKeycloakUser({
    token,
    userId
  }: {
    token: string;
    userId: string;
  }): Promise<any> {
    const baseURL = this.getKeycloakBaseURL();
    if (!userId) return;
    const response = await fetch(`${baseURL}/${userId}`, {
      headers: {
        authorization: token,
        'content-type': 'application/json'
      },
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(
        `error deleting keycloak user due to ${response.statusText}`
      );
    }
    return response;
  }

  /**
   * Updates the password of a Keycloak user.
   *
   * @param newPassword - The new password.
   * @param userId - ID of the user to reset the password.
   *
   * @returns A Promise resolving to the response from Keycloak.
   *
   * @throws HttpException if updating password fails.
   */
  async updateKeycloakUserPassword({
    newPassword,
    userId
  }: {
    newPassword: string;
    userId: string;
  }): Promise<any> {
    const baseURL = this.getKeycloakBaseURL();
    const adminUsername = this.configService.get('KEYCLOAK_ADMIN_EMAIL');
    const adminPassword = this.configService.get('KEYCLOAK_ADMIN_PASSWORD');
    const userLoginInfo = await this.login({
      username: adminUsername,
      password: adminPassword
    });
    const response = await fetch(`${baseURL}/${userId}/reset-password`, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${userLoginInfo.access_token}`
      },
      body: JSON.stringify({
        type: 'password',
        value: newPassword,
        temporary: false
      }),
      method: 'PUT'
    });
    if (!response.ok) {
      throw new HttpException(
        {
          status: 'error',
          message: response.statusText || 'error resetting user password'
        },
        response.status || HttpStatus.BAD_REQUEST
      );
    }
    return response;
  }

  /**
   * Asynchronously updates user details in Keycloak.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {Object} userBody - The updated user details containing at least an email property.
   * @returns {Promise<any>} - A promise resolving to the response from the Keycloak server.
   *
   */
  async updateKeycloakUserDetails({
    userId,
    userBody
  }: {
    userId: string;
    userBody: {
      email: string;
    };
  }): Promise<any> {
    const baseURL = this.getKeycloakBaseURL();
    const adminUsername = this.configService.get('KEYCLOAK_ADMIN_EMAIL');
    const adminPassword = this.configService.get('KEYCLOAK_ADMIN_PASSWORD');
    const userLoginInfo = await this.login({
      username: adminUsername,
      password: adminPassword
    });
    const response = await fetch(`${baseURL}/${userId}`, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${userLoginInfo.access_token}`
      },
      body: JSON.stringify({
        ...userBody
      }),
      method: 'PUT'
    });
    if (!response.ok) {
      throw new HttpException(
        {
          status: 'error',
          message: `error updating user details in keycloak due to ${response.statusText}`
        },
        response.status || HttpStatus.BAD_REQUEST
      );
    }
    return response;
  }

  /**
   * Adds protocol mappers to a Keycloak client.
   *
   * @param token - Authorization token.
   *
   * @returns A Promise resolving to the response from Keycloak.
   *
   * @throws HttpException if adding protocol mappers fails.
   */
  async addProtocolMapper({ token }: any): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakClientId = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakApiUrl = `${keycloakHost}/admin/realms/${keycloakRealmName}/clients/${keycloakClientId}/protocol-mappers/models`;
    const mapperData = [
      {
        name: 'UserIdMapper',
        protocol: 'openid-connect',
        protocolMapper: 'user-attribute-mapper',
        config: {
          'claim.name': 'userId',
          'jsonType.label': 'userId',
          'user.attribute': 'userId',
          'id.token.claim': 'true',
          'access.token.claim': 'true'
        }
      },
      {
        name: 'RolesMapper',
        protocol: 'openid-connect',
        protocolMapper: 'user-attribute-mapper',
        config: {
          'claim.name': 'roles',
          'jsonType.label': 'roles',
          'user.attribute': 'roles',
          'id.token.claim': 'true',
          'access.token.claim': 'true',
          multivalued: 'true'
        }
      }
    ];
    const response = await fetch(keycloakApiUrl, {
      headers: {
        'content-type': 'application/json',
        authorization: token
      },
      body: mapperData.toString(),
      method: 'POST'
    });

    if (!response.ok) {
      throw new HttpException(
        {
          status: 'error',
          message: `error adding protocol mappers to keycloak due to ${response.statusText}`
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return response;
  }

  /**
   * Gets the ID of a Keycloak role.
   *
   * @param bearerToken - Authorization token.
   * @param roleName - Name of the role.
   *
   * @returns A Promise resolving to the ID of the role.
   *
   * @throws Error if fetching the role ID fails.
   */
  async getRoleId({
    bearerToken,
    roleName = 'manage-users'
  }: any): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const queryParams = {
      search: roleName
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/roles?${queryString}`;

    const response = await fetch(keycloakBaseURL, {
      headers: {
        accept: 'application/json',
        authorization: bearerToken
      },
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(
        `Unable to fetch the role id due to ${response.statusText}`
      );
    }
    const resp = await response.json();
    return resp;
  }

  /**
   * Assigns a role to a user in Keycloak.
   * @param userId - ID of the user.
   * @param roleId - ID of the role.
   * @param bearerToken - Bearer token for authentication.
   * @param roleName - Name of the role.
   *
   * @throws Error if assigning role to the user fails.
   */
  async assignRoleToUser({
    userId,
    roleId,
    bearerToken,
    roleName = 'manage-users'
  }: any): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/users/${userId}/role-mappings/realm`;
    const response = await fetch(keycloakBaseURL, {
      headers: {
        accept: 'application/json',
        authorization: bearerToken
      },
      body: JSON.stringify([
        {
          id: roleId,
          name: roleName,
          description: `${roleName}`,
          composite: false,
          clientRole: false,
          containerId: keycloakRealmName
        }
      ]),
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error(`Error assigning role to the user with id ${userId}`);
    }
    const resp = await response.json();
    return resp;
  }

  /**
   * Gets the ID of a Keycloak client.
   *
   * @param bearerToken - Authorization token.
   * @param clientName - Name of the client.
   *
   * @returns A Promise resolving to the ID of the client.
   *
   * @throws Error if fetching the client ID fails.
   */
  private async getClientId({
    bearerToken,
    clientName = 'realm-management'
  }: {
    bearerToken: string;
    clientName?: string;
  }): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const queryParams = {
      clientId: clientName
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/clients?${queryString}`;

    const response = await fetch(keycloakBaseURL, {
      headers: {
        accept: 'application/json',
        authorization: bearerToken
      },
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(
        `Error fetching client for the client id ${clientName} due to ${response.statusText}`
      );
    }
    const resp = await response.json();
    return resp;
  }

  /**
   * Gets the ID of a client role in Keycloak.
   *
   * @param bearerToken - Authorization token.
   * @param clientId - ID of the client.
   * @param roleName - Name of the role.
   *
   * @returns A Promise resolving to the ID of the client role.
   *
   * @throws Error if fetching the client role ID fails.
   */
  private async getClientRoleId({
    bearerToken,
    clientId,
    roleName = 'manage-users'
  }: {
    bearerToken: string;
    clientId: string;
    roleName?: string;
  }): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const queryParams = {
      search: roleName
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/clients/${clientId}/roles?${queryString}`;

    const response = await fetch(keycloakBaseURL, {
      headers: {
        accept: 'application/json',
        authorization: bearerToken
      },
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(
        `Unable to fetch the client role due to ${response.statusText}`
      );
    }
    const resp = await response.json();
    return resp;
  }

  /**
   * Assigns a client role to a Keycloak user.
   *
   * @param userId - ID of the user.
   * @param roleId - ID of the role.
   * @param bearerToken - Authorization token.
   * @param clientId - ID of the client.
   * @param roleName - Name of the role.
   *
   * @returns A Promise resolving to the response from Keycloak.
   * @throws Error if assigning the client role to the user fails.
   */
  private async assignClientRoleToUser({
    userId,
    roleId,
    bearerToken,
    clientId,
    roleName = 'manage-users'
  }: {
    userId: string;
    roleId: string;
    bearerToken: string;
    clientId: string;
    roleName?: string;
  }): Promise<any> {
    const keycloakHost = this.configService.get('KEYCLOAK_BASE_URL');
    const keycloakRealmName = this.configService.get('KEYCLOAK_REALM_NAME');
    const keycloakBaseURL = `${keycloakHost}/admin/realms/${keycloakRealmName}/users/${userId}/role-mappings/clients/${clientId}`;
    const response = await fetch(keycloakBaseURL, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        authorization: bearerToken
      },
      body: JSON.stringify([
        {
          id: roleId,
          name: roleName,
          description: `${roleName}`
        }
      ]),
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(
        `Error assigning client role to the user with id ${userId} due to ${response.statusText}`
      );
    }
    return response;
  }

  /**
   * Adds a client role to a user in Keycloak.
   *
   * @param userId - ID of the user.
   * @param bearerToken - Bearer token for authentication.
   * @param roleName - Name of the client role.
   *
   * @throws Error if adding client role to the user fails.
   */
  async addClientRoleToUser({
    userId,
    roleName = 'manage-users'
  }: {
    userId: string;
    roleName?: string;
  }): Promise<any> {
    const adminUsername = this.configService.get('KEYCLOAK_ADMIN_EMAIL');
    const adminPassword = this.configService.get('KEYCLOAK_ADMIN_PASSWORD');
    const adminInfo = await this.login({
      username: adminUsername,
      password: adminPassword
    });

    const bearerToken = `Bearer ${adminInfo.access_token}`;

    const clientResponse = await this.getClientId({ bearerToken });
    const clientId = clientResponse[0]?.id;
    const rolesResponse = await this.getClientRoleId({ bearerToken, clientId });
    const role = rolesResponse.find((r: any) => r.name === roleName);

    if (!role) {
      throw new Error(`Role ${roleName} not found for client ${clientId}.`);
    }

    await this.assignClientRoleToUser({
      userId,
      bearerToken,
      roleId: role.id,
      clientId,
      roleName
    });
  }
}
