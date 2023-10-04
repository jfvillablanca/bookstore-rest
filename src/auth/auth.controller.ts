import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../src/users/dtos/CreateUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        this.authService.register(createUserDto);
    }
}
