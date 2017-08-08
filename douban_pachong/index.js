/**
 * Created by su on 17/8/8.
 */
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio');
var opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
};

function spiderMovie(index) {
    https.get('https://movie.douban.com/top250?start='+index,function (res) {
        var pageSize = 25;
        var html ='';
        var moviesItem = [];
        var info = [];
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html += chunk
        })
        res.on('end',function () {
            var $ = cheerio.load(html);
            $('.item').each(function (idx,item) {
                moviesItem.push($(item).find('.pic a').attr('href'))
                var moveInfo = {
                    imageUrl :$(item).find('.pic img').attr('src'),
                    title:$(item).find('.hd .title').text()+$(item).find('.hd .other').text(),
                    daoyan:$(item).find('.info .bd p').text(),
                    quote:$(item).find('.info .bd .quote .inq').text(),
                    star:$(item).find('.info .bd .rating_num').text(),
                    pingjia:$(item).find('.info .bd span').eq(3).text(),
                    contentUrl:$(item).find('.pic a').attr('href')
                };
                info.push(moveInfo)
            });
            saveData('./data/'+index+pageSize+'.json',info)
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

(function () {
 var start= 0;
    console.log('start__________'+start)

    while (start <250){
    (function () {
        spiderMovie(start);
    })(start)
    start += 25
}
})()
