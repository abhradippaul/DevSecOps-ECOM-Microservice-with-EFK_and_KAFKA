import { Body, Controller, Get, Post, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';
import { UserDetails } from 'apps/common/types/auth/user-details';
import { CreateUserDto } from 'apps/common/dto/auth/dto/create-user-dto';
import { LoginUserDto } from 'apps/common/dto/auth/dto/login-user-dto';
import { LogoutUserDto } from 'apps/common/dto/auth/dto/logout-user.dto';

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

    @UseGuards(AuthGuard)
    @Get("logout-user")
    logoutUser(@Request() req) {
        const user = req?.user as LogoutUserDto || null || undefined
        return this.userService.logoutUser(user)
    }

}
