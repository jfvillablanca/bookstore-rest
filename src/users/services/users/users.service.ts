import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateBookParams,
    UpdateBookParams,
    UpdateUserParams,
} from '@/src/utils/types';
import { Repository } from 'typeorm';
import { Book } from '../../../../typeorm/entities/Book';
import { User } from '../../../../typeorm/entities/User';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) {}

    findUsers() {
        return this.userRepository.find();
    }

    async updateUser(id: number, updatedUserDetails: UpdateUserParams) {
        await this.userRepository.update({ id }, { id, ...updatedUserDetails });
        return this.findUserById(id);
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    async createBookByUser(id: number, bookDetails: CreateBookParams) {
        const user = await this.findUserById(id);
        const newBook = this.bookRepository.create({
            ...bookDetails,
            author: user,
        });
        return await this.bookRepository.save(newBook);
    }

    async updateBookByUser(
        userId: number,
        bookId: number,
        bookDetails: UpdateBookParams,
    ) {
        const user = await this.findUserById(userId);
        const book = await this.bookRepository.findOneBy({
            id: bookId,
            author: user,
        });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
        }
        await this.bookRepository.update({ id: bookId }, { ...bookDetails });

        return await this.bookRepository.findOne({
            where: { id: bookId, author: user },
            relations: ['author'],
        });
    }

    async deleteBookByUser(userId: number, bookId: number) {
        const user = await this.findUserById(userId);
        const book = await this.bookRepository.findOneBy({
            id: bookId,
            author: user,
        });
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
        }
        return this.bookRepository.delete({ id: bookId, author: user });
    }

    async findUserByUsername(username: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async findUserById(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}
