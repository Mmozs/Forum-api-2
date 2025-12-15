const createServer = require('../createServer');

describe('HTTP server', () => {
  let server;

  beforeEach(async () => {
    server = await createServer({});
  });

  afterEach(async () => {
    await server.stop();
  })

  it('should response 404 when request unregistered route', async () => {

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should handle authentication error correctly', async () => {

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'Test Thread',
        body: 'Test Body',
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(responseJson.status).toEqual('fail');
  });
  
  it('should return health status from GET /health', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toEqual(200);

    const payload = JSON.parse(response.payload);
    expect(payload.status).toEqual('ok');
    expect(typeof payload.uptime).toEqual('number');
  });
});
