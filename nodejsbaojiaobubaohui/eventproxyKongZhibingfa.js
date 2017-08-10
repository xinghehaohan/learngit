/**
 * Created by su on 17/6/1.
 */
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var opn = require('opn');
var eventproxy = require('eventproxy');
var url = require('url');
var app = express();
var cnodeUrl ='http://cnodejs.org/';
var querystring = [];
superagent.get('http://cnodejs.org/topic/587ecfdcc4f5cf7619671566')
    .end(function (err,text) {
        var $ = cheerio.load(text.text)
        var query = {
            // topicurl:topicurl,
            title:$('#content .topic_header .topic_full_title').text().trim(),
            qianming:$('.signature').text(),
            userName:$('.user_name .dark').text(),
            userImg:$('.user_avatar').find('img').attr('src'),
            watchNumber :$('#content .panel').eq(1).find('.col_fade').text(),
            markdownText:$('.reply_content').eq(0).find('.markdown-text').text()
        };
        querystring.push(query)
    });
app.get('/',function (res,res,next) {
    superagent.get(cnodeUrl)
        .end(function (err,sres) {
            if (err){
                next(err);
            }
            var topicUrls = [];
            var $ = cheerio.load(sres.text);
            $('#topic_list .topic_title').each(function (idx,ele) {
              var href = url.resolve(cnodeUrl,$(ele).attr('href'));
                topicUrls.push(href)
            });

            var ep = new eventproxy();
            topicUrls.forEach(function (topicUrl) {
                superagent.get(topicUrl)
                    .end(function (err,res) {
                        // console.log('fetch'+topicUrl+'successful');
                        console.log(res.text)
                        ep.emit('topic_html',[topicUrl,res])
                    })
            });
            var tos;
            ep.after('topic_html',topicUrls.length,function (topics) {
                tos = topics.map(function (topicPair) {
                    var topicurl = topicPair[0];
                    var topichtml = topicPair[1];
                    var $ = cheerio.load(topichtml);
                        return({
                            topicurl:topicurl,
                            title:$('#content .topic_header .topic_full_title').text().trim(),
                            qianming:$('.signature').text(),
                            userName:$('.user_name .dark').text(),
                            userImg:$('.user_avatar').find('img').attr('src'),
                            watchNumber :$('#content .panel').eq(1).find('.col_fade').text(),
                            markdownText:$('.reply_content').eq(0).find('.markdown-text').text()
                        })
                });
                console.log('结束爬虫');
                console.log(tos)
                res.send({
                    topicContent:tos,
                    topicurl:topicUrls,
                    resaultCode:1,
                    querystring:querystring
                });
            });
        })
});



var uri = 'http://localhost:4000';
    opn(uri);

app.listen(4000, function () {
    console.log('app is listening at port 4000');
});