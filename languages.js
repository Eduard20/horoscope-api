
const languages = [
    {
        title: 'german',
        keyword: 'de'
    },
    {
        title: 'english',
        keyword: 'en'
    },
    {
        title: 'spanish',
        keyword: 'es'
    },
    {
        title: 'french',
        keyword: 'fr'
    },
    {
        title: 'malay',
        keyword: 'ms'
    },
    {
        title: 'dutch',
        keyword: 'nl'
    },
    {
        title: 'portuguese',
        keyword: 'pt'
    },
    {
        title: 'russian',
        keyword: 'ru'
    },
    ]


module.exports = {
    getLanguages: () => {
        return languages
    }
};