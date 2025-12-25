import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './schema/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product-dto';
import { GetProductsQueryDto } from './dto/get-product-dto';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) { }

  checkHealth() {
    return {
      message: 'Product Server is healthy',
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  async getAllProducts(query: GetProductsQueryDto) {
    const { sort, category, search, limit = 5 } = query;

    const qb = this.productRepository.createQueryBuilder('product');

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      qb.andWhere('product.category_slug = :category', { category });
    }

    if (sort) {
      qb.orderBy(`product.${sort}`, 'DESC');
    }

    qb.take(limit);

    const products = await qb.getMany()

    return {
      message: 'All Products fetched successfully',
      data: products
    };
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } })

    if (!product?.id) throw new NotFoundException("Product not found")

    return {
      message: 'Product fetched successfully',
      data: product
    };
  }

  async createProduct(createProductDto: CreateProductDto) {
    const missingColors = createProductDto.colors.filter((color) => !(color in createProductDto.images));

    if (missingColors.length > 0) throw new BadRequestException("Missing images for colors!")

    const isProductExists = await this.productRepository.findOne({ where: { name: createProductDto.name } })

    if (isProductExists?.id) throw new ConflictException("Product already exists")

    const isProductCreated = await this.productRepository.save(createProductDto)

    if (!isProductCreated.id) throw new BadRequestException("Failed to create product")

    return {
      message: 'Product created successfully',
      data: isProductCreated
    };
  }

  async updateProduct(updateProductDto: UpdateProductDto, productId: string) {
    const isProductUpdated = await this.productRepository.update({ id: productId }, {
      ...updateProductDto
    })

    if (!isProductUpdated.affected) throw new BadRequestException("Failed to update product")

    return {
      message: 'Product updated successfully',
      data: isProductUpdated
    };
  }

  async deleteProduct(productId: string) {
    const isProductDeleted = await this.productRepository.delete({ id: productId })

    if (!isProductDeleted.affected) throw new BadRequestException("Failed to delete product")

    return {
      message: 'Product deleted successfully',
      data: isProductDeleted
    };
  }

}
