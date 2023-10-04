import { User } from '../../typeorm/entities/User';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserParams } from '../utils/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async register(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ ...userDetails });
        const { password, ...user } = await this.userRepository.save(newUser);
        void password;
        return user;
    }
}
