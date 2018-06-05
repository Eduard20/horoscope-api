
const {makeWeeklyGeneration} = require('./cron');

module.exports = {
    sendResponse
};

function returnNumbersArray(request, type) {
    return [
        {
            "name" : request.i18n.__('health'),
            "number" : `${type.health}/10`
        },
        {
            "name" : request.i18n.__('love'),
            "number" : `${type.love}/10`
        },
        {
            "name" : request.i18n.__('business'),
            "number" : `${type.business}/10`
        }
    ];
}

function sendResponse(request, daily, week, dates) {
    const { type } = request.params;
    const data = [
        {
            horoscope: {
                name: request.i18n.__('yesterday'),
                data: daily.yesterday[0].replace(/\n/g, '')

            },
            date: dates.yesterday,
            numbers: global.NUMBERS[dates.yesterday]
                ? returnNumbersArray(request,global.NUMBERS[dates.yesterday][type])
                : returnNumbersArray(request,makeWeeklyGeneration(dates.today)[dates.yesterday][type])
        },
        {
            horoscope: {
                name: request.i18n.__('today'),
                data: daily.today[0].replace(/\n/g, '')
            },
            date: dates.today,
            numbers: global.NUMBERS[dates.today]
                ? returnNumbersArray(request,global.NUMBERS[dates.today][type])
                : returnNumbersArray(request,makeWeeklyGeneration(dates.today)[dates.today][type])
        },
        {
            horoscope: {
                name: request.i18n.__('tomorrow'),
                data: daily.tomorrow[0].replace(/\n/g, '')
            },
            date: dates.tomorrow,
            numbers: global.NUMBERS[dates.tomorrow]
                ? returnNumbersArray(request,global.NUMBERS[dates.tomorrow][type])
                : returnNumbersArray(request,makeWeeklyGeneration(dates.today)[dates.tomorrow][type])
        }
    ];

    if (dates.tomorrow02) {
        data.push(        {
            horoscope: {
                name: request.i18n.__('tomorrow02'),
                data: daily.tomorrow02[0].replace(/\n/g, '')
            },
            date: dates.tomorrow02,
            numbers: global.NUMBERS[dates.tomorrow02]
                ? returnNumbersArray(request,global.NUMBERS[dates.tomorrow02][type])
                : returnNumbersArray(request,makeWeeklyGeneration(dates.today)[dates.tomorrow02][type])
        })
    }

    if (week) {
        data.push({
            horoscope: {
                name: request.i18n.__('week'),
                data: week[0].replace(/\n/g, '')
            },
            date: request.i18n.__('week'),
            numbers: global.NUMBERS.week
                ? returnNumbersArray(request,global.NUMBERS.week[type])
                : returnNumbersArray(request,makeWeeklyGeneration()['week'][type])
        })
    }

    return {
        meta: {
            status: 200
        },
        data
    };
}

