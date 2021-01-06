const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const upload = multer({dest: __dirname + '/../public/images/uploads/products'});  // 업로드 디렉터리를 설정한다.
const   router = express.Router();

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

//  -----------------------------------  회원리스트 기능 -----------------------------------------
// (관리자용) 등록된 회원리스트를 브라우져로 출력합니다.
const AdminPrintUser = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/usermanage.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_user order by name desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintUser: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
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
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//-------------------------------------  가입승인처리 -----------------------------------------

const AdminPrintCkUser = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/ck_usermanage.ejs','utf8'); // 가입승인대기 유저 정보
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_ck_user order by name desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintCkUser: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'가입 승인대기 회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
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

const AdminPer = (req, res) =>{
  let    htmlstream = '';
  let    sql_str, search_cat, udata, params;

  console.log('select문 실행');
  console.log(req.query.id);
       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.query.id;
           sql_str = "SELECT * FROM t5_ck_user where id='"+ search_cat +"';";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {
             if (error) {
               throw error;
               htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_title':'DB설정 오류',
                                  'warn_message':'다시 시도해주세요',
                                  'return_url':'/mainui' }));
             } else{
               udata = results[0];
               console.log('ck_user select는 성공');
               console.log(udata.id);
               db.query('INSERT INTO t5_user (id, password, name, gender, birth, phone, address, hint, answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                     [udata.id, udata.password, udata.name, udata.gender, udata.birth, udata.phone, udata.address, udata.hint, udata.answer], (error, results, fields) => {
                if (error) {
                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_title':'가입승인 오류',
                                  'warn_message':'가입승인 오류',
                                  'return_url':'/mainui' }));
                 } else {
                   sql_str = 'DELETE FROM t5_ck_user where id=?';
                   params = [udata.id];

                   db.query(sql_str, params, (error, results, fields) =>{

                     if(error){
                       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                       res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'삭제 오류',
                                     'warn_message':'삭제 오류',
                                     'return_url':'/mainui' }));
                     }
                     else{
                       console.log("가입승인 요청이 성공하였습니다!");
                       htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                       res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_message':'가입승인에 성공했습니다',
                                     'return_url':'/users/ck_list/1' }));

                     }
                   });

                 }
            });
            }


       });
      }
      else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
        htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
        res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                           'warn_title':'세션오류',
                           'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                           'return_url':'/' }));
      }
};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/ck_list/:page', AdminPrintCkUser);
router.get('/ck_listform', AdminPer);
router.get('/list/:page', AdminPrintUser);      // 회원리스트를 화면에 출력
// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

//----------------------- 회원정보 수정 ----------------------

const AdminModifiedUserForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.query.id;

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/userinf_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_user where id='"+ search_cat +"';";

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
                                               'userid' : search_cat,
                                                user : results }));
                                                 // 조회된 상품정보
             }


       });
       }
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const AdminModifiedUser = (req, res) => {
let body = req.body;
let htmlstream='';
let search_cat, addr, addr1, addr2, addr3;

    console.log(req.query.id);
      // 임시로 확인하기 위해 콘솔에 출력해봅니다.

    console.log('정보수정');

    if (body.urating == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('"+ <meta charset="utf-8">+ " 데이터가 입력되지 않아 수정을 할 수 없습니다');
    }
    else {
      search_cat=req.query.id;
      addr1 = body.addr1;
      addr2 = body.addr2;
      addr3 = body.addr3;
      addr = addr1 + addr2 + addr3;
      let params = [body.uname, body.ugender, body.ubirth, body.uphone , addr, body.urating, search_cat];
       db.query("UPDATE t5_user SET name=?, gender=?, birth=?, phone=?, address=?, rating=? where id=?;", params , (error, results, fields) => {
          if (error) {
            htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
            res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                               'warn_title':'회원정보 수정 오류',
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

router.get('/modified', AdminModifiedUserForm);
router.post('/modified', AdminModifiedUser);

// --------------------------------------------------- 회원정보 삭제 -----------------------
const AdminBanUser = (req, res) => {

  let htmlstream = '';
  let search_cat, sql_str;
  let udata;
  let params;

  console.log('select문 실행');
  console.log(req.query.id);
       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.query.id;
           sql_str = "SELECT * FROM t5_user where id='"+ search_cat +"';";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {
             if (error) {
               htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_title':'DB설정 오류',
                                  'warn_message':'다시 시도해주세요',
                                  'return_url':'/mainui' }));
             } else{
               udata = results[0];
               console.log('ck_user select는 성공');
               console.log(udata.id);
               db.query('INSERT INTO t5_ban (b_id, b_name, b_phone, b_address) VALUES (?, ?, ?, ?)',
                     [udata.id, udata.name, udata.phone, udata.address], (error, results, fields) => {
                if (error) {
                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_title':'삭제db 입력 오류',
                                  'warn_message':'삭제db 입력 오류',
                                  'return_url':'/mainui' }));
                 } else {
                   sql_str = 'DELETE FROM t5_user where id=?';
                   params = [udata.id];

                   db.query(sql_str, params, (error, results, fields) =>{

                     if(error){
                       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                       res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'삭제 오류',
                                     'warn_message':'삭제 오류',
                                     'return_url':'/mainui' }));
                     }
                     else{
                       console.log("회원 제명에 성공했습니다!");
                       htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                       res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_message':'회원 삭제에 성공했습니다',
                                     'return_url':'/mainui' }));

                     }
                   });

                 }
            });
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

const PrintBanUser = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/ban_usermanage.ejs','utf8'); // 가입승인대기 유저 정보
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_ban order by b_name desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("PrintBanUser: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'제명회원 조회 오류',
                                      'warn_message':'조회된 제명회원이 없습니다.',
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

router.get('/banusers/:page', PrintBanUser);
router.get('/banact', AdminBanUser);

module.exports = router;
