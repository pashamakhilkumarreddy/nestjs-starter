import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MasterRole } from 'src/entities';
import { AddRoleDTO } from './dtos/roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(MasterRole)
    private masterRoleModel: typeof MasterRole
  ) {}

  /**
   * Creates a new role with the provided information.
   *
   * @param req - The HTTP request object.
   * @param body - DTO containing information for creating a new role.
   *
   * @returns Object containing the status and data of the created role.
   * @throws HttpException if an error occurs during role creation.
   */
  async create(req: any, body: AddRoleDTO): Promise<any> {
    try {
      const { name } = body;

      const { createdBy, modifiedBy } = req.body;

      const role = await this.masterRoleModel.create({
        name,
        createdBy,
        modifiedBy
      });

      return {
        status: 'success',
        data: role
      };
    } catch (err: any) {
      throw new HttpException(
        {
          status: 'error',
          message: 'error creating a new role',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Finds and retrieves a role by its ID.
   *
   * @param id - The ID of the role to be retrieved.
   *
   * @returns Object containing the status and data of the retrieved role.
   * @throws HttpException if an error occurs during role retrieval.
   */
  async find(id: string): Promise<any> {
    try {
      const role = await this.masterRoleModel.findByPk(id);
      return {
        status: 'success',
        data: role
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error fetching role details',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Retrieves all roles in the system.
   *
   * @returns Object containing the status and data of all roles.
   *
   * @throws HttpException if an error occurs during role retrieval.
   */
  async findAll(): Promise<any> {
    try {
      const roles = await this.masterRoleModel.findAll({
        attributes: ['id', 'name']
      });
      return {
        status: 'success',
        data: roles
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error fetching roles',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Deletes a role with the provided ID.
   *
   * @param id - The ID of the role to be deleted.
   *
   * @returns Object containing the status and data of the deleted role.
   * @throws HttpException if an error occurs during role deletion.
   */
  async delete(id: string): Promise<any> {
    try {
      const deletedRole = await this.masterRoleModel.findByPk(id);
      if (deletedRole) {
        await deletedRole.destroy();
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'no role to delete'
          },
          HttpStatus.NOT_FOUND
        );
      }
      return {
        status: 'success',
        data: deletedRole
      };
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: 'error',
          message: 'error deleting a role',
          error: err.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
