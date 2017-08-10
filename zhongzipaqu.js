/**
 * Created by su on 17/1/19.
 */
//http://f2e.souche.com/blog/chong-zi-pa-qu-xin-de/种子爬取
var http = require('http');
var cheerio = require('cheerio');
// http.request(options, callback);
http.get('http://bt2.bt87.cc/search/SMD31_ctime_1.html', function(res) {
    var data = '';
    res.setEncoding("utf8");

    res.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
        var $ = cheerio.load(data);
        var body = $('.media-body');
        var href =[];
        for (var i =0;i<body.length;i++){
            href.push('http://bt2.bt87.cc' + $(body[i]).find('.title').attr('href'))
        }
        console.log(href)
    });
});