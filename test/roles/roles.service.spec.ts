import { Test, TestingModule } from '@nestjs/testing';
import { RolesServiceMock } from './roles.service.mock';
import { RolesService } from '../../src/modules/roles/roles.service';
import { AddRoleDTO } from '../../src/modules/roles/dtos/roles.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RoleTypes } from '../../src/common/constants';

describe('RolesService', () => {
  let rolesServiceMock: RolesServiceMock;
  let rolesService: RolesService;

  beforeEach(async () => {
    rolesServiceMock = new RolesServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RolesService,
          useValue: rolesServiceMock
        }
      ]
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const mockRequest = {
        body: { createdBy: 'johnDoe', modifiedBy: 'johnDoe' }
      };
      const mockRoleDTO: AddRoleDTO = {
        name: RoleTypes.ADMIN,
        createdBy: 'johnDoe',
        modifiedBy: 'johnDoe'
      };

      const result = await rolesService.create(mockRequest, mockRoleDTO);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name', mockRoleDTO.name);
      expect(result.data).toHaveProperty(
        'createdBy',
        mockRequest.body.createdBy
      );
      expect(result.data).toHaveProperty(
        'modifiedBy',
        mockRequest.body.modifiedBy
      );
    });

    it('should handle errors when creating a role', async () => {
      const mockRequest = {
        body: { createdBy: 'johnDoe', modifiedBy: 'johnDoe' }
      };
      const mockRoleDTO: AddRoleDTO = {
        name: RoleTypes.ADMIN,
        createdBy: 'johnDoe',
        modifiedBy: 'johnDoe'
      };

      rolesServiceMock.create.mockRejectedValueOnce(
        new HttpException('Role creation failed', HttpStatus.BAD_REQUEST)
      );

      await expect(
        rolesService.create(mockRequest, mockRoleDTO)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('find', () => {
    it('should find a role by ID', async () => {
      const roleId = '1';

      const result = await rolesService.find(roleId);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id', roleId);
    });

    it('should handle errors when finding a role', async () => {
      const roleId = '167';

      rolesServiceMock.find.mockRejectedValueOnce(
        new HttpException('Role not found', HttpStatus.NOT_FOUND)
      );

      await expect(rolesService.find(roleId)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      const result = await rolesService.findAll();

      expect(result.status).toEqual('success');
      expect(result.data).toHaveLength(2); // Adjust based on your mock data
    });

    it('should handle errors when finding all roles', async () => {
      rolesServiceMock.findAll.mockRejectedValueOnce(
        new HttpException(
          'Error fetching roles',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );

      await expect(rolesService.findAll()).rejects.toThrowError(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a role by ID', async () => {
      const roleId = '1';

      const result = await rolesService.delete(roleId);

      expect(result.status).toEqual('success');
      expect(result.data).toHaveProperty('id', roleId);
    });

    it('should handle errors when deleting a role', async () => {
      const roleId = '1';

      rolesServiceMock.delete.mockRejectedValueOnce(
        new HttpException('Role deletion failed', HttpStatus.BAD_REQUEST)
      );

      await expect(rolesService.delete(roleId)).rejects.toThrow(HttpException);
    });
  });
});
