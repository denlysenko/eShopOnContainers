import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppService,
  CatalogBrandCreateDto,
  CatalogBrandReadDto,
  CatalogItemCreateDto,
  CatalogItemReadDto,
  CatalogItemsReadDto,
  CatalogItemUpdateDto,
  CatalogTypeCreateDto,
  CatalogTypeReadDto,
  DEFAULT_PAGE_SIZE,
  ValidationErrorDto,
} from '../application';

@Controller('v1/catalog')
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return this.appService.getItems(pageSize, pageIndex);
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
    return this.appService.getItemById(id);
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
    return this.appService.getItemsByName(name, pageSize, pageIndex);
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
    return this.appService.getItemsByTypeIdAndBrandId(
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
    return this.appService.getItemsByBrandId(
      catalogBrandId,
      pageSize,
      pageIndex
    );
  }

  // PATCH api/v1/catalog/items/{catalogItemId}
  @Patch('items/:id')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Update catalog item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated record',
    type: CatalogItemReadDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Catalog item id',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No Found Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  updateCatalogItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatalogItemDto: CatalogItemUpdateDto
  ): Promise<CatalogItemReadDto> {
    return this.appService.updateCatalogItem(id, updateCatalogItemDto);
  }

  // POST api/v1/catalog/items
  @Post('items')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Create catalog item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created record',
    type: CatalogItemReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  createCatalogItem(
    @Body() createCatalogItemDto: CatalogItemCreateDto
  ): Promise<CatalogItemReadDto> {
    return this.appService.createCatalogItem(createCatalogItemDto);
  }

  // DELETE api/v1/catalog/items/{catalogItemId}
  @Delete('items/:id')
  @ApiTags('Catalog Items')
  @ApiOperation({ summary: 'Delete catalog item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Record deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  deleteCatalogItem(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appService.deleteCatalogItem(id);
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
    return this.appService.getCatalogTypes();
  }

  // PATCH api/v1/catalog/catalog-types/{catalogTypeId}
  @Patch('catalog-types/:id')
  @ApiTags('Catalog Types')
  @ApiOperation({ summary: 'Update catalog type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated record',
    type: CatalogTypeReadDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  updateCatalogType(
    @Param('id', ParseIntPipe) id: number,
    @Body() catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    return this.appService.updateCatalogType(id, catalogTypeDto);
  }

  // POST api/v1/catalog/catalog-types
  @Post('catalog-types')
  @ApiTags('Catalog Types')
  @ApiOperation({ summary: 'Create catalog type' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created record',
    type: CatalogTypeReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  createCatalogType(
    @Body() catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    return this.appService.createCatalogType(catalogTypeDto);
  }

  // DELETE api/v1/catalog/catalog-types/{catalogTypeId}
  @Delete('catalog-types/:id')
  @ApiTags('Catalog Types')
  @ApiOperation({ summary: 'Delete catalog type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Record deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  deleteCatalogType(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appService.deleteCatalogType(id);
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
    return this.appService.getCatalogBrands();
  }

  // PATCH api/v1/catalog/catalog-brands
  @Patch('catalog-brands/:id')
  @ApiTags('Catalog Brands')
  @ApiOperation({ summary: 'Update catalog brand' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated record',
    type: CatalogBrandReadDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  updateCatalogBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    return this.appService.updateCatalogBrand(id, catalogBrandDto);
  }

  // POST api/v1/catalog/catalog-brands
  @Post('catalog-brands')
  @ApiTags('Catalog Brands')
  @ApiOperation({ summary: 'Create catalog brand' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created record',
    type: CatalogBrandReadDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Error',
    type: ValidationErrorDto,
  })
  createCatalogBrand(
    @Body() catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    return this.appService.createCatalogBrand(catalogBrandDto);
  }

  // DELETE api/v1/catalog/catalog-brands/{catalogBrandId}
  @Delete('catalog-brands/:id')
  @ApiTags('Catalog Brands')
  @ApiOperation({ summary: 'Delete catalog brand' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Record deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found Error',
  })
  deleteCatalogBrand(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.appService.deleteCatalogBrand(id);
  }
}
