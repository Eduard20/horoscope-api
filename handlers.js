
const rp = require("request-promise-native");
const moment = require("moment");
const {sendResponse} = require('./common');
const { getZodiacByEnType } = require('./scraper');
const parseString = require('xml2js').parseString;
const HOROSCOPE = {
    daily: {
        common: {

        },
        business: {

        },
        love: {

        },
        health: {

        },
        erotic: {

        },
        cook: {

        },
        anti: {

        }
    },
    weekly: ""
};

const options = {
    uri: 'http://ignio.com/r/export/utf/xml/daily/bus.xml',
    headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36"
    }
};

const urls = {
    daily: {
        common: "http://ignio.com/r/export/utf/xml/daily/com.xml",
        business: "http://ignio.com/r/export/utf/xml/daily/bus.xml",
        love: "http://ignio.com/r/export/utf/xml/daily/lov.xml",
        health: "http://ignio.com/r/export/utf/xml/daily/hea.xml",
        beauty: "",
        erotic: "http://ignio.com/r/export/utf/xml/daily/ero.xml",
        cook: "http://ignio.com/r/export/utf/xml/daily/cook.xml",
        anti: "http://ignio.com/r/export/utf/xml/daily/anti.xml"
    },
    weekly: "http://ignio.com/r/export/utf/xml/weekly/cur.xml"
};

const handlers = {

    getCategories: (request, h) => {
        let categories = [];
        if (request.query.language && 'ru' === request.query.language) {
            categories = [
                {
                    "name": request.i18n.__('common'),
                    "theme": "purple"
                },
                {
                    "name": request.i18n.__('business'),
                    "theme": "green"
                },
                {
                    "name": request.i18n.__('love'),
                    "theme": "orange"
                },
                {
                    "name": request.i18n.__('health'),
                    "theme": "purple"
                },
                {
                    "name": request.i18n.__('cook'),
                    "theme": "green"
                },
                {
                    "name": request.i18n.__('anti'),
                    "theme": "orange"
                }
            ];
        } else {
            categories = [
                {
                    "name": request.i18n.__('common'),
                    "theme": "purple"
                }
            ]
        }

        return {
            meta: {
                status: '200'
            },
            data: categories,
            pagination: {

            }
        }
    },

    getZodiacByType: async (request, h) => {
        try {
            const { category, type } = request.params;
            const { language } = request.query;
            if (language && 'en' === language.toLowerCase()) {
                return getZodiacByEnType(request, h)
            }
            const date = moment(new Date()).format("DD.MM.YYYY");
            if (!urls.daily[category]) return 'something wrong';
            if (HOROSCOPE.daily[category] && HOROSCOPE.daily[category][date]) {
                console.log('found daily this date');
                if (HOROSCOPE.weekly) {
                    console.log('also found weekly');
                    return sendResponse(
                        request,
                        HOROSCOPE.daily[category][date][type][0],
                        HOROSCOPE.weekly[type][0][category],
                        HOROSCOPE.daily[category][date].date[0].$
                    )
                }
                const week = await getWeekZodiac(options);
                return new Promise(resolve => {
                    parseString(week, async (err, result) => {
                        if (err) {
                            console.error(err);
                            return 'something wrong';
                        }
                        HOROSCOPE.weekly = {...result.horo};
                        return resolve(sendResponse(
                            request,
                            HOROSCOPE.daily[category][result.horo.date[0].$.today][type][0],
                            HOROSCOPE.weekly[type][0][category],
                            HOROSCOPE.daily[category][result.horo.date[0].$.today].date[0].$
                        ))
                    });
                })
            }
            const reqOptions = {
                ...options,
                uri: urls.daily[category]
            };
            const body = await rp(reqOptions);
            return new Promise(resolve => {
                parseString(body, async (err, result) => {
                    if (err) {
                        console.error(err);
                        return 'something wrong';
                    }
                    HOROSCOPE.daily[category] = {};
                    HOROSCOPE.daily[category][result.horo.date[0].$.today] = {...result.horo};
                    if (HOROSCOPE.weekly) {
                        console.log('only weekly found');
                        return resolve(sendResponse(
                            request,
                            HOROSCOPE.daily[category][result.horo.date[0].$.today][type][0],
                            HOROSCOPE.weekly[type][0][category],
                            HOROSCOPE.daily[category][result.horo.date[0].$.today].date[0].$
                        ))
                    }
                    const week = await getWeekZodiac(options);
                    parseString(week, async (err, weekResult) => {
                        if (err) {
                            console.error(err);
                            return 'something wrong';
                        }
                        HOROSCOPE.weekly = { ...weekResult.horo };
                        return resolve(sendResponse(
                            request,
                            HOROSCOPE.daily[category][result.horo.date[0].$.today][type][0],
                            HOROSCOPE.weekly[type][0][category],
                            HOROSCOPE.daily[category][result.horo.date[0].$.today].date[0].$
                        ))
                    });
                });
            })
        } catch (err) {
            throw new Error
        }
    }

};

async function getWeekZodiac(opts) {
    const options = {
        ...opts,
        uri: urls.weekly
    };
    return await rp(options);
}

module.exports = handlers;