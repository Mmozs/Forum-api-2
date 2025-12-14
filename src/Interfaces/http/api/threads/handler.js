const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    try {
      const { title, body } = request.payload;
      const owner = request.auth.credentials.id;

      if(!owner) {
        return h.response({
            status: 'fail',
            message: 'missing authentication',
        }).code(401);
      }

      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
      const addedThread = await addThreadUseCase.execute({ title, body }, owner);

      return h.response({
        status: 'success',
        data: {
          addedThread,
        },
      }).code(201);
    } catch (error) {
      if (
        error.message === 'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY' ||
        error.message === 'ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      ) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }
      if (error.message === 'ADD_THREAD_USE_CASE.MISSING_OWNER') {
        return h.response({
          status: 'fail',
          message: 'missing authentication',
        }).code(401);
      }
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }
  }

  async getThreadDetailHandler(request, h) {
    try {
      const { threadId } = request.params;

      const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
      const thread = await getThreadDetailUseCase.execute(threadId);

      return h.response({
        status: 'success',
        data: {
          thread,
        },
      }).code(200);
    } catch (error) {
      if (
        error.message === 'GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID' ||
        error.message === 'GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      ) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }
      if (error.message === 'THREAD_REPOSITORY.THREAD_NOT_FOUND') {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(404);
      }
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }
  }
}

module.exports = ThreadsHandler;
