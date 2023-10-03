import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'books' })
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: "" })
    description: string;

    @ManyToOne(() => User, (user) => user.books)
    author: User;

    @Column({ default: "" })
    coverImage: string;

    @Column({ default: 0 })
    price: number;
}
