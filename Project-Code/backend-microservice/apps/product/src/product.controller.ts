import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { GetProductsQueryDto } from './dto/get-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';

@Controller("api/v1/product")
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('health')
  checkHealth() {
    return this.productService.checkHealth();
  }

  @Get('all-products')
  getAllProducts(@Query() query: GetProductsQueryDto) {
    return this.productService.getAllProducts(query);
  }

  @Post("/create-product")
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto)
  }

  @Patch("/update-product/:productId")
  updateProduct(@Body() updateProductDto: UpdateProductDto, @Param("productId") productId: string) {
    return this.productService.updateProduct(updateProductDto, productId)
  }

  @Get("/get-product/:productId")
  getProduct(@Param("productId") productId: string) {
    return this.productService.getProduct(productId)
  }

  @Delete("/delete-product/:productId")
  deleteProduct(@Param("productId") productId: string) {
    return this.productService.deleteProduct(productId)
  }

}
