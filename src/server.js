const Hapi = require('@hapi/hapi');
const routes = require('./routes');

async function startServer() {
  try {
    const serverOptions = {
      port: 9000,
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    };

    const server = Hapi.server(serverOptions);
    server.route(routes);

    await server.start();
    console.log(`Server is running at: ${server.info.uri}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
