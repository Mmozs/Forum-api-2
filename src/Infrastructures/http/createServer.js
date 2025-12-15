const Hapi = require('@hapi/hapi');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');

const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');

const Jwt = require('@hapi/jwt');
const { verify } = require('@hapi/jwt/lib/crypto');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });
  
  await server.register(Jwt);

  server.auth.strategy('forum_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3000,
    },
    validate: (artifacts, request, h) => {
      console.log('JWT decoded payload', artifacts.decoded.payload)
      const { id } = artifacts.decoded.payload;
      return {
        isValid: true,
        credentials: { id },
      };
    },
  });

  server.auth.default('forum_jwt');

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);
  server.route({
  method: 'GET',
  path: '/health',
  handler: (request, h) => ({
    status: 'ok'
  }),
  options: {
    auth: false,
  },
});

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        // Handle authentication errors
        if (response.output && response.output.statusCode === 401) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(401);
          return newResponse;
        }
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  return server;
};

module.exports = createServer;
