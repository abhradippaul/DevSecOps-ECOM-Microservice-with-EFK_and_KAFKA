import { IsNotEmpty, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    slug: string

    @IsNotEmpty()
    @IsString()
    name: string
}