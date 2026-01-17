import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsOptional()
    middleName?: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}