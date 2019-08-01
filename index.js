const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
// const { Parser } = require('json2csv');

const USERNAME = 'willsmith/';
const URL = `https://www.instagram.com/${USERNAME}`;


(async () => {
    
    let response = await request(`${URL}`);
    let $ = cheerio.load(response);
    
    let script = $('script[type="text/javascript"]').eq(3);
    
    //21
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    
    let { entry_data:{ ProfilePage: {[0]: {graphql :{user}}  }}} = JSON.parse(script_regex[1]);

    let instagram_data = {
        followers : user.edge_followed_by.count,
        following: user.edge_follow.count,
        name: user.full_name,
        avatar_url: user.profile_pic_url_hd,
        uploads : user.edge_owner_to_timeline_media.count,

    }

    console.log(instagram_data)
  
    debugger;
})()