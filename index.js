
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Routes = [];

Routes.push({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return h.redirect('/documentation')
    }
});

Routes.push({
    method: 'GET',
    path: '/api/zodiac/categories',
    config: {
        handler: (request, h) => {
            return {
                meta: {
                    status: "200"
                },
                data: [
                    {
                        name: "business",
                        order: 1
                    },
                    {
                        name: "common",
                        order: 2
                    },
                    {
                        name: "love",
                        order: 3
                    },
                    {
                        name: "health",
                        order: 4
                    },
                    {
                        name: "car",
                        order: 5
                    },{
                        name: "beauty",
                        order: 6
                    },
                    {
                        name: "erotic",
                        order: 7
                    },{
                        name: "gold",
                        order: 8
                    },

                ],
                pagination: {

                }
            }
        },
        description: 'Get Categories',
        notes: 'Returns categories list',
        tags: ['api'],
    }
});

(async () => {
    const server = await new Hapi.Server({
        host: process.env.HOST || process.env.HOSTNAME,
        port: parseInt(process.env.PORT) || 3000
    });

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: "0.0.1",
        }
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }

    server.route(Routes);
})();