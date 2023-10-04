import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { BooksModule } from '../src/books/books.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Book } from '../typeorm/entities/Book';

import * as request from 'supertest';

import { BooksService } from '../src/books/services/books/books.service';
import { UsersService } from '../src/users/services/users/users.service';
import { AuthService } from '../src/auth/auth.service';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';

describe('App (e2e)', () => {
    let app: INestApplication;
    let booksService: BooksService;
    let usersService: UsersService;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({
                        type: 'mysql',
                        host: 'mysql-test-container',
                        port: 3306,
                        username: 'root',
                        password: 'test',
                        database: 'bookstore_rest_test',
                        entities: [User, Book],
                        synchronize: true,
                        dropSchema: true,
                    }),
                }),
                BooksModule,
                UsersModule,
                AuthModule,
            ],
        }).compile();

        booksService = moduleFixture.get(BooksService);
        usersService = moduleFixture.get(UsersService);
        authService = moduleFixture.get(AuthService);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('should find all users', async () => {
        const user = { username: 'testuser', password: 'test' };
        await authService.register(user);

        const response = await request(app.getHttpServer())
            .get('/users')
            .expect(HttpStatus.OK);

        expect(response.body?.length).toBe(1);
        expect(response.body[0]?.username).toBe(user.username);
    });

    it('should update a user', async () => {
        const id = 1;
        const user = { username: 'testuser', password: 'test' };
        const userModification = { pseudonym: 'secretwriter' };

        await authService.register(user);

        await request(app.getHttpServer())
            .patch(`/users/${id}`)
            .send(userModification)
            .expect(HttpStatus.OK);

        const updatedUser = await usersService.findUserById(id);
        expect(updatedUser.pseudonym).toBe(userModification.pseudonym);
    });

    it('should delete a user', async () => {
        const id = 1;
        const user = { username: 'testuser', password: 'test' };

        await authService.register(user);

        await request(app.getHttpServer())
            .delete(`/users/${id}`)
            .expect(HttpStatus.OK);

        const response = await request(app.getHttpServer())
            .get('/users')
            .expect(HttpStatus.OK);

        expect(response.body?.length).toBe(0);
    });

    it('should publish a book for a user', async () => {
        const userId = 1;
        const user = { username: 'testuser', password: 'test' };
        const newBook = { title: 'myBook' };

        await authService.register(user);

        const response = await request(app.getHttpServer())
            .post(`/users/${userId}/books`)
            .send(newBook)
            .expect(HttpStatus.CREATED);

        const createdBook = response.body;
        expect(createdBook?.title).toBe(newBook.title);
        expect(createdBook?.author.username).toBe(user.username);
    });

    it('should update details of a book for a user', async () => {
        const userId = 1;
        const bookId = 1;
        const user = { username: 'testuser', password: 'test' };
        const newBook = { title: 'myBook' };
        const bookRevision = {
            description: 'desc',
            coverImage: 'image.png',
            price: 500,
        };

        await authService.register(user);
        // Publish a book
        await request(app.getHttpServer())
            .post(`/users/${userId}/books`)
            .send(newBook)
            .expect(HttpStatus.CREATED);

        // Update book
        const response = await request(app.getHttpServer())
            .patch(`/users/${userId}/books/${bookId}`)
            .send(bookRevision)
            .expect(HttpStatus.OK);

        const updatedBook = response.body;
        expect(updatedBook?.title).toBe(newBook.title);
        expect(updatedBook?.author.username).toBe(user.username);
        expect(updatedBook?.description).toBe(bookRevision.description);
        expect(updatedBook?.coverImage).toBe(bookRevision.coverImage);
        expect(updatedBook?.price).toBe(bookRevision.price);
    });

    it('should unpublish a book for a user', async () => {
        const userId = 1;
        const bookId = 1;
        const user = { username: 'testuser', password: 'test' };
        const bookToBeUnpublished = { title: 'myBook' };

        await authService.register(user);
        // Publish a book
        await request(app.getHttpServer())
            .post(`/users/${userId}/books`)
            .send(bookToBeUnpublished)
            .expect(HttpStatus.CREATED);

        // Delete the book
        await request(app.getHttpServer())
            .delete(`/users/${userId}/books/${bookId}`)
            .expect(HttpStatus.OK);

        const existingBooks = await booksService.listBooks('');

        expect(existingBooks.length).toBe(0);
    });
});
