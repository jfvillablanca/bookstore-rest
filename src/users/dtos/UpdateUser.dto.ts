import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    pseudonym: string;
}
