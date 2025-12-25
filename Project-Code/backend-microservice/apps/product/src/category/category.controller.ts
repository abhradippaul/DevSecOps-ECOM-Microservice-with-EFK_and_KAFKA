import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../dto/create-category-dto';
import { UpdateCategoryDto } from '../dto/update-category-dto';

@Controller('api/v1/product/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get("all-categories")
    getAllCategories() {
        return this.categoryService.getAllCategories()
    }

    @Post("create-category")
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto)
    }

    @Patch("update-category/:slug")
    updateCategory(@Body() updateCategoryDto: UpdateCategoryDto, @Param("slug") slug: string) {
        return this.categoryService.updateCategory(updateCategoryDto, slug)
    }

    @Delete("delete-category/:slug")
    deleteCategory(@Param("slug") slug: string) {
        return this.categoryService.deleteCategory(slug)
    }
}
