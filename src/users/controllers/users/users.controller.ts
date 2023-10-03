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
import { CreateBookDto } from '@/src/books/dtos/CreateBook.dto';
import { CreateUserDto } from '@/src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from '@/src/users/dtos/UpdateUser.dto';
import { UsersService } from '@/src/users/services/users/users.service';
import { UpdateBookDto } from '@/src/books/dtos/UpdateBook.dto';

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

    @Post(':id/books')
    createBookByUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() createBookDto: CreateBookDto,
    ) {
        return this.usersService.createBookByUser(id, createBookDto);
    }

    @Patch(':userId/books/:bookId')
    updateBookByUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('bookId', ParseIntPipe) bookId: number,
        @Body() updateBookDto: UpdateBookDto,
    ) {
        return this.usersService.updateBookByUser(
            userId,
            bookId,
            updateBookDto,
        );
    }

    @Delete(':userId/books/:bookId')
    deleteBookByUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('bookId', ParseIntPipe) bookId: number,
    ) {
        return this.usersService.deleteBookByUser(userId, bookId);
    }
}
