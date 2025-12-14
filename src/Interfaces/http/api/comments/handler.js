const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor (container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler (request, h) {
        try {
            const { threadId } = request.params;
            const { content } = request.payload;
            const owner = request.auth.credentials.id;

            const useCase = this._container.getInstance(AddCommentUseCase.name);
            const addedComment = await useCase.execute({ threadId, content }, owner);

            const response = h.response({
                status: 'success',
                data: {
                    addedComment,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (
                error.message === 'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY' ||
                error.message === 'ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
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

    async deleteCommentHandler (request, h) {
        try {
            const { threadId, commentId} = request.params;
            const owner = request.auth.credentials.id;

            const useCase = this._container.getInstance(DeleteCommentUseCase.name);
            await useCase.execute(threadId, commentId, owner);

            return {
                status: 'success',
            };
        } catch (error) {
            if (
                error.message === 'THREAD_REPOSITORY.THREAD_NOT_FOUND' ||
                error.message === 'COMMENT_REPOSITORY.COMMENT_NOT_FOUND'
            ) {
                return h.response({
                    status: 'fail',
                    message: error.message,
                }).code(404);
            }
            if (error.message === 'COMMENT_REPOSITORY.NOT_THE_COMMENT_OWNER') {
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

module.exports = CommentsHandler;
