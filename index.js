
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const {getCategories, getZodiacNames, getZodiacByType} = require('./handlers');
const {getZodiacByEnType} = require('./scraper');
const Vision = require('vision');
require("./scraper");
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
        handler: getCategories,
        description: 'Get Categories',
        notes: 'Returns categories list',
        tags: ['api'],
    }
});

Routes.push({
    method: 'GET',
    path: '/api/zodiac/names',
    config: {
        handler: getZodiacNames,
        description: 'Get Zodiac Names',
        notes: 'Returns zodiacs list',
        tags: ['api'],
    }
});

Routes.push({
    method: 'GET',
    path: '/api/zodiac/{category}/{type}',
    config: {
        handler: getZodiacByType,
        description: 'Get Zodiac By type',
        notes: 'Returns zodiacs list',
        tags: ['api'],
    }
});

Routes.push({
    method: 'GET',
    path: '/api/zodiac/en/{category}/{type}',
    config: {
        handler: getZodiacByEnType
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
            version: '0.0.1',
        },
        host: 'horoscope-endpoint.herokuapp.com'
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