/**
 * Created by su on 17/1/17.
 */
var nodemailer = require('nodemailer');
var  transporter = nodemailer.createTransport({
    host: "smtp.163.com",//邮箱的服务器地址，如果你要换其他类型邮箱（如QQ）的话，你要去找他们对应的服务器，
    secureConnection: true,
    port:465,//端口，这些都是163给定的，自己到网上查163邮箱的服务器信息
    auth: {
        user: '13102215187@163.com',//邮箱账号
        pass: 'sjj5792333',//邮箱密码
    }
});


var mailOptions = {
    to: '673399718@qq.com', // 同上面user
    from: '13201095677@163.com',
    subject: '测试', // Subject line
    text: '成功了么', // plaintext body
    html: '<b>Get！</b>' // html body
};

transporter.sendMail(mailOptions,function (err,info) {
    if (err){
        console.log(err);
    }else {
        console.log('Message sent: ' + info.response)
    }
})