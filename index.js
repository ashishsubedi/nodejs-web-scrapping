const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt6105098/';

(async ()=>{
    const response = await request(URL);
    const $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] > h1').text();
    let rating = $('span[itemprop="ratingValue"]').text() ;


    console.log(title,rating);
})()