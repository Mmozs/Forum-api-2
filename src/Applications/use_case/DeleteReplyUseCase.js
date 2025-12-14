class DeleteReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute({ threadId, commentId, replyId, owner }) {
        //Thread Verification
        await this._threadRepository.verifyThreadExists(threadId);
        //Comment Verification
        await this._commentRepository.verifyCommentExists(commentId);
        //Reply is Available
        await this._replyRepository.verifyReplyExists(replyId);
        //Owner Verification
        await this._replyRepository.verifyReplyOwner(replyId, owner);

        await this._replyRepository.deleteReply(replyId);
    }
}

module.exports = DeleteReplyUseCase;