import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category-dto';
import { Category } from '../schema/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from '../dto/update-category-dto';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async getAllCategories() {
        const categories = await this.categoryRepository.find({ select: { id: true, slug: true, name: true } })

        return {
            message: "All category fetched successfully",
            data: categories
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const isCategoryAlreadyExists = await this.categoryRepository.findOne({ where: { slug: createCategoryDto.slug } })

        if (isCategoryAlreadyExists?.id) throw new ConflictException("Category already exists")

        const isCategoryCreated = await this.categoryRepository.save(createCategoryDto)

        if (!isCategoryCreated.id) throw new BadRequestException("Failed to create category")

        return {
            message: "Category created successfully",
            data: isCategoryCreated
        }
    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto, slug: string) {
        const isCategoryUpdated = await this.categoryRepository.update({ slug }, {
            name: updateCategoryDto.name
        })

        if (!isCategoryUpdated.affected) throw new BadRequestException("Failed to update category")

        return {
            message: "Category updated successfully",
            data: isCategoryUpdated
        }
    }

    async deleteCategory(slug: string) {
        const isCategoryDeleted = await this.categoryRepository.delete({ slug })

        if (!isCategoryDeleted.affected) throw new BadRequestException("Failed to delete category")

        return {
            message: "Category deleted successfully",
            data: isCategoryDeleted
        }
    }

}
