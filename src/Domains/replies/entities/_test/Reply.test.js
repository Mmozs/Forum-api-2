const Reply = require('../Reply');

describe('Reply entity', () => {
    it('should throw error when payload not contain needed property', () =>{
        //Arrange
        const payload = {
            id: 'reply-1',
            commentId: 'comment-1',
            content: 'Isi balasan',
            owner: 'user-1',
            //missing date
        };

        //Action & Assert
        expect(() => new Reply(payload)).toThrow('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload data type not meet specification', () =>{
        const payload = {
            id: 'reply-1',
            commentId: 'comment-1',
            content: 123, //not string
            owner: 'user-1',
            date: new Date().toISOString(),
            isDeleted: 'false', //not boolean
        };
        expect(() => new Reply(payload)).toThrow('REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply object correctly when payload is valid', () =>{
        //Arrange
        const payload = {
            id: 'reply-1',
            commentId: 'comment-1',
            content: 'sebuah balasan',
            owner: 'user-1',
            date: '2021-11-10T10:00:00.000Z',
            isDeleted: false,
        };

        //Action
        const reply = new Reply(payload);

        //Assert
        expect(reply.id).toBe(payload.id);
        expect(reply.commentId).toBe(payload.commentId);
        expect(reply.content).toBe(payload.content);
        expect(reply.owner).toBe(payload.owner);
        expect(reply.date).toBe(payload.date);
        expect(reply.isDeleted).toBe(payload.isDeleted)
    })
})

    it('should throw error when isDeleted is not boolean', () => {
        const payload = {
            id: 'reply-2',
            commentId: 'comment-2',
            content: 'Valid content',
            owner: 'user-2',
            date: new Date().toISOString(),
            isDeleted: 'not-boolean',
        };
        expect(() => new Reply(payload)).toThrow('REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
