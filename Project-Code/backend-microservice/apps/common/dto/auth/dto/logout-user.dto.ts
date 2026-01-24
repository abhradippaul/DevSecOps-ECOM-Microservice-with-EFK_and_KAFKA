import { UserType } from 'apps/common/enum/auth/user-role.enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class LogoutUserDto {
    @IsEmail()
    @IsNotEmpty()
    id: string

    @IsEnum(UserType)
    @IsNotEmpty()
    role: string
}
