const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    it('should throw error when payload not contain needed property', async () => {
        //Arrange
        const commentRepo = {};
        const threadRepo = { verifyThreadExists: jest.fn() };
        const useCase = new AddCommentUseCase({
            commentRepository: commentRepo,
            threadRepository: threadRepo,
        });

        //Action & Assert
        await expect(useCase.execute({ content: 'a comment '}, 'user-1'))
            .rejects.toThrow('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload data types invalid', async () => {
        //Arrange
        const commentRepo = {};
        const threadRepo = { verifyThreadExists: jest.fn() };
        const useCase = new AddCommentUseCase({
            commentRepository: commentRepo,
            threadRepository: threadRepo,
        });

        //Action & Assert
        await expect(useCase.execute({ threadId: 'thread-1', content: 123 }, 'user-1'))
            .rejects.toThrow('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate the add comment action correctly', async () => {
        //Arrange
        const payload = {
            threadId: 'thread-1',
            content: 'a comment',
        };
        const owner = 'user-1';
        const mockCommentRepo = {
            addComment: jest.fn().mockResolvedValue({ id: 'comment-1', content: payload.content, owner }),
        };
        const mockThreadRepo = {
            verifyThreadExists: jest.fn().mockResolvedValue(),
        };

        const useCase = new AddCommentUseCase({
            commentRepository: mockCommentRepo,
            threadRepository: mockThreadRepo,
        });

        //Action
        const result = await useCase.execute(payload, owner);

        expect(mockThreadRepo.verifyThreadExists).toBeCalledWith(payload.threadId);
        expect(mockCommentRepo.addComment).toBeCalledWith({
            threadId: payload.threadId,
            content: payload.content,
            owner,
        });
        expect(result).toEqual({
            id: 'comment-1',
            content: payload.content,
            owner,
        });
    });
});