import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateBookParams,
    CreateUserParams,
    UpdateBookParams,
    UpdateUserParams,
} from '@/src/utils/types';
import { Repository } from 'typeorm';
import { Book } from '@/typeorm/entities/Book';
import { User } from '@/typeorm/entities/User';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) {}

    findUsers() {
        return this.userRepository.find();
    }
    createUser(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ ...userDetails });
        return this.userRepository.save(newUser);
    }

    updateUser(id: number, updatedUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updatedUserDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    async createBookByUser(id: number, bookDetails: CreateBookParams) {
        const user = await this.findUser(id);
        const newBook = this.bookRepository.create({ ...bookDetails, user });
        return await this.bookRepository.save(newBook);
    }

    async updateBookByUser(
        userId: number,
        bookId: number,
        bookDetails: UpdateBookParams,
    ) {
        const user = await this.findUser(userId);
        const book = await this.bookRepository.findOneBy({ id: bookId, user });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
        }
        return this.bookRepository.update({ id: bookId }, { ...bookDetails });
    }

    async deleteBookByUser(userId: number, bookId: number) {
        const user = await this.findUser(userId);
        const book = await this.bookRepository.findOneBy({ id: bookId, user });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
        }
        return this.bookRepository.delete({ id: bookId, user });
    }

    private async findUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}
