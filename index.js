
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

const categories = [
    {
        name: 'business',
        order: 1,
        theme: 'purple'
    },
    {
        name: 'common',
        order: 2,
        theme: 'green'
    },
    {
        name: 'love',
        order: 3,
        theme: 'orange'
    },
    {
        name: 'health',
        order: 4,
        theme: 'purple'
    },
    {
        name: 'car',
        order: 5,
        theme: 'green'
    },
    {
        name: 'beauty',
        order: 6,
        theme: 'orange'
    },
    {
        name: 'erotic',
        order: 7,
        theme: 'purple'
    },
    {
        name: 'gold',
        order: 8,
        theme: 'green'
    }
];

Routes.push({
    method: 'GET',
    path: '/api/zodiac/categories',
    config: {
        handler: (request, h) => {
            return {
                meta: {
                    status: '200'
                },
                data: categories,
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
        port: parseInt(process.env.PORT) || 3000
    });

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: '0.0.1',
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