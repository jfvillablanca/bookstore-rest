import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from '@/src/books/services/books/books.service';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get()
    listBooks(@Query('search') search: string) {
        return this.booksService.listBooks(search);
    }
}
