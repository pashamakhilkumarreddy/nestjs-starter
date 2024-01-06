import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { FindAndCountOptions, Op } from 'sequelize';
import { isEmpty } from 'lodash';
import { FilterTypes, SORT_TYPES, SortByTypes } from '../constants';
import { BasePaginationDto } from '../dtos';

@Injectable()
export class DBService {
  constructor() {}

  private readonly logger = new Logger(DBService.name);

  /**
   * Generates a Sequelize-compatible pagination object based on the provided query parameters.
   *
   * @param query - The pagination query parameters.
   *
   * @returns Sequelize-compatible pagination options.
   *
   * @throws BadGatewayException if the pagination request is invalid.
   */
  public pagination(query: BasePaginationDto) {
    const { limit, page } = query;
    if (!limit || !page) return {};
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    if (parsedLimit <= 0 || parsedPage <= 0) {
      throw new BadGatewayException('Invalid pagination request');
    }
    const filterObject: FindAndCountOptions = {
      offset: (parsedPage - 1) * parsedLimit,
      limit: parsedLimit
    };
    return filterObject;
  }

  /**
   * Constructs a Sequelize-compatible filter query based on the provided filters and filter type.
   *
   * @param filters - The filters to apply.
   *
   * @param type - The type of filter (e.g., USERS, etc.).
   *
   * @returns Sequelize-compatible filter query.
   */
  public getMultipleFilterQuery(filters: any, type: FilterTypes): object {
    const queryData = [];
    const { USERS } = FilterTypes;

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (filters[key]) {
          const parsedKey =
            typeof filters[key] === 'string'
              ? JSON.parse(filters[key])
              : filters[key];

          const value = parsedKey
            .filter((item: any) => Boolean(String(item)?.trim()))
            .map((item: any) => String(item).replace(/\s+/g, ' ').trim());
          if (type === USERS) {
            const singleQuery = this.getWhereFilterQueryUsers(key, value);
            queryData.push(singleQuery);
          }
        }
      }
    }
    this.logger.log(queryData);
    return { [Op.and]: queryData };
  }

  /**
   * Generates multiple sorting queries based on the specified parameters.
   *
   * @param sortBy - An array of SortByTypes indicating the fields to sort by.
   * @param sortTypes - An array of strings representing sorting types (e.g., 'asc' or 'desc').
   * @param type - The sorting type for a specific category (e.g., USERS).
   *
   * @returns An array of sorting queries.
   */
  public getMultipleSortQuery({
    sortBy,
    sortTypes,
    type
  }: {
    sortBy: SortByTypes[];
    sortTypes: string[];
    type: SORT_TYPES;
  }): any[] {
    const orderByData: any[] = [];

    if (isEmpty(sortBy) || isEmpty(sortTypes)) {
      orderByData.push(['createdAt', SortByTypes.DESC]);
      return orderByData;
    }

    const { USERS } = SORT_TYPES;

    switch (type) {
      case USERS: {
        const singleQuery = this.getOrderByUsers(sortTypes, sortBy);
        orderByData.push(...singleQuery);
        break;
      }
    }

    this.logger.log(orderByData);
    return orderByData;
  }

  /**
   * Constructs a Sequelize-compatible WHERE query for filtering users based on the specified type and values.
   *
   * @param type - The type of filter (e.g., name, role, title).
   * @param value - The values to filter by.
   *
   * @returns Sequelize-compatible WHERE query for users.
   */
  public getWhereFilterQueryUsers(type: string, value: any): object {
    const orConditions: any = [];

    switch (type) {
      case 'name':
        for (const item of value) {
          orConditions.push(
            {
              firstName: { [Op.iLike]: `%${item}%` }
            },
            {
              lastName: { [Op.iLike]: `%${item}%` }
            }
          );
        }
        break;
      case 'role':
        orConditions.push({
          name: { [Op.in]: value }
        });
        break;
      case 'title':
        for (const item of value) {
          orConditions.push({
            [type]: { [Op.iLike]: `%${item}%` }
          });
        }
        break;
      default:
        break;
    }

    const whereQuery = {
      [Op.or]: orConditions
    };

    return whereQuery;
  }

  /**
   * Generates an order array for Sequelize queries based on provided sort types and sort by types for users.
   *
   * @param sortTypes - An array of strings representing the fields to sort by.
   * @param sortBy - An array of SortByTypes representing the sort order for each field.
   *
   * @returns An array representing the order clause for Sequelize queries related to users.
   */
  public getOrderByUsers(sortTypes: string[], sortBy: SortByTypes[] = []): any {
    const order: any[] = [];

    sortTypes.forEach((type: string, i: number) => {
      const sortOrder = sortBy[i] ? sortBy[i] : SortByTypes.DESC;
      switch (type) {
        case 'name':
          order.push(
            ['profile', 'firstName', sortOrder],
            ['profile', 'lastName', sortOrder]
          );
          break;
        case 'role':
          order.push(['role', 'name', sortOrder]);
          break;
        case 'title':
          order.push(['profile', 'title', sortOrder]);
          break;
        default:
          break;
      }
    });
    if (!order.length) {
      order.push(['createdAt', SortByTypes.DESC]);
    }
    return order;
  }
}
