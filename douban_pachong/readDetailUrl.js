/**
 * Created by su on 17/8/8.
 */
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio');
var request = require("request");
var eventproxy = require('eventproxy');

    var urls = [];
    var info = [];
    var proxys = [];
    var flag = false;
var ep = new eventproxy();
fs.readFile('./detailes/contentUrl.json','utf-8',function (err,data) {
        if (err){
            console.log(err)
        }
        urls = JSON.parse(data).splice(125);
        // console.log(urls)
    flag = true;
});

fs.readFile('./proxys/proxys.json','utf-8',function (err,data) {
    if (err){
        console.log(err)
    }
    proxys = JSON.parse(data)
    // flag = true;
});
    var count = 99;
    function readItemUrl(url) {
        var options = {
            url: url,
            // proxy:proxys[ Math.floor(Math.random()*10+1)] ,
            method: 'GET',
            // timeout: 20000,  //20s没有返回则视为代理不行,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
            } //给个浏览器头，不然网站拒绝访问
        };
            request(options,function (error,res) {
                if(error){
                    console.log(error)
                }
                    count--
                    console.log(url +'count:'+count)
                var $ = cheerio.load(res.body);
                    info.push({
                        title:$('#content h1').first().find('span').first().text(),
                        summary:$('#link-report span').first().text(),
                        language:$('.rating_people').find('span').text(),
                        doctor:$('#info .attrs').eq(0).find('a').text(),
                        country:$('.rating_num').text(),
                        flash:$('#related-pic .related-pic-bd li img').attr('src'),
                        poster:$('#mainpic img').attr('src'),
                        year:$('.year').text(),
                    });
                    if(count ==0){
                        saveData('./movieDetails/Movie.json',info)
                    }
                    // ep.emit('down',info)
            });

    }

function saveData (path,movies) {
    fs.writeFile(path,JSON.stringify(movies),function (err) {
        if(err){
            console.log(err)
        }
        console.log('dataSaved!')
    })
}
    var timmer = setInterval(function () {
        if(flag){
            urls.forEach(function (url) {
                readItemUrl(url)
            });
            clearInterval(timmer);
        }

    },1000);
// ep.after('down',urls.length,function (info) {
//     saveData('./movieDetails/Movie.json',info)
// });

