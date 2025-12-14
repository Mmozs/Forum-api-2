const DeleteCommentUseCase = require('./../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should orchestrate the delete comment correctly', async () => {
        //Arrange
        const threadId = 'thread-1';
        const commentId = 'comment-1';
        const owner = 'user-1';

        const mockCommentRepo = {
            verifyCommentExists: jest.fn().mockResolvedValue(),
            verifyCommentOwner: jest.fn().mockResolvedValue(),
            deleteComment: jest.fn().mockResolvedValue(),
        };
        const mockThreadRepo = {
            verifyThreadExists: jest.fn().mockResolvedValue(),
        };

        const useCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action
        await useCase.execute(threadId, commentId, owner );

        //Assert
        expect(mockThreadRepo.verifyThreadExists).toBeCalledWith(threadId);
        expect(mockCommentRepo.verifyCommentExists).toBeCalledWith(commentId);
        expect(mockCommentRepo.verifyCommentOwner).toBeCalledWith(commentId, owner);
        expect(mockCommentRepo.deleteComment).toBeCalledWith(commentId);
    })
})