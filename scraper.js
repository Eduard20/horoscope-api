
const rp = require("request-promise-native");
const cheerio = require('cheerio');

const options = {
    uri: 'http://ignio.com/e/daily/tom02/aries.html',
};

const zodiac = {



};

module.exports = zodiac;

async function getEnglish() {
    const html = await rp(options);
    const $ = cheerio.load(html);
    $('body div').not((i, el) => {
        if (el.attribs.style) {
            // return el.children[2].data;
            console.log(el.children[2].data);
        }
    });
}



// getEnglish();
