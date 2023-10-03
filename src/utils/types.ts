export type CreateUserParams = {
    username: string;
    password: string;
};

export type UpdateUserParams = {
    username: string;
    password: string;
    pseudonym: string;
};

export type CreateBookParams = {
    title: string;
};

export type UpdateBookParams = {
    title: string;
    description: string;
    coverImage: string;
    price: number;
};
