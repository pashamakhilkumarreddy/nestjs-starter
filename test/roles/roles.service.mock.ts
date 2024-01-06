import { AddRoleDTO } from '../../src/modules/roles/dtos/roles.dto';

export class RolesServiceMock {
  //@ts-ignore
  create = jest.fn(async (req: any, body: AddRoleDTO) => {
    return {
      status: 'success',
      data: {
        id: '1',
        name: body.name,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy
      }
    };
  });

  //@ts-ignore
  find = jest.fn(async (id: string) => {
    return {
      status: 'success',
      data: {
        id,
        name: 'Example Role'
      }
    };
  });

  //@ts-ignore
  findAll = jest.fn(async () => {
    return {
      status: 'success',
      data: [
        {
          id: '1',
          name: 'Role 1'
        },
        {
          id: '2',
          name: 'Role 2'
        }
      ]
    };
  });

  //@ts-ignore
  delete = jest.fn(async (id: string) => {
    return {
      status: 'success',
      data: {
        id,
        message: 'Role deleted successfully.'
      }
    };
  });
}
