const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor({ pool, idGenerator }) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply({ commentId, content, owner }) {
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: `INSERT INTO replies(id, comment_id, content, owner, date)
                   VALUES($1, $2, $3, $4, $5)
                   RETURNING id, content, owner`,
            values: [id, commentId, content, owner, date],
        };

        return (await this._pool.query(query)).rows[0];
    }

    async verifyReplyExists(replyId) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        if(!result.rowCount) {
            throw new Error('REPLY_REPOSITORY.REPLY_NOT_FOUND');
        }
    }

    async verifyReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        const actualOwner = result.rows[0].owner;
        if(actualOwner !== owner) {
            throw new Error('REPLY_REPOSITORY.NOT_THE_REPLY_OWNER');
        }
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyId],
        };
        await this._pool.query(query);
    }

    async getRepliesByCommentsId(commentId) {
        const query = {
            text: `SELECT r.id, r.comment_id, r.content, r.date AS date, u.username, r.is_delete
                   FROM replies r
                   JOIN users u ON u.id = r.owner
                   WHERE r.comment_id = ANY($1)
                   ORDER BY r.date ASC`,
            values: [commentId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = ReplyRepositoryPostgres;