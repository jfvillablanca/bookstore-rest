export class MockBooksRepository {
    createQueryBuilder = jest.fn(() => ({
        getMany: jest.fn(),
    }));
}
