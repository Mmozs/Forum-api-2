const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler (request, h) {
        try {
            const { threadId, commentId } = request.params;
            const { content } = request.payload;
            const owner = request.auth.credentials.id;

            const useCase = this._container.getInstance(AddReplyUseCase.name);
            const added = await useCase.execute({ threadId, commentId, content }, owner);

            const response = h.response ({
                status: 'success',
                data: {
                    addedReply: added,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (
                error.message === 'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY' ||
                error.message === 'ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            ) {
                return h.response({
                    status: 'fail',
                    message: error.message,
                }).code(400);
            }
            if (
                error.message === 'THREAD_REPOSITORY.THREAD_NOT_FOUND' ||
                error.message === 'COMMENT_REPOSITORY.COMMENT_NOT_FOUND'
            ) {
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

    async deleteReplyHandler(request, h) {
        try {
            const { threadId, commentId, replyId } = request.params;
            const owner = request.auth.credentials.id;

            const useCase = this._container.getInstance(DeleteReplyUseCase.name);
            await useCase.execute({ threadId, commentId, replyId, owner });

            return {
                status: 'success',
            };
        } catch (error) {
            if (
                error.message === 'THREAD_REPOSITORY.THREAD_NOT_FOUND' ||
                error.message === 'COMMENT_REPOSITORY.COMMENT_NOT_FOUND' ||
                error.message === 'REPLY_REPOSITORY.REPLY_NOT_FOUND'
            ) {
                return h.response({
                    status: 'fail',
                    message: error.message,
                }).code(404);
            }
            if (error.message === 'REPLY_REPOSITORY.NOT_THE_REPLY_OWNER') {
                return h.response({
                    status: 'fail',
                    message: 'anda tidak berhak mengakses resource ini',
                }).code(403);
            }
            return h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            }).code(500);
        }
    }
}

module.exports = RepliesHandler;