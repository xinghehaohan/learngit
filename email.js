/**
 * Created by su on 17/1/17.
 */
var nodemailer = require('nodemailer');
var  transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 主机
    secure: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
        user: "673399718@qq.com", // 账号
        pass: "13201095677" // 密码
    }
});


var mailOptions = {
    from: '673399718@qq.com', // 同上面user
    to: '13201095677@163.com',
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