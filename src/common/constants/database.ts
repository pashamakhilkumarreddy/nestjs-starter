export const TABLE_CONFIG = {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  schema: 'public'
  // paranoid: false, // Include soft-deleted records
};

export interface KeyCloakUserObject {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  userId: string;
  roles: any[];
  isAdmin?: boolean;
}
