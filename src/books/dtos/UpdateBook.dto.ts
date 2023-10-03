import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsString()
    coverImage: string;

    @IsNumber()
    price: number;
}
