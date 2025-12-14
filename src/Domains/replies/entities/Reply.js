class Reply {
    constructor({ id, commentId, content, owner, date, isDeleted = false }) {
        this._verifyPayload({ id, commentId, content, owner, date, isDeleted });
        this.id = id;
        this.commentId = commentId;
        this.content = content;
        this.owner = owner;
        this.date = date;
        this.isDeleted = isDeleted;
    }

    _verifyPayload({ id, commentId, content, owner, date, isDeleted }) {
        if(!id || !commentId || !content || !owner || !date || isDeleted === undefined) {
            throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        if(typeof content !== 'string') {
            throw new Error('REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if(typeof isDeleted !== 'boolean') {
            throw new Error('REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Reply;