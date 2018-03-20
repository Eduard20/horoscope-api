
const categories = require('./data/categories');
const zodiacs = require('./data/zodiacs');

const handlers = {

    getCategories: (request, h) => {
        return {
            meta: {
                status: '200'
            },
            data: categories,
            pagination: {

            }
        }
    },

    getZodiacNames: (request, h) => {
        return {
            meta: {
                status: '200'
            },
            data: zodiacs,
            pagination: {

            }
        }
    }

};

module.exports = handlers;