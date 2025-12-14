const ThreadsHandler = require('./handler');

describe('ThreadsHandler', () => {
  describe('postThreadHandler', () => {
    it('should return 401 when owner is missing', async () => {
      const mockContainer = { getInstance: jest.fn() };
      const handler = new ThreadsHandler(mockContainer);
      const request = { payload: { title: 'T', body: 'B' }, auth: { credentials: {} } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.postThreadHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'missing authentication' });
      expect(h.code).toHaveBeenCalledWith(401);
    });

    it('should return 401 for MISSING_OWNER error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('ADD_THREAD_USE_CASE.MISSING_OWNER')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new ThreadsHandler(mockContainer);
      const request = { payload: { title: 'T', body: 'B' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.postThreadHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'missing authentication' });
      expect(h.code).toHaveBeenCalledWith(401);
    });

    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new ThreadsHandler(mockContainer);
      const request = { payload: { title: 'T', body: 'B' }, auth: { credentials: { id: 'u1' } } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.postThreadHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });

  describe('getThreadDetailHandler', () => {
    it('should return 400 for validation error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new ThreadsHandler(mockContainer);
      const request = { params: { threadId: 't1' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.getThreadDetailHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID' });
      expect(h.code).toHaveBeenCalledWith(400);
    });

    it('should return 404 for THREAD_NOT_FOUND error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new ThreadsHandler(mockContainer);
      const request = { params: { threadId: 't1' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.getThreadDetailHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'fail', message: 'THREAD_REPOSITORY.THREAD_NOT_FOUND' });
      expect(h.code).toHaveBeenCalledWith(404);
    });

    it('should return 500 for unknown error', async () => {
      const mockUseCase = { execute: jest.fn().mockRejectedValue(new Error('UNKNOWN')) };
      const mockContainer = { getInstance: jest.fn().mockReturnValue(mockUseCase) };
      const handler = new ThreadsHandler(mockContainer);
      const request = { params: { threadId: 't1' } };
      const h = { response: jest.fn().mockReturnThis(), code: jest.fn().mockReturnThis() };

      await handler.getThreadDetailHandler(request, h);

      expect(h.response).toHaveBeenCalledWith({ status: 'error', message: 'terjadi kegagalan pada server kami' });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });
});
