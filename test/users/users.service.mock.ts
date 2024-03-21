import {
    AddUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
    UserIdParam,
    PaginatedUserDto,
  } from '../../src/modules/users/dtos/users.dto';
  
  export class UsersServiceMock {
    //@ts-ignore
    create = jest.fn(async (req: any, body: AddUserDTO) => {
      return {
        status: 'success',
        data: {
          id: '1',
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
      };
    });
  
    //@ts-ignore
    update = jest.fn(async (req: any, params: UserIdParam, body: UpdateUserDTO) => {
      return {
        status: 'success',
        data: {
          id: params.userId,
        },
      };
    });
  
    //@ts-ignore
    find = jest.fn(async (id: string) => {
      return {
        status: 'success',
        data: {
          id,
          name: 'Example User',
        },
      };
    });
  
    //@ts-ignore
    findAll = jest.fn(async (query: PaginatedUserDto) => {
      return {
        status: 'success',
        data: {
          count: 2,
          rows: [
            {
              id: '1',
              name: 'User 1',
            },
            {
              id: '2',
              name: 'User 2',
            },
          ],
        },
      };
    });
  
    //@ts-ignore
    deleteUser = jest.fn(async (req: any, id: string) => {
      return {
        status: 'success',
        data: {
          id,
          message: 'User deleted successfully.',
        },
      };
    });
  
    //@ts-ignore
    updatePassword = jest.fn(async (params: UserIdParam, body: UpdateUserPasswordDTO) => {
      return {
        status: 'success',
        data: null,
      };
    });
  }
  