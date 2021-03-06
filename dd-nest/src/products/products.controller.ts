import {
  Controller,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiImplicitQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ParseIntValuesPipe } from '../shared/pipes/parse-int-values.pipe';
import { ParseBoolValuesPipe } from '../shared/pipes/parse-bool-values.pipe';
import { DefaultValuesPipe } from '../shared/pipes/default-values.pipe';
import { GetProductsDto } from './dto/get-products.dto';
import { MongoIdParams } from '../shared/dto/mongo-id.dto';

@ApiUseTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('random')
  @ApiImplicitQuery({
    name: 'count',
    required: false,
    description: 'Number of products to return',
  })
  @UsePipes(
    new DefaultValuesPipe({
      count: '1',
    }),
  )
  @ApiOkResponse({ description: 'Returns random products from db' })
  async getRandomProducts(@Query('count', new ParseIntPipe()) count) {
    return this.productsService.getRandom(count);
  }

  @Get('/tags')
  @ApiOkResponse({ description: 'Returns all possible tags for products' })
  async getTags(@Query('category') category: string) {
    return this.productsService.getTags(category);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns product object' })
  @UsePipes(new ValidationPipe())
  async getById(@Param() params: MongoIdParams) {
    const product = await this.productsService.findById(params.id);

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product.toObject();
  }

  @Get('/')
  @ApiOkResponse({ description: 'Returns products page by given filters' })
  @UsePipes(
    new ParseIntValuesPipe(['limit', 'skip']),
    new ParseBoolValuesPipe(['inStock']),
    new DefaultValuesPipe({
      limit: 50,
      orderBy: 'createdTime',
      order: 'desc',
      inStock: true,
      skip: 0,
    }),
    new ValidationPipe(),
  )
  async getProducts(@Query() filters: GetProductsDto) {
    const products = await this.productsService.find(filters);
    const data = products.map(product => product.toObject());
    const count = await this.productsService.count(filters);
    return { count, data };
  }
}
