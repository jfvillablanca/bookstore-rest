import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/entities/User';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
