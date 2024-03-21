import { Test, TestingModule } from '@nestjs/testing';
import { UsersServiceMock } from './users.service.mock';
import { UsersService } from '../../src/modules/users/users.service';
import {
  UserIdParam,
  AddUserDTO,
  UpdateUserDTO,
  UpdateUserPasswordDTO,
  PaginatedUserDto,
  sortTypes
} from '../../src/modules/users/dtos/users.dto';
import { KeyCloakUserObject, RoleTypes, SortByTypes } from '../../src/common/constants';

describe('UsersService', () => {
  let usersServiceMock: UsersServiceMock;
  let usersService: UsersService;

  beforeEach(async () => {
    usersServiceMock = new UsersServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockRequest = {
        body: { createdBy: 'johnDoe', modifiedBy: 'johnDoe' }
      };
      const mockUserDTO: AddUserDTO = {
        image: '',
        title: 'Software Engineer',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        countryCode: '44',
        phone: '1234567890',
        roles: [
          {
            name: RoleTypes.USER
          }
        ],
        createdBy: 'johnDoe',
        modifiedBy: 'johnDoe'
      };

      const result = await usersService.create(mockRequest, mockUserDTO);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const mockRequest = { body: { modifiedBy: 'johnDoe' } };
      const mockParams: UserIdParam = { userId: 'sasuke890' };
      const mockUser: KeyCloakUserObject = {
        sub: '9876543210',
        email_verified: false,
        name: 'John Doe',
        preferred_username: 'john_doe',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@example.com',
        userId: 'sasuke890',
        roles: ['admin'],
        isAdmin: true
      };

      const mockUserDTO: UpdateUserDTO = {
        image: '',
        title: 'Software Engineer',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        countryCode: '44',
        phone: '1234567890',
        roles: [
          {
            name: RoleTypes.ADMIN
          }
        ],
        status: 'active',
        modifiedBy: 'johnDoe'
      };

      const result = await usersService.update(
        mockRequest,
        mockUser,
        mockParams,
        mockUserDTO
      );

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id', mockParams.userId);
    });
  });

  describe('find', () => {
    it('should find a user by ID', async () => {
      const mockParams: UserIdParam = { userId: '1' };

      const result = await usersService.find(mockParams.userId);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id', mockParams.userId);
    });
  });

  describe('findAll', () => {
    it('should find all users based on query parameters', async () => {
      const mockQuery: PaginatedUserDto = {
        page: 1,
        limit: 10,
        sortBy: [SortByTypes.ASC],
        sortTypes: [sortTypes.name],
        name: ["naruto", "hinata"],
        role: [RoleTypes.SUPER_ADMIN, RoleTypes.ADMIN],
        title: ["cfo"]
      };

      const result = await usersService.findAll(mockQuery);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('rows');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const mockRequest = { headers: { authorization: '' } };
      const mockParams: UserIdParam = { userId: '1' };

      const result = await usersService.deleteUser(
        mockRequest,
        mockParams.userId
      );

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id', mockParams.userId);
    });
  });

  describe('updatePassword', () => {
    it('should update the password for a user', async () => {
      const mockParams: UserIdParam = { userId: '1' };
      const mockUserPasswordDTO: UpdateUserPasswordDTO = {
        password: 'jj9IaEwb4HGxwcHQ'
      };

      const currUser: KeyCloakUserObject = {
        sub: '9876543210',
        email_verified: false,
        name: 'Hinata Uzumaki',
        preferred_username: 'hinata',
        given_name: 'Hinata',
        family_name: 'Uzumaki',
        email: 'hinata@uzumaki.com',
        userId: '1',
        roles: ['admin'],
        isAdmin: true
      };

      const result = await usersService.updatePassword(
        mockParams,
        mockUserPasswordDTO,
        currUser
      );

      expect(result.status).toEqual('success');
      expect(result.data).toBeNull();
    });
  });
});
