import { Body, Controller, Get, Post, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from '../auth.guard';

interface UserDetails {
    sub: string
    email: string
    iat: number,
    exp: number
}

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

    @UseGuards(AuthGuard)
    @Get("get-user-details")
    getUserDetails(@Request() req) {
        const user = req?.user as UserDetails || null || undefined
        return this.userService.getUserDetails(user)
    }

}
