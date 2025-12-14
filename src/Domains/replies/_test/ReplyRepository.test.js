const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    const repo = new ReplyRepository();

    it('should throw error when addReply not implemented', async () => {
        await expect(repo.addReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when verifyReplyExists not implemented', async () => {
        await expect(repo.verifyReplyExists('reply-1')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when verifyReplyOwner is not implemented', async () => {
        await expect(repo.verifyReplyOwner('reply-1', 'user-1')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('shoudl throw error when deleteReply is not implemented', async () => {
        await expect(repo.deleteReply('reply-1')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when getRepliesByCommentId not implemented', async () => {
        await expect(repo.getRepliesByCommentId(['comment-1'])).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});