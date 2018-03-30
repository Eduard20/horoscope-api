

module.exports = {
    sendResponse
};

function sendResponse(daily, week, dates) {
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
        }
    ];

    if (week) {
        data.push({
            horoscope: {
                name: "week",
                data: week[0]
            },
            date: 'to be done',
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

