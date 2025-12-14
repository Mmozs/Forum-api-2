const RepliesHandler = require('./handler');

describe('RepliesHandler', () => {
  describe('postReplyHandler', () => {
    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new RepliesHandler(mockContainer);
      const request = { params: { threadId: 't1', commentId: 'c1' }, payload: { content: 'r' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.postReplyHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteReplyHandler', () => {
    it('should return 403 for NOT_THE_REPLY_OWNER error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('REPLY_REPOSITORY.NOT_THE_REPLY_OWNER')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new RepliesHandler(mockContainer);
      const request = { params: { threadId: 't1', commentId: 'c1', replyId: 'r1' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.deleteReplyHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'anda tidak berhak mengakses resource ini' });
      expect(h.code).toHaveBeenCalledWith(403);
    });

    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new RepliesHandler(mockContainer);
      const request = { params: { threadId: 't1', commentId: 'c1', replyId: 'r1' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.deleteReplyHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });
});
