const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

// ------------------------------------  로그인기능 --------------------------------------

// 로그인 화면을 웹브라우져로 출력합니다.
const PrintLoginForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/login_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/login',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

// 로그인을 수행합니다. (사용자인증처리)
const HandleLogin = (req, res) => {
  let body = req.body;
  let userid, userpass, username;
  let sql_str;
  let htmlstream = '';

      console.log(body.uid);
      console.log(body.pass);
      if (body.uid == '' || body.pass == '') {
         console.log("아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.");
         res.status(562).end('<meta charset=utf-8>아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.');
      }
      else {
       sql_str = "SELECT ad_id, ad_password, ad_name from t5_admin where ad_id ='"+ body.uid +"' and ad_password='" + body.pass + "';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("Login Fail as No id in DB!"); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                  htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'로그인 오류',
                                     'warn_message':'등록된 계정이나 암호가 틀립니다.',
                                     'return_url':'/' }));
             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  userid = item.ad_id;  userpass = item.ad_password; username = item.ad_name;
                  console.log("DB에서 로그인성공한 ID/암호:%s/%s", userid, userpass);
                  if (body.uid == userid && body.pass == userpass) {
                     req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                     req.session.who = username; // 인증된 사용자명 확보 (로그인후 이름출력용)
                     if (body.uid == 'admin')    // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                          req.session.admin = true;
                     res.redirect('/mainui');
                  }
                }); /* foreach */
              } // else
            }  // else
       });
   }
}

const PrintMain = (req, res) => {

  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/startPage.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/login',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

}



// REST API의 URI와 핸들러를 매핑합니다.
//  URI: http://xxxx/users/auth
router.get('/', PrintMain);
router.get('/login', PrintLoginForm);   // 로그인 입력화면을 출력
router.post('/auth', HandleLogin);     // 로그인 정보로 인증처리

// ------------------------------ 아이디 비밀번호 찾기 기능---------------------------

const PrintIdFindForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/idfind.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/logout',
                                             'loglabel': 'Logout',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/login',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

const PrintId = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let body = req.body;
  let    sql_str;
  let admin_name = body.uname;
  let admin_phone = body.uphone;

  console.log(admin_name);

           htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/print_id.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT ad_id from t5_admin where ad_name='"+ admin_name +"' and ad_phone='"+ admin_phone +"';"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'아이디찾기 실패 찾기 실패',
                                      'warn_message':'다시 입력해주세요.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                console.log(results[0].ad_id);
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()

};

router.get('/idfind', PrintIdFindForm);
router.post('/idfind', PrintId);
// ------------------------------  비밀번호 찾기 -------------------------------------
const PrintPassFindForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/passfind.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/logout',
                                             'loglabel': 'Logout',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/login',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

const PrintPassword = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let body = req.body;
  let    sql_str;
  let admin_id = body.uid;
  let admin_name = body.uname;
  let admin_ans = body.uanswer;

  console.log(admin_id);

           htmlstream = fs.readFileSync(__dirname + '/../views/logheader.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/print_pass.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT ad_password from t5_admin where ad_id='"+ admin_id +"' and ad_name='"+ admin_name +"' and ad_answer='"+ admin_ans +"';"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'비밀번호 찾기 실패',
                                      'warn_message':'다시 입력해주세요.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                console.log(results[0].ad_password);
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/login',
                                                       'loglabel': '로그인',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()

};
router.get('/passfind', PrintPassFindForm);
router.post('/passfind', PrintPassword);
// ------------------------------ 관리자 정보수정 --------------------------------
const AdminModifiedForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.session.who;

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admininf_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_admin where ad_name='"+ search_cat +"';";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {
             if (error) {
               htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                  'warn_title':'DB설정 오류',
                                  'warn_message':'다시 시도해주세요',
                                  'return_url':'/mainui' }));
             } else {res.end(ejs.render(htmlstream,  {  'title' : '쇼핑몰site',
                                               'logurl': '/logout',
                                               'loglabel': 'Logout',
                                               'regurl': '/admodified',
                                               'reglabel': req.session.who,
                                               'admin_name' : search_cat,
                                                admininf: results }));
                                                 // 조회된 상품정보
             }


       });
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

const AdminModified = (req, res) => {
let body = req.body;
let htmlstream='';
let search_cat, sql_str, addr, addr1, addr2, addr3;

    console.log(req.query.id);
    console.log(body.uname);   // 임시로 확인하기 위해 콘솔에 출력해봅니다.
    console.log('관리자 정보수정');

    if (body.pw1 == '' || body.pw2 == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('<meta charset="utf-8"> 데이터가 입력되지 않아 수정을 할 수 없습니다');
    }
    else {
      search_cat = req.query.id;
      addr1 = body.addr1;
      addr2 = body.addr2;
      addr3 = body.addr3;
      addr = addr1 + addr2 + addr3;
      console.log(addr);
      let params = [body.uname, body.pw1, body.ugender, body.ubirth, body.uphone , body.uanswer, addr, search_cat];
      sql_str = "UPDATE t5_admin SET ad_name =?, ad_password=?, ad_gender=?, ad_birth=?, ad_phone=?, ad_answer=?, ad_address=? where ad_id=?;";
       db.query(sql_str, params , (error, results, fields) => {
          if (error) {
            htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
            res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                               'warn_title':'관리자정보 수정 오류',
                               'warn_message':'다시 시도해주세요',
                               'return_url':'/mainui' }));
          } else {
            htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
            res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                               'warn_message':'정보 수정 완료!',
                              'return_url':'/mainui'}));
           console.log("DB에 "+ search_cat +" 의 정보를 수정하였습니다.!");

          }
       });

    }
};

router.get('/admodified', AdminModifiedForm);
router.post('/admodified', AdminModified);

// ------------------------------  관리자 관리기능 -----------------------------------

const AdminAddForm = (req, res) => {
  let    htmlstream = '';

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminadd_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/logout',
                                             'loglabel': 'Logout',
                                             'regurl': '/admodified',
                                             'reglabel': req.session.who }));

       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


const AdminAdd = (req, res) => {
  let body = req.body;
  let htmlstream='';
  let addr, addr1, addr2, addr3;

      console.log(req.query.id);
      console.log(body.uname);   // 임시로 확인하기 위해 콘솔에 출력해봅니다.
      console.log('관리자 추가');

      if (body.pw1 == '' || body.pw2 == '') {
           console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
           res.status(561).end('<meta charset="utf-8"> 데이터가 입력되지 않아 수정을 할 수 없습니다');
      }
      else {
        addr1 = body.addr1;
        addr2 = body.addr2;
        addr3 = body.addr3;
        addr = addr1 + addr2 + addr3;
         db.query('INSERT INTO t5_admin (ad_id, ad_password, ad_name, ad_gender, ad_birth, ad_phone, ad_hint, ad_answer, ad_address) VALUES (?,?,?,?,?,?,?,?,?)',
         [body.uid, body.pw1, body.uname, body.ugender, body.ubirth, body.uphone, body.uhint, body.uanswer, addr], (error, results, fields) => {
            if (error) {
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'관리자정보 등록 오류',
                                 'warn_message':'다시 시도해주세요',
                                 'return_url':'/mainui' }));
            } else {
              htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
              res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_message':'관리자 등록 완료!',
                                'return_url':'/mainui'}));
             console.log("DB에 "+  body.uid +" 의 정보를 관리자로 등록하였습니다.!");

            }
         });

      }


};

const AdminList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/ad_list.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_admin order by ad_name desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminList: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'관리자조회 오류',
                                      'warn_message':'조회된 관리자가 없습니다.',
                                      'return_url':'/mainui' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/logout',
                                                       'loglabel': 'Logout',
                                                       'regurl': '/admodified',
                                                       'reglabel':req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                      userdata : results }));  // 조회된 상품정보


                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


router.get('/adlist/:page', AdminList);
router.get('/adminadd', AdminAddForm);
router.post('/adminadd', AdminAdd);

// ------------------------------  로그아웃기능 --------------------------------------

const HandleLogout = (req, res) => {
       req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결
       res.redirect('/');         // 로그아웃후 메인화면으로 재접속
}

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/logout', HandleLogout);       // 로그아웃 기능


// --------------- 정보변경 기능을 개발합니다 --------------------
const AdminPrintQNA = (req, res) => {
  let    htmlstream = '';
  let    sql_str;
  let search_cat = '답변대기';
  var page = req.params.page;
  console.log(search_cat);

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/qNalist.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_message where a_status='"+ search_cat +"' order by q_time desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintUser: DB query is failed"); }

              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/logout',
                                                       'loglabel': 'Logout',
                                                       'regurl': '/admodified',
                                                       'reglabel':req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                        mesdata : results }));  // 조회된 상품정보


                 } // else
           }); // db.query()
       }
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
const AdminPrintQNAfin = (req, res) => {
  let    htmlstream = '';
  let    sql_str;
  let search_cat = '답변완료';
  var page = req.params.page;
  console.log(search_cat);

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/qNalist2.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_message where a_status='"+ search_cat +"' order by q_time desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintUser: DB query is failed"); }

              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/logout',
                                                       'loglabel': 'Logout',
                                                       'regurl': '/admodified',
                                                       'reglabel':req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                        mesdata : results }));  // 조회된 상품정보


                 } // else
           }); // db.query()
       }
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const PrintQuest = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.query.num;

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/answer_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_message where list_num='"+ search_cat +"';";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {
             if (error) {
               htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                  'warn_title':'DB설정 오류',
                                  'warn_message':'다시 시도해주세요',
                                  'return_url':'/mainui' }));
             } else {res.end(ejs.render(htmlstream,  {  'title' : '쇼핑몰site',
                                               'logurl': '/logout',
                                               'loglabel': 'Logout',
                                               'regurl': '/admodified',
                                               'reglabel': req.session.who,
                                                mesdata : results }));
                                                 // 조회된 상품정보
             }


       });
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const AdminGoAnswer = (req,res) =>{
  let body = req.body;
  let htmlstream='';
  let search_cat, sql_str, regdate;

      console.log(req.query.list_num);
      console.log(body.a_status);
   // 임시로 확인하기 위해 콘솔에 출력해봅니다.
      console.log('문의사항 답변');

        search_cat = req.query.list_num;
        regdate = new Date();
        let params = [body.a_title, body.a_answer, body.a_status, regdate, search_cat];
        sql_str = "UPDATE t5_message SET a_title=?, a_answer=?, a_status=?, a_time=? where list_num=?;";
         db.query(sql_str, params , (error, results, fields) => {
            if (error) {
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'관리자정보 수정 오류',
                                 'warn_message':'다시 시도해주세요',
                                 'return_url':'/mainui' }));
            } else {
              htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
              res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_message':'답변 완료!',
                                'return_url':'/qnalistfin/1'}));
             console.log("DB에 "+ search_cat +" 의 답변을 전송하였습니다.!");

            }
         });

  };

  const Printanswer = (req, res) => {
    let    htmlstream = '';
    let    htmlstream2 = '';
    let    sql_str, search_cat;

         if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
             search_cat= req.query.num;

             htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/answerview_form.ejs','utf8'); // 괸리자메인화면
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
             sql_str = "SELECT * from t5_message where list_num='"+ search_cat +"';";

             res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
             db.query(sql_str, (error, results, fields) => {
               if (error) {
                 htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                 res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                    'warn_title':'DB설정 오류',
                                    'warn_message':'다시 시도해주세요',
                                    'return_url':'/mainui' }));
               } else {res.end(ejs.render(htmlstream,  {  'title' : '쇼핑몰site',
                                                 'logurl': '/logout',
                                                 'loglabel': 'Logout',
                                                 'regurl': '/admodified',
                                                 'reglabel': req.session.who,
                                                  mesdata : results }));
                                                   // 조회된 상품정보
               }


         });
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
           res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                              'warn_title':'세션오류',
                              'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                              'return_url':'/' }));
        }
      }

router.get('/qnalist/:page', AdminPrintQNA);
router.get('/qnalistfin/:page', AdminPrintQNAfin);
router.get('/viewanswer', Printanswer);
router.get('/goanswer', PrintQuest);
router.post('/goanswer', AdminGoAnswer);
module.exports = router;
