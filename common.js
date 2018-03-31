

module.exports = {
    sendResponse
};

function sendResponse(request, daily, week, dates) {
    const numbers =  [
        {
            "name" : request.i18n.__('health'),
            "number" : "6.25/10"
        },
        {
            "name" : request.i18n.__('love'),
            "number" : "8.6/10"
        },
        {
            "name" : request.i18n.__('business'),
            "number" : "3.5/10"
        }
    ];
    const data = [
        {
            horoscope: {
                name: request.i18n.__('yesterday'),
                data: daily.yesterday[0]
            },
            date: dates.yesterday,
            numbers
        },
        {
            horoscope: {
                name: request.i18n.__('today'),
                data: daily.today[0]
            },
            date: dates.today,
            numbers
        },
        {
            horoscope: {
                name: request.i18n.__('tomorrow'),
                data: daily.tomorrow[0]
            },
            date: dates.tomorrow,
            numbers
        },
        {
            horoscope: {
                name: request.i18n.__('tomorrow02'),
                data: daily.tomorrow02[0]
            },
            date: dates.tomorrow02,
            numbers
        }
    ];

    if (week) {
        data.push({
            horoscope: {
                name: request.i18n.__('week'),
                data: week[0]
            },
            date: request.i18n.__('week'),
            numbers
        })
    }

    return {
        meta: {
            status: 200
        },
        data
    };
}

