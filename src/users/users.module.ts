import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'typeorm/entities/Book';
import { User } from 'typeorm/entities/User';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Book])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
