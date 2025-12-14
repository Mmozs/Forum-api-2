const Comment = require('../Comment');

describe('Comment entity', () => {
    it('should throw error when payload not contain needed property', () => {
        //Arrange
        const payload = {
            id: 'comment-1',
            threadId: 'thread-1',
            content: 'test comment',
            owner: 'user-1',
        };
        expect(() => new Comment(payload)).toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        //Arrange
        const payload = {
            id: 'comment-2',
            threadId: 'thread-2',
            content: 12345, // should be string
            owner: 'user-2',
            date: new Date().toISOString(),
            isDeleted: 'false' // should be boolean
        };
        //Action & Assert
        expect(() => new Comment(payload)).toThrow('COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should create Comment object correctly', () => {
        //Arrange
        const payload = {
            id: 'comment-3',
            threadId: 'thread-3',
            content: 'This is a comment',
            owner: 'user-3',
            date: new Date().toISOString(),
            isDeleted: false,
        };
        //Action
        const comment = new Comment(payload);

        //Assert
        expect(comment.id).toEqual(payload.id);
        expect(comment.threadId).toEqual(payload.threadId);
        expect(comment.content).toEqual(payload.content);
        expect(comment.owner).toEqual(payload.owner);
        expect(comment.date).toEqual(payload.date);
        expect(comment.isDeleted).toEqual(payload.isDeleted);
    });
});

    it('should throw error when isDeleted is not boolean', () => {
        const payload = {
            id: 'comment-4',
            threadId: 'thread-4',
            content: 'Valid content',
            owner: 'user-4',
            date: new Date().toISOString(),
            isDeleted: 'not-boolean',
        };
        expect(() => new Comment(payload)).toThrow('COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
