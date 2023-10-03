import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: 3306,
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || 'rootpassword',
                database: process.env.DB_DATABASE || 'bookstore_rest',
                entities: [],
                synchronize: true,
            }),
        }),
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
