// Node.JS 내외부 모듈추출
const   cookieParser = require('cookie-parser');
const   session = require('express-session');
const   bodyParser = require('body-parser');
const   express = require('express');
const   app = express();
const   createError = require('http-errors');
const   path = require('path');

// 쇼핑몰 개발소스 모듈
const   users = require('./routes/users');
const   admin = require('./routes/admin');
const   mainui = require('./routes/mainui');
const   adminprod = require('./routes/adminprod');
const   mobile = require('./routes/mobile');
const   trade = require('./routes/trade');
const   auctionm = require('./routes/auctionm');

// 쇼핑몰전용 PORT주소 설정
const   PORT = 65009;

// 실행환경 설정부분
app.set('views', path.join(__dirname, 'views'));  // views경로 설정
app.set('view engine', 'ejs');                    // view엔진 지정
app.use(express.static(path.join(__dirname, 'public')));   // public설정
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ key: 'sid',
                  secret: 'secret key',  // 세션id 암호화할때 사용
                  resave: false,         // 접속할때마다 id부여금지
                  saveUninitialized: true })); // 세션id사용전에는 발급금지

// URI와 핸들러를 매핑
app.use('/', admin);
app.use('/users', users);
app.use('/mainui', mainui);       // URI (/mainui) 접속하면 mainui로 라우팅
app.use('/mobile', mobile);
app.use('/trade', trade);
app.use('/auctionm', auctionm);
app.use('/adminprod', adminprod);
// app.use('/log', login);
// app.use('/log', login);
// app.use('/log', login);


// 서버를 실행합니다.
app.listen(PORT, function () {
       console.log('서버실행: http://203.249.127.60:' + PORT);
       console.log('서버실행: http://192.9.80.96:' + PORT);
});
