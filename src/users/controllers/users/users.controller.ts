import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getUsers() {
        return this.usersService.findUsers();
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        this.usersService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.deleteUser(id);
    }
}
