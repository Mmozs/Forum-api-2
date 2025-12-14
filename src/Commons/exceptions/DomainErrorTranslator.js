const InvariantError = require('./InvariantError');
const AuthorizationError = require('./AuthorizationError');
const NotFoundError = require('./NotFoundError');
const AuthenticationError = require('./AuthenticationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  //User, login & authentications
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  //Thread
  'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan thread karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan thread karena tipe data tidak sesuai'),
  'GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID': new NotFoundError('tidak dapat mendapatkan detail thread karena Id thread tidak disertakan'),
  'GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mendapatkan detail thread karena tipe Id tidak valid'),
  'THREAD_REPOSITORY.THREAD_NOT_FOUND': new NotFoundError('thread tidak ditemukan'),
  'ADD_THREAD_USE_CASE.MISSING_OWNER': new AuthenticationError('Owner tidak ditemukan'),
  'ADD_THREAD_USE_CASE.ADD_THREAD_FAILED': new InvariantError('Gagal menambahkan thread'),

  //Comment
  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan komentar karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan komentar karena tipe data tidak sesuai'),
  'COMMENT_REPOSITORY.COMMENT_NOT_FOUND': new InvariantError('komentar tidak ditemukan'),
  'NOT_COMMENT_OWNER': new InvariantError('anda tidak berhak menghapus komentar ini'),

  //Reply
  'ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan balasan karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambahkan balasan karena tipe data tidak sesuai'),
  'REPLY_REPOSITORY.REPLY_NOT_FOUND': new InvariantError('balasan tidak ditemukan'),
  'NOT_REPLY_OWNER': new InvariantError('anda tidak berhak menghapus balasan ini'),
};

module.exports = DomainErrorTranslator;
