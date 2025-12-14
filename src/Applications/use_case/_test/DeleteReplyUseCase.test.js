const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    it('should orchestate delete reply correctly', async () => {
        //Arrange
        const threadId = 'thread-1';
        const commentId = 'comment-1';
        const replyId = 'reply-1';
        const owner = 'user-1';

        const mockReplyRepo = {
            verifyReplyExists: jest.fn().mockResolvedValue(),
            verifyReplyOwner: jest.fn().mockResolvedValue(),
            deleteReply: jest.fn().mockResolvedValue(),
        };

        const mockCommentRepo = { verifyCommentExists: jest.fn().mockResolvedValue() };
        const mockThreadRepo = { verifyThreadExists: jest.fn().mockResolvedValue() };

        const useCase = new DeleteReplyUseCase ({
            replyRepository: mockReplyRepo,
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action
        await useCase.execute({ threadId, commentId, replyId, owner });

        //Assert
        expect(mockThreadRepo.verifyThreadExists).toBeCalledWith(threadId);
        expect(mockCommentRepo.verifyCommentExists).toBeCalledWith(commentId);
        expect(mockReplyRepo.verifyReplyExists).toBeCalledWith(replyId);
        expect(mockReplyRepo.verifyReplyOwner).toBeCalledWith(replyId, owner);
        expect(mockReplyRepo.deleteReply).toBeCalledWith(replyId);
    });
});