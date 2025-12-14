const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
    constructor({ pool, idGenerator }) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment({ threadId, content, owner }) {
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();
        const query = {
            text: `INSERT INTO comments(id, thread_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner`,
            values: [id, threadId, content, owner, date],
        };

        return (await this._pool.query(query)).rows[0];
    }

    async verifyCommentExists(commentId) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('COMMENT_REPOSITORY.COMMENT_NOT_FOUND');
        }
    }

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner],
        };
        const result = await this._pool.query(query);
        if (result.rowCount === 0 || !result.rows || result.rows.length === 0) {
            throw new Error('COMMENT_REPOSITORY.NOT_THE_COMMENT_OWNER');
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [commentId],
        };
        await this._pool.query(query);
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT c.id, c.content, c.date AS date, u.username, c.is_delete
                   FROM comments c
                   JOIN users u ON u.id = c.owner
                   WHERE c.thread_id = $1
                   ORDER BY c.date ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;