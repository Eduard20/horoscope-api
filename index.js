
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
        name: 'common',
        order: 1,
        theme: 'purple'
    },
    {
        name: 'business',
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

const zodiacNames = [
    {
        title: "Aries",
        range: "March 21 - April 20"
    },
    {
        title: "Taurus",
        range: "April 21 - May 20"
    },
    {
        title: "Gemini",
        range: "May 21 - June 21"
    },
    {
        title: "Cancer",
        range: "June 22 - July 22"
    },
    {
        title: "Leo",
        range: "July 23 - August 23"
    },
    {
        title: "Virgo",
        range: "August 24 - September 23"
    },
    {
        title: "Libra",
        range: "September 24 - October 23"
    },
    {
        title: "Scorpio",
        range: "October 24 - November 22"
    },
    {
        title: "Sagittarius",
        range: "November 23 - December 21"
    },
    {
        title: "Capricorn",
        range: "December 22 - January 20"
    },
    {
        title: "Aquarius",
        range: "January 21 - February 20"
    },
    {
        title: "Pisces",
        range: "February 21 - March 20"
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

Routes.push({
    method: 'GET',
    path: '/api/zodiac/names',
    config: {
        handler: (request, h) => {
            return {
                meta: {
                    status: '200'
                },
                data: zodiacNames,
                pagination: {

                }
            }
        },
        description: 'Get Zodiac Names',
        notes: 'Returns zodiacs list',
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