// 메인화면 출력파일
const  express = require('express');
const  ejs = require('ejs');
const   fs = require('fs');
const  router = express.Router();
var    loglevel = 1;

const  GetMainUI = (req, res) => {   // 메인화면을 출력합니다
let    htmlstream = '';

     logging(loglevel, 'router.get() invoked!');

     htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
     if (req.session.auth) {  // 만약, 관리자가 로그인했다면
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admincontent.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
       res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                         'logurl': '/logout',
                                         'loglabel': 'Logout',
                                         'regurl': '/admodified',
                                         'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
     } else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
       res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                          'warn_title':'세션오류',
                          'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                          'return_url':'/' }));
     }


};

const logging = (level, logmsg) => {
       if (level != 0) {
         console.log(level, logmsg)
         loglevel++;
      }
}

// ‘/’ get 메소드의 핸들러를 정의
router.get('/', GetMainUI);

// 외부로 뺍니다.
module.exports = router
