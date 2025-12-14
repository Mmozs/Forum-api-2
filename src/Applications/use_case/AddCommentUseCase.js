class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(payload, owner) {
        const { threadId, content } = payload;
        if (!threadId || !content) {
            throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if (typeof content !== 'string') {
            throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        // Verify thread exists
        await this._threadRepository.verifyThreadExists(threadId);

        const addedComment = await this._commentRepository.addComment({
            threadId, content, owner,
        });

        return {
            id: addedComment.id,
            content: addedComment.content,
            owner: addedComment.owner,
        };
    }
}

module.exports = AddCommentUseCase;
