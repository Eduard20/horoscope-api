
const CronJob = require('cron').CronJob;
const _ = require('lodash');
const fs = require('fs');
const path = `${__dirname}/numbers.json`;
global.NUMBERS = {};
if (fs.existsSync(path)) {
    global.NUMBERS = require(path);
} else {
    calculateNumbers();
}
const cronContext = {
    onTick: calculateNumbers,
    start: false,
    timeZone: 'Europe/Moscow'
};

function getZodiacCategoryNumbers(categories) {
    const resultObj = {};
    categories.forEach(one => {
        resultObj[one] = _.random(4, 10, true).toFixed(1)
    });
    return resultObj;
}

function calculateNumbers() {
    const zodiacs = ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'];
    const categories = ['health', 'love', 'business'];
    if (fs.existsSync(path)) fs.unlinkSync(path);

    zodiacs.forEach(one => {
        global.NUMBERS[one] = getZodiacCategoryNumbers(categories)
    });
    fs.writeFile(path, JSON.stringify(global.NUMBERS), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

const job = new CronJob({
    cronTime: '00 30 08 * * 0-6',
    ...cronContext
});

job.start();
