/**
 * Created by su on 17/8/8.
 */
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio');
var eventproxy = require('eventproxy');

    var urls = [];
    var info = [];
    var flag = false;
fs.readFile('./detailes/contentUrl.json','utf-8',function (err,data) {
        if (err){
            console.log(err)
        }
        urls = JSON.parse(data)
        console.log('down');
        flag = true;
    });

    function readItemUrl(url) {
        console.log('url'+url)
        https.get(url,function (res) {
            var html ='';
            res.setEncoding('utf-8');
            res.on('data',function (chunk) {
                html += chunk
            })
            res.on('end',function () {
                var $ = cheerio.load(html);
                info.push({
                    title:$('#content h1').first().find('span').first().text(),
                    summary:$('#link-report span').first().text(),
                    attrs:$('#info .attrs a').text(),
                    language:$('#info .pl').eq(5).parent().text(),
                    doctor:$('#info .attrs a').text(),
                    country:$('#info .pl').eq(4).parent().text(),
                    flash:$('#related-pic .related-pic-bd li img').attr('rc'),
                    poster:$('#mainpic img').attr('src'),
                    year:$('#info .pl').eq(6).parent().text(),
                });
                ep.emit('down',info)
            })
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
var ep = new eventproxy();
    var timmer = setInterval(function () {
        if(flag){
            urls.forEach(function (url) {
                readItemUrl(url)
            });
            clearInterval(timmer);
        }

    },1000);
// readItemUrl(urls[1])
ep.after('down',1,function (info) {
    saveData('./movieDetails/Movie.json',info)
});
