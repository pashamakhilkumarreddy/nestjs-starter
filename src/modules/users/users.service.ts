import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { isEmpty, omit, pick } from 'lodash';
import { UserProfile, Role, User } from 'src/entities';
import { KeyCloakService, DBService } from 'src/common/services';
import {
  FilterTypes,
  KeyCloakUserObject,
  RoleTypes,
  SORT_TYPES
} from 'src/common/constants';
import {
  AddUserDTO,
  BaseUserDto,
  PaginatedUserDto,
  UpdateUserDTO,
  UpdateUserPasswordDTO,
  UserIdParam
} from './dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly keyCloakService: KeyCloakService,
    private readonly dbService: DBService,
    private readonly sequelize: Sequelize,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(Role)
    private readonly roleModel: typeof Role
  ) {}

  /**
   * Create a new user with the given details.
   *
   * @param req - Express request object.
   * @param params - Parameters extracted from the request.
   * @param body - Request body containing details of the new user.
   *
   * @returns A Promise containing the status and data of the operation.
   */
  async create(req: any, body: AddUserDTO): Promise<any> {
    const authToken = req.headers.authorization;
    let keycloakUserId = null;
    try {
      const { title, firstName, lastName, email, countryCode, phone, roles } =
        body;
      const { createdBy, modifiedBy }: AddUserDTO = req.body;
      // create keycloak user
      /* eslint-disable no-useless-catch*/
      const result = await this.sequelize.transaction(async (t) => {
        try {
          const transactionHost = { transaction: t };
          const newUser: any = await this.userModel.build(transactionHost);

          await this.keyCloakService.createKeycloakUser({
            token: authToken,
            keyCloakBody: {
              userId: newUser.id,
              firstName,
              lastName,
              email,
              roles
            }
          });

          // fetch created keycloak user for unique ID
          const keycloakUserData = await this.keyCloakService.fetchKeycloakUser(
            {
              bearerToken: authToken,
              email
            }
          );
          const keycloakUser = keycloakUserData[0];
          keycloakUserId = keycloakUser.id;
          newUser.keycloakId = keycloakUser.id;

          if (createdBy && modifiedBy) {
            newUser.createdBy = createdBy;
            newUser.modifiedBy = modifiedBy;
          }
          await newUser.save(transactionHost);
          const userRole = await this.roleModel.create(
            {
              name: roles[0].name,
              createdBy,
              modifiedBy
            },
            transactionHost
          );
          await newUser.$set('role', userRole, transactionHost);
          await newUser.save();
          if (roles[0].name === RoleTypes.SUPER_ADMIN) {
            await this.keyCloakService.addClientRoleToUser({
              userId: keycloakUserId
            });
          }
          const userProfile = await this.userProfileModel.create(
            {
              title,
              firstName,
              lastName,
              email,
              countryCode,
              phone,
              createdBy,
              modifiedBy
            },
            transactionHost
          );
          await newUser.$set('profile', userProfile, transactionHost);

          await this.keyCloakService.sendUpdatePasswordMail({
            bearerToken: authToken,
            keycloakUserId: keycloakUser.id
          });

          return newUser;
        } catch (error) {
          throw error;
        }
      });
      /* eslint-enable no-useless-catch */
      return {
        status: 'success',
        data: result
      };
    } catch (err: any) {
      if (keycloakUserId) {
        await this.keyCloakService.deleteKeycloakUser({
          token: authToken,
          userId: keycloakUserId
        });
      }
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error adding a new user',
          error: err
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Update details of an existing user.
   *
   * @param req - Express request object.
   *
   * @param params - Parameters extracted from the request.
   * @param body - Request body containing updated details for the user.
   *
   * @returns A Promise containing the status and data of the operation.
   */
  async update(
    req: any,
    user: KeyCloakUserObject,
    params: UserIdParam,
    body: UpdateUserDTO
  ): Promise<any> {
    try {
      const { isAdmin, userId: currUserId } = user;
      const { userId } = params;

      if (!isAdmin && currUserId !== userId) {
        throw new UnauthorizedException();
      }

      const { roles } = body;
      const { modifiedBy } = req.body;
      const userBody = pick(body, ['status', 'emailVerified']);
      const userProfileBody = omit(body, ['roles', 'status', 'emailVerified']);

      /* eslint-disable no-useless-catch */
      const result = await this.sequelize.transaction(async (t) => {
        try {
          const transactionHost = { transaction: t };

          if (!isEmpty(userBody)) {
            await this.userModel.update(
              {
                ...userBody,
                modifiedBy
              },
              {
                where: {
                  id: userId
                },
                ...transactionHost,
                returning: true
              }
            );
          }

          if (roles && roles.length) {
            await this.roleModel.update(
              {
                name: roles[0].name,
                modifiedBy
              },
              {
                ...transactionHost,
                where: { userId }
              }
            );
          }

          if (!isEmpty(userProfileBody)) {
            if (userProfileBody.email) {
              const user = await this.userModel.findByPk(userId, {
                attributes: ['keycloakId'],
                raw: true
              });
              await this.keyCloakService.updateKeycloakUserDetails({
                userId: user.keycloakId,
                userBody: {
                  email: userProfileBody.email
                }
              });
            }
            await this.userProfileModel.update(
              {
                ...userProfileBody,
                modifiedBy
              },
              {
                ...transactionHost,
                where: { userId }
              }
            );
          }
        } catch (error) {
          throw error;
        }
      });
      /* eslint-enable no-useless-catch */

      return {
        status: 'success',
        data: result
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error updating user',
          error: err
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Retrieve detailed information about a specific user.
   *
   * @param id - User ID.
   *
   * @returns A Promise containing the status and detailed data of the user.
   */
  async find(id: string): Promise<any> {
    try {
      const user = await this.userModel.findByPk(id, {
        attributes: ['id', 'keycloakId', 'status', 'auth_type'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name']
          },
          {
            model: UserProfile,
            as: 'profile',
            attributes: [
              'id',
              'image',
              'title',
              'firstName',
              'lastName',
              'email',
              'countryCode',
              'phone'
            ]
          }
        ],
        plain: true
      });
      const result: any = {
        ...user.toJSON()
      };
      return {
        status: 'success',
        data: result
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error fetching user',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Asynchronously retrieves paginated user data based on specified parameters.
   *
   * @param {PaginatedUserDto | BaseUserDto} query - Additional query parameters for data retrieval.
   *
   * @returns {Promise<any>} - A Promise that resolves with the paginated user data.
   *
   * @throws {HttpException} - Throws an HTTP exception if there's an error during data retrieval.
   */
  async findAll(query: PaginatedUserDto | BaseUserDto): Promise<any> {
    try {
      const { name, role, title, sortTypes } = query;

      const { page, limit, sortBy } = query as PaginatedUserDto;

      const filter = {
        name,
        role,
        title
      };

      const filteredObj = Object.fromEntries(
        Object.entries(filter).filter(([, value]) => value !== undefined)
      );

      const value = this.dbService.pagination({ page, limit });

      const users = await this.userModel.findAndCountAll({
        ...value,
        attributes: [
          'id',
          'keycloakId',
          'status',
          'auth_type',
          'emailVerified',
          'createdAt'
        ],
        order: [
          ...this.dbService.getMultipleSortQuery({
            sortTypes,
            sortBy,
            type: SORT_TYPES.USERS
          })
        ],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
            where: {
              ...this.dbService.getMultipleFilterQuery(
                { role: filteredObj.role },
                FilterTypes.USERS
              )
            }
          },
          {
            model: UserProfile,
            as: 'profile',
            attributes: [
              'id',
              'title',
              'firstName',
              'lastName',
              'email',
              'countryCode',
              'phone'
            ],
            where: {
              ...this.dbService.getMultipleFilterQuery(
                { name: filteredObj.name, title: filteredObj.title },
                FilterTypes.USERS
              )
            }
          }
        ]
      });

      return {
        status: 'success',
        data: users
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error fetching users',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Asynchronously delete a user based on their ID.
   *
   * @param req - Express request object.
   * @param id - User ID to be deleted.
   *
   * @returns A promise resolving to the result of the deletion operation.
   *
   */
  async deleteUser(req: any, id: string): Promise<any> {
    try {
      const user = await this.userModel.findByPk(id, {
        attributes: ['id', 'keycloakId'],
        include: [UserProfile]
      });
      if (user) {
        const { profile } = user;
        if (profile) {
          await profile.destroy();
        }

        await user.destroy();

        const authToken = req.headers.authorization;
        await this.keyCloakService.deleteKeycloakUser({
          token: authToken,
          userId: user.keycloakId
        });
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'no user to delete'
          },
          HttpStatus.NOT_FOUND
        );
      }

      delete user.profile;

      return {
        status: 'success'
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error deleting user',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Update the password of a user.
   *
   * @param params - Parameters extracted from the request.
   * @param body - Request body containing the updated password.
   *
   * @returns A Promise containing the status and data of the password update operation.
   */
  async updatePassword(
    params: UserIdParam,
    body: UpdateUserPasswordDTO,
    currUser: KeyCloakUserObject
  ): Promise<any> {
    try {
      const { userId } = params;
      const { userId: currUserId } = currUser;

      if (currUserId !== userId) {
        throw new UnauthorizedException(
          '"Cannot·update·other·user\'s·password"'
        );
      }

      const { password } = body;

      const user = await this.userModel.findByPk(userId, {
        attributes: ['keycloakId', 'id'],
        raw: true
      });

      await this.keyCloakService.updateKeycloakUserPassword({
        userId: user.keycloakId,
        newPassword: password
      });

      return {
        status: 'success'
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error updating user password',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
