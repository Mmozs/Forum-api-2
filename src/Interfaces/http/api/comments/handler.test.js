const CommentsHandler = require('./handler');

describe('CommentsHandler', () => {
  describe('postCommentHandler', () => {
    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new CommentsHandler(mockContainer);
      const request = { params: { threadId: 't1' }, payload: { content: 'c' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.postCommentHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteCommentHandler', () => {
    it('should return 403 for NOT_THE_COMMENT_OWNER error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('COMMENT_REPOSITORY.NOT_THE_COMMENT_OWNER')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new CommentsHandler(mockContainer);
      const request = { params: { threadId: 't1', commentId: 'c1' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.deleteCommentHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'anda tidak berhak mengakses resource ini' });
      expect(h.code).toHaveBeenCalledWith(403);
    });

    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new CommentsHandler(mockContainer);
      const request = { params: { threadId: 't1', commentId: 'c1' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.deleteCommentHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });
});
