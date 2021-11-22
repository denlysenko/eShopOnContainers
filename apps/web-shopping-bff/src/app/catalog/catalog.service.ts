import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '../http';
import { CatalogBrandReadDto } from './dto/catalog-brand-read.dto';
import { CatalogItemReadDto } from './dto/catalog-item-read.dto';
import { CatalogItemsReadDto } from './dto/catalog-items-read.dto';
import { CatalogTypeReadDto } from './dto/catalog-type-read.dto';

@Injectable()
export class CatalogService {
  private readonly _baseUrl = `${process.env.CATALOG_URL}/api/v1`;

  constructor(private readonly _httpService: HttpService) {}

  async getItems(
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/items?pageSize=${pageSize}&pageIndex=${pageIndex}`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getItemById(id: number): Promise<CatalogItemReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/items/${id}`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getItemsByName(
    name: string,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/items/withname/${name}?pageSize=${pageSize}&pageIndex=${pageIndex}`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getItemsByTypeIdAndBrandId(
    catalogTypeId: number,
    catalogBrandId: number,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/items/type/${catalogTypeId}/brand/${catalogBrandId}?pageSize=${pageSize}&pageIndex=${pageIndex}`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getItemsByBrandId(
    catalogBrandId: number,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/items/type/all/brand/${catalogBrandId}?pageSize=${pageSize}&pageIndex=${pageIndex}`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getCatalogTypes(): Promise<CatalogTypeReadDto[]> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/catalog-types`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getCatalogBrands(): Promise<CatalogBrandReadDto[]> {
    const result = await this._httpService.get(
      `${this._baseUrl}/catalog/catalog-brands`
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }
}
