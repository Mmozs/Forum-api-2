class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        if(!threadId) {
            throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
        }
        if(typeof threadId !== 'string') {
            throw new Error('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        const thread = await this._threadRepository.getThreadDetail(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        
        const commentIds = comments.map(c => c.id);
        const replies = commentIds.length > 0 ? await this._replyRepository.getRepliesByCommentsId(commentIds) : [];
        
        thread.comments = comments.map(comment => ({
            id: comment.id,
            username: comment.username,
            date: comment.date,
            content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
            replies: replies
                .filter(reply => reply.comment_id === comment.id)
                .map(reply => ({
                    id: reply.id,
                    username: reply.username,
                    date: reply.date,
                    content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
                }))
        }));
        
        return thread;
    }
}
module.exports = GetThreadDetailUseCase;