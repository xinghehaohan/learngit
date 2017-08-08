/**
 * Created by su on 17/8/8.
 */
var fs = require('fs');

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/');
db.connection.on('open', function () {
    console.log('——数据库连接成功！——');
});

var Schema = mongoose.Schema;
var movieSchema = new Schema({
    mate: {
        createAt: {
            type: Date,
            defult: Date.now()
        },
        updateAt: {
            type: Date,
            defult: Date.now()
        }
    },
    doctor: String,//导演
    title: String,
    language: String,
    country: String,
    summary: String,//简介
    flash: String,//片源的地址
    poster: String,//海报的地址
    year: String,
});

movieSchema.statics = {
    fetch: function (cb) {
        //取出数据库所有数据
        return this
            .find({})
            .sort('meta.updateAt')  //排序
            .exec(cb)
    },
    findById: function (id, cb) {
        //查询单条数据
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

var Movies = mongoose.model('Movies', movieSchema);

(function () {
    for (let i=0;i<250;){
        (function () {
            savefileTomongo(i)
        })(i)
        i +=25
    }
})();
function savefileTomongo(index) {
    fs.readFile('./data/'+index+'25.json','utf-8',function (err,data) {
        if(err){
            console.log(err)
        }
        var data = JSON.parse(data);
        save(data)

    })
}


function save(data) {
    for (var i=0;i<data.length;i++){
        let di = data[i]

        let query = {
            doctor: di.daoyan,//导演
            title: di.title,
            language: di.pingjia,
            country: di.pingjia,
            summary: di.quote,//简介
            flash: di.imageUrl,//片源的地址
            poster: di.imageUrl,//海报的地址
            createAt:'2017-0728',
            updateAt:'1993-10-10'
        };
        console.log(query)

        var movieData = new Movies(query)
        // 保存数据
        movieData.save(function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Save success');
            }
        })
    }
}



// Movies.fetch(function (err,data) {
//     if (err){
//         console.log(err)
//     }
//     console.log('data'+data)
// });