
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const { getCategories, getZodiacByType } = require('./handlers');
const {getLanguages} = require('./languages');
const Vision = require('vision');
require('./cron');
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
    path: '/api/zodiac/signs',
    config: {
        handler: getCategories,
        description: 'Get Categories',
        notes: 'Returns categories list',
        tags: ['api'],
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
    path: '/api/languages',
    config: {
        handler: getLanguages,
        description: 'Get The List Of Supported Languages',
        notes: 'Returns languages list',
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
            version: '0.0.1',
        },
        host: 'horoscope-endpoint.herokuapp.com'
    };

    await server.register([
        {
            plugin: require('hapi-i18n'),
            options: {
                locales: ['ru', 'en', 'es', 'nl', 'de', 'fr', 'pt', 'ms'],
                directory: __dirname + '/locales',
                queryParameter: 'language',
                defaultLocale: 'en'
            }
        },
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

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});