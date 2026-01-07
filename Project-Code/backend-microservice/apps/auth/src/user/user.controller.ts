import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('api/v1/auth/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("create-user")
    createUser(@Body() body: CreateUserDto) {
        return this.userService.createUser(body)
    }

    @Post("login-user")
    loginUser(@Body() body: LoginUserDto) {
        return this.userService.loginUser(body)
    }
}
