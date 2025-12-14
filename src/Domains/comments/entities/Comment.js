class Comment {
    constructor({ id, threadId, content, owner, date, isDeleted = false }) {
        this._verifyPayload({ id, threadId, content, owner, date, isDeleted });
        this.id = id;
        this.threadId = threadId;
        this.content = content;
        this.owner = owner;
        this.date = date;
        this.isDeleted = isDeleted;
    }

    _verifyPayload({ id, threadId, content, owner, date, isDeleted }) {
        if(!id || !threadId || !content || !owner || !date || isDeleted === undefined) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if(typeof content !== 'string' ) {
            throw new Error('COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if(typeof isDeleted !== 'boolean') {
            throw new Error('COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;