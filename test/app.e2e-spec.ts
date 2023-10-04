import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { BooksModule } from '../src/books/books.module';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../typeorm/entities/Book';

import * as request from 'supertest';
import { MockBooksRepository } from './utils';

describe('BooksController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [BooksModule],
        })
            .overrideProvider(getRepositoryToken(Book))
            .useValue(new MockBooksRepository())
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get all /books', async () => {
        await request(app.getHttpServer()).get('/books').expect(HttpStatus.OK);
    });
});
