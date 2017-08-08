/**
 * Created by su on 17/8/8.
 */
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var opt = {
    url:'https://movie.douban.com/subject/1291546/',
    hostname: 'movie.douban.com',
    path: '/top250',
    Referer:'https://movie.douban.com/top250?start=0&filter=',
    Cookie:'bid=Obatoe_ouaw; gr_user_id=075fd7f8-c860-499f-9166-ab68f3343c87; ll="118408"; __yadk_uid=VWTqOtDg9DyExmzLTuBAnLvBAm1KefJy; viewed="3239549_6840152_27037148_10594787_6388661_1083428_26770866_26864984_26902177"; _vwo_uuid_v2=D292A179B067B106AE8FB30E938190B6|0fbe2e9504c54ff57bdef8b4c5579dc6; __utma=30149280.1434793114.1478602560.1502186018.1502191051.65; __utmb=30149280.0.10.1502191051; __utmc=30149280; __utmz=30149280.1502181322.63.58.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.906829824.1478854800.1502186018.1502191051.30; __utmb=223695111.0.10.1502191051; __utmc=223695111; __utmz=223695111.1502181322.28.25.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1502191070%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DaVyOFfecfGdhLAMrcMAmiqAbpPy_vYARL201bl_X_sXVqwDN8FT60Pk2FHnCcabA%26wd%3D%26eqid%3Dd9fc5b3c00011d500000000459897610%22%5D; _pk_id.100001.4cf6=d3b3af23cd238f67.1478854800.32.1502191070.1502186025.; _pk_ses.100001.4cf6=*'
};
var moviesItem = [];
function spidercontentUl(index) {
    https.get('https://movie.douban.com/top250?start='+index,function (res) {
        var pageSize = 25;
        var html ='';
        var info = [];
        res.setEncoding('utf-8');
        res.on('data',function (chunk) {
            html += chunk
        })
        res.on('end',function () {
            var $ = cheerio.load(html);
            $('.item').each(function (idx,item) {
                moviesItem.push($(item).find('.pic a').attr('href'))
            });
            saveData('./detailes/contentUrl.json',moviesItem)
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
            spidercontentUl(start);
        })(start)
        start += 25
    }
})()
