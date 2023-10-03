import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateUserParams,
    UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { User } from 'typeorm/entities/User';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
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
}
