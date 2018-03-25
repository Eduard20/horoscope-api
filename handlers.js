
const categories = require('./data/categories');
const zodiacs = require('./data/zodiacs');
const rp = require("request-promise-native");
const moment = require("moment");
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
        gold: ""
        // car: ""
    },
    weekly: "http://ignio.com/r/export/utf/xml/weekly/cur.xml"
};

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
    },

    getZodiacByType: async (request, h) => {
        try {
            const { category, type } = request.params;
            const date = moment(new Date()).format("DD.MM.YYYY");
            if (!urls.daily[category]) return 'something wrong';
            if (HOROSCOPE.daily[category] && HOROSCOPE.daily[category][date]) {
                console.log('found daily this date');
                if (HOROSCOPE.weekly) {
                    console.log('also found weekly');
                    return sendResponse(
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

function sendResponse(daily, week, dates) {
    // console.log(dates);
    // const data = [
    //     {yesterday: daily.yesterday[0]},
    //     {today: daily.today[0]},
    //     {tomorrow: daily.tomorrow[0]},
    //     {tomorrow02: daily.tomorrow02[0]},
    //     {week: week[0]}
    // ];
    const numbers =  [
        {
            "name" : "friendship",
            "number" : "6.25/10"
        },
        {
            "name" : "love",
            "number" : "8.6/10"
        },
        {
            "name" : "business",
            "number" : "3.5/10"
        }
    ];
    const data = [
        {
            horoscope: {
                name: "yesterday",
                data: daily.yesterday[0]
            },
            date: dates.yesterday,
            numbers
        },
        {
            horoscope: {
                name: "today",
                data: daily.today[0]
            },
            date: dates.today,
            numbers
        },
        {
            horoscope: {
                name: "tomorrow",
                data: daily.tomorrow[0]
            },
            date: dates.tomorrow,
            numbers
        },
        {
            horoscope: {
                name: "tomorrow02",
                data: daily.tomorrow02[0]
            },
            date: dates.tomorrow02,
            numbers
        },
        {
            horoscope: {
                name: "week",
                data: week[0]
            },
            date: 'to be done',
            numbers
        },
    ];

    return {
        meta: {
            status: 200
        },
        data
    };
}

module.exports = handlers;