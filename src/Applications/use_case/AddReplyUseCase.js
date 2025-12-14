class AddReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(payload, owner) {
        const { threadId, commentId, content } = payload;
        if(!threadId || !commentId || !content) {
            throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if(typeof content !== 'string') {
            throw new Error('ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        //Thread Available
        await this._threadRepository.verifyThreadExists(threadId);
        //Comment Available
        await this._commentRepository.verifyCommentExists(commentId);

        const addReply = await this._replyRepository.addReply({
            commentId, content, owner,
        });
        
        return {
            id: addReply.id,
            content: addReply.content,
            owner: addReply.owner,
        };
    }
}

module.exports = AddReplyUseCase;