import { UserRole } from "apps/common/enum/auth/user-role.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: string

    @IsString()
    @IsNotEmpty()
    password: string
}