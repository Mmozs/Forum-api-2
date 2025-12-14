const Thread = require('../Thread')

describe('Thread entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        //Arrange
        const payload = {
            title: 'Thread title',
            body: 'Thread Body',
            owner: 'user-123',
            date: new Date().toISOString(),
        };

        //Action and Assert
        expect(() => new Thread(payload)).toThrow('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        //Arrange
        const payload = {
            id: 'thread-123',
            title: 123,   //wrong type
            body: 'Thread Body',
            owner: 'user-123',
            date: new Date().toISOString(),
        };

        //Action and Assert
        expect(() => new Thread(payload)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Thread entity correctly when payload is valid', () => {
        //Arrange
        const payload = {
            id: 'thread-123',
            title: 'Thread Title',
            body: 'Thread Body',
            owner: 'user-123',
            date: '2024-01-01T00:00:00.000Z',
        };

        //Action
        const thread = new Thread(payload);

        //Assert
        expect(thread.id).toEqual(payload.id);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.owner).toEqual(payload.owner);
        expect(thread.date).toEqual(payload.date);
    })
}) 