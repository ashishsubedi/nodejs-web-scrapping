const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
// const { Parser } = require('json2csv');
const request = require('request');

const URLS = [
    {
        url: 'https://www.imdb.com/title/tt6105098/',
        id: 'the_lion_king'
    },

    {
        url: 'https://www.imdb.com/title/tt6320628/',
        id: 'spiderman_far_from_home'
    }
];

const moviesData = [];

(async () => {
    for (const movie of URLS) {
        const response = await requestPromise({
            uri: movie.url,
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
        const file = fs.createWriteStream(`./images/${movie.id}.jpg`)
        await new Promise((resolve, reject) => {
            const stream = request({
                uri: poster,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0'
                },
                gzip: true
            })
                .pipe(file)
                .on('finish', () => {
                    console.log(`${movie.id} has finished downloading poster`);
                    resolve();
                })
                .on('error', (err) => {
                    console.log(`${movie.id} has error`);
                    reject(err);
                })
        }).catch(err => {
            console.log(err);
        });



    }

})()