const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');

const URLS = [
    'https://www.imdb.com/title/tt6105098/',
    'https://www.imdb.com/title/tt6320628/'
];

const moviesData = [];

(async () => {
    for (const url of URLS) {
        const response = await request({
            uri: url,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Host': 'www.imdb.com',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0'
            },
            gzip: true
        });
        const $ = cheerio.load(response);
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('span[itemprop="ratingValue"]').text();
        let totalRatings = $('div[class="imdbRating"] > a').text();
        let runningTime = $('div[class="subtext"] > time').text().trim();
        let releaseDate = $('div[class="subtext"] > a[title="See more release dates"]').text().trim();
        let poster = $('div[class="poster"]> a> img').attr('src');
        let genres = [];


        $('div[class="subtext"] > a[href*="genres"]').each((i, elem) => {
            let genre = $(elem).text();

            genres.push(genre);
        })

        moviesData.push({
            title,
            rating,
            totalRatings,
            runningTime,
            releaseDate,
            poster,
            genres
        })
        
    }
    console.log(moviesData);

    // const json2csvParser = new Parser();
    // const csv = json2csvParser.parse(moviesData)

    // fs.writeFileSync('./data.csv',csv,'utf-8');
    // console.log(csv)
})()