

module.exports = {
    sendResponse
};

function sendResponse(request, daily, week, dates) {
    const { type } = request.params;
    const numbers =  [
        {
            "name" : request.i18n.__('health'),
            "number" : `${global.NUMBERS[type].health}/10`
        },
        {
            "name" : request.i18n.__('love'),
            "number" : `${global.NUMBERS[type].love}/10`
        },
        {
            "name" : request.i18n.__('business'),
            "number" : `${global.NUMBERS[type].business}/10`
        }
    ];
    const data = [
        {
            horoscope: {
                name: request.i18n.__('yesterday'),
                data: daily.yesterday[0].replace(/\n/g, '')

            },
            date: dates.yesterday,
            numbers
        },
        {
            horoscope: {
                name: request.i18n.__('today'),
                data: daily.today[0].replace(/\n/g, '')
            },
            date: dates.today,
            numbers
        },
        {
            horoscope: {
                name: request.i18n.__('tomorrow'),
                data: daily.tomorrow[0].replace(/\n/g, '')
            },
            date: dates.tomorrow,
            numbers
        },
        // {
        //     horoscope: {
        //         name: request.i18n.__('tomorrow02'),
        //         data: daily.tomorrow02[0].replace(/\n/g, '')
        //     },
        //     date: dates.tomorrow02,
        //     numbers
        // }
    ];

    if (week) {
        data.push({
            horoscope: {
                name: request.i18n.__('week'),
                data: week[0].replace(/\n/g, '')
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

