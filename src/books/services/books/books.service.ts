import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@/typeorm/entities/Book';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book) private bookRepository: Repository<Book>,
    ) {}

    listBooks(search: string) {
        const queryBuilder = this.bookRepository.createQueryBuilder('book');
        if (search) {
            queryBuilder.where('book.title LIKE :search', {
                search: `%${search}`,
            });
        }
        return queryBuilder.getMany();
    }
}
