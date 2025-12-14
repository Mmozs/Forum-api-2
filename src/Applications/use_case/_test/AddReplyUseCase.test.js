const addReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    it('should throw error when payload not contain needed property', async () => {
        //Arrange
        const mockReplyRepo = {};
        const mockCommentRepo = { verifyCommentExists: jest.fn() };
        const mockThreadRepo = { verifyThreadExists: jest.fn() };

        const useCase = new addReplyUseCase({
            replyRepository: mockReplyRepo,
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action & Assert
        await expect(useCase.execute({ content: 'balasan'}, 'user-1'))
            .rejects.toThrow('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload data type not meet specification', async () => {
        //Arrange
        const mockReplyRepo = {};
        const mockCommentRepo = { verifyCommentExists: jest.fn() };
        const mockThreadRepo = { verifyThreadExists: jest.fn() };

        const useCase = new addReplyUseCase({
            replyRepository: mockReplyRepo,
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action & Assert
        await expect(useCase.execute({ threadId: 'thread-1', commentId: 'comment-1', content: 123 }, 'user-1'))
            .rejects.toThrow('ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate add reply correctly', async () => {
        //Arrange
        const payload = { threadId: 'thread-1', commentId: 'comment-1', content: 'Isi balasan' };
        const owner = 'user-1';
        const mockReplyRepo = {
            addReply: jest.fn().mockResolvedValue({ id: 'reply-123', content: payload.content, owner}),
        };
        const mockCommentRepo = { verifyCommentExists: jest.fn().mockResolvedValue() };
        const mockThreadRepo = { verifyThreadExists: jest.fn().mockResolvedValue() };

        const useCase = new addReplyUseCase({
            replyRepository: mockReplyRepo,
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action
        const result = await useCase.execute(payload, owner);

        //Assert
        expect(mockThreadRepo.verifyThreadExists).toBeCalledWith(payload.threadId);
        expect(mockCommentRepo.verifyCommentExists).toBeCalledWith(payload.commentId);
        expect(mockReplyRepo.addReply).toBeCalledWith({
            commentId: payload.commentId,
            content: payload.content,
            owner,
        });
        expect(result).toStrictEqual({
            id: 'reply-123',
            content: payload.content,
            owner,
        });
    });
});