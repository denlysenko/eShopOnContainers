import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CatalogBrandReadDto } from './dto/catalog-brand-read.dto';
import { CatalogItemReadDto } from './dto/catalog-item-read.dto';
import { CatalogItemsReadDto } from './dto/catalog-items-read.dto';
import { CatalogTypeReadDto } from './dto/catalog-type-read.dto';

const DEFAULT_PAGE_SIZE = 10;

@Controller('v1/catalog')
export class CatalogController {
  constructor(private readonly _catalogService: CatalogService) {}

  // GET api/v1/catalog/items[?pageSize=3&pageIndex=10]
  @Get('items')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Get catalog items' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogItemsReadDto,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    description: 'pageIndex',
    type: Number,
    required: false,
  })
  getItems(
    @Query('pageSize', new DefaultValuePipe(DEFAULT_PAGE_SIZE), ParseIntPipe)
    pageSize?: number,
    @Query('pageIndex', new DefaultValuePipe(0), ParseIntPipe)
    pageIndex?: number
  ): Promise<CatalogItemsReadDto> {
    return this._catalogService.getItems(pageSize, pageIndex);
  }

  // GET api/v1/catalog/items/{id}
  @Get('items/:id')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Get catalog item by id' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found record',
    type: CatalogItemReadDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  getItemById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CatalogItemReadDto> {
    return this._catalogService.getItemById(id);
  }

  // GET api/v1/catalog/items/withname/samplename[?pageSize=3&pageIndex=10]
  @Get('items/withname/:name')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Get catalog items by name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogItemsReadDto,
  })
  @ApiParam({
    name: 'name',
    description: 'Item name',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    description: 'pageIndex',
    type: Number,
    required: false,
  })
  getItemsByName(
    @Param('name') name: string,
    @Query('pageSize', new DefaultValuePipe(DEFAULT_PAGE_SIZE), ParseIntPipe)
    pageSize: number,
    @Query('pageIndex', new DefaultValuePipe(0), ParseIntPipe) pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    return this._catalogService.getItemsByName(name, pageSize, pageIndex);
  }

  // GET api/v1/catalog/items/type/{catalogTypeId}/brand/{catalogBrandId}[?pageSize=3&pageIndex=10]
  @Get('items/type/:catalogTypeId/brand/:catalogBrandId')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Get catalog items by type id and brand id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogItemsReadDto,
  })
  @ApiParam({
    name: 'catalogTypeId',
    description: 'Catalog type id',
    required: true,
  })
  @ApiParam({
    name: 'catalogBrandId',
    description: 'Catalog brand id',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    description: 'pageIndex',
    type: Number,
    required: false,
  })
  getItemsByTypeIdAndBrandId(
    @Param('catalogTypeId', ParseIntPipe) catalogTypeId: number,
    @Param('catalogBrandId', ParseIntPipe) catalogBrandId: number,
    @Query('pageSize', new DefaultValuePipe(DEFAULT_PAGE_SIZE), ParseIntPipe)
    pageSize: number,
    @Query('pageIndex', new DefaultValuePipe(0), ParseIntPipe) pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    return this._catalogService.getItemsByTypeIdAndBrandId(
      catalogTypeId,
      catalogBrandId,
      pageSize,
      pageIndex
    );
  }

  // GET api/v1/catalog/items/type/all/brand[?pageSize=3&pageIndex=10]
  @Get('items/type/all/brand/:catalogBrandId')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Get catalog items by brand id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogItemsReadDto,
  })
  @ApiParam({
    name: 'catalogBrandId',
    description: 'Catalog brand id',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'pageSize',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageIndex',
    description: 'pageIndex',
    type: Number,
    required: false,
  })
  getItemsByBrandId(
    @Param('catalogBrandId', ParseIntPipe) catalogBrandId: number,
    @Query('pageSize', new DefaultValuePipe(DEFAULT_PAGE_SIZE), ParseIntPipe)
    pageSize: number,
    @Query('pageIndex', new DefaultValuePipe(0), ParseIntPipe) pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    return this._catalogService.getItemsByBrandId(
      catalogBrandId,
      pageSize,
      pageIndex
    );
  }

  // GET api/v1/catalog/catalog-types
  @Get('catalog-types')
  @ApiTags('Catalog Types')
  @ApiOperation({ summary: 'Get catalog types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogTypeReadDto,
    isArray: true,
  })
  getCatalogTypes(): Promise<CatalogTypeReadDto[]> {
    return this._catalogService.getCatalogTypes();
  }

  // GET api/v1/catalog/catalog-brands
  @Get('catalog-brands')
  @ApiTags('Catalog Brands')
  @ApiOperation({ summary: 'Get catalog brands' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found records',
    type: CatalogBrandReadDto,
    isArray: true,
  })
  getCatalogBrands(): Promise<CatalogBrandReadDto[]> {
    return this._catalogService.getCatalogBrands();
  }
}
