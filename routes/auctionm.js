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

// 옥션시작 할 수 있게 동작

// 상품 리스트를 가져와
// select * from t5_product  select

//  tradeinfo 테이블에 해당하는 값이 없으면  중지 있으면 진행중 출력
// 각 상품별 옥션시작 눌러(button으로 만들고 onclick으로 confirm 후 확인하기)
// 옥션시작 중지버튼 누르면 tradeinfo 에 insert 해줘
//

const PrintStandbyList = (req,res) =>{
  let htmlstream;
  let search_cat;
  let sql_str;
  search_cat = 'OFF';
  var page = req.params.page;


       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/auction_standby.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_product where p_status='"+ search_cat +"' order by p_date desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 throw error;
                 res.status(562).end("AdminPrintUser: DB query is failed"); }
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
                                                       prodata : results }));  // 조회된 상품정보


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

}

const StartAuction = (req,res) =>{
  let htmlstream;
  let search_cat, search_cat2, search_cat3;
  let sql_str;
  let sql_str2;
  search_cat2 = 'ON';
  search_cat = req.query.id;
  let actime = 200;
  var auction_id = search_cat;



       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "SELECT * from t5_product where p_number='"+ search_cat +"';"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 throw error;
                 res.status(562).end("AdminPrintUser: DB query is failed"); }
              else {
                search_cat3 = results[0].p_name
                db.query('INSERT INTO t5_auctioninfo(p_name) values(?)', [search_cat3], (error, results, fields) => {
                  if(error){
                    throw error;}
                    else{
                      sql_str2 = "UPDATE t5_product SET p_status='"+ search_cat2 +"' where p_number='"+ search_cat +"';";
                      db.query(sql_str2, (error, results, fields) =>{
                        if(error){
                          throw error;
                        }
                        else{
                          htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                          res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                             'warn_message':'경매 시작!',
                                            'return_url':'/auctionm/standbylist/1'}));
                        }
                      });

                    }
                });
                       // 조회된 상품정보
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

}

const PrintStartList = (req,res) =>{
  let htmlstream;
  let search_cat;
  let sql_str;
  let sql_str2;
  search_cat = 'ON';
  var page = req.params.page;


       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/atstartview.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_auctioninfo order by p_name desc;";
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

                db.query(sql_str, (error, results, fields) => {
                  if(error){
                    throw error;
                  }else

                    res.end(ejs.render(htmlstream,  {'title' : '쇼핑몰site',
                                                      'logurl': '/logout',
                                                      'loglabel': 'Logout',
                                                      'regurl': '/admodified',
                                                      'reglabel':req.session.who,
                                                      length : results.length-1,
                                                      page : page,
                                                      previous : Number(page)-1,
                                                      next : Number(page)+1,
                                                      page_num : 10,
                                                      aucdata : results }));
              });  // 조회된 상품이 있다면, 상품리스트를 출력
                      // 조회된 상품정보


  // else
// db.query()
       }
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

}

const StopAuction = (req,res) =>{
  let htmlstream;
  let search_cat, search_cat2;
  let sql_str;
  let sql_str2;
  search_cat2 = 'OFF';
  search_cat = req.query.id;
  let regdate = new Date();


       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "SELECT * from t5_product where p_name='"+ search_cat +"';"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 throw error;
                 res.status(562).end("AdminPrintUser: DB query is failed"); }
              else {
                db.query('Delete from t5_auctioninfo where p_name=?', [search_cat], (error, results, fields) => {
                  if(error){
                    throw error;}
                    else{
                      sql_str2 = "UPDATE t5_product SET p_status='"+ search_cat2 +"' where p_name='"+ search_cat +"';";

                      db.query(sql_str2, (error, results, fields) =>{
                        if(error){
                          throw error;
                        }
                        else{
                          htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                          res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                             'warn_message':'경매 중지!',
                                            'return_url':'/auctionm/atstartlist/1'}));
                        }
                      });

                    }
                });// delete db
                       // 조회된 상품정보
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

}

const FinishAuction = (req,res) =>{
  let htmlstream;
  let search_cat, search_cat2;
  let sql_str;
  let sql_str2;
  search_cat2 = 'OFF';
  search_cat = req.query.id;
  let regdate = new Date();


       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "SELECT * from t5_auctioninfo where p_name='"+ search_cat +"';"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 throw error;
                 res.status(562).end("AdminPrintUser: DB query is failed"); }
              else {
                result = results[0];
                db.query('INSERT into t5_result(pur_id, sell_id, p_name, p_price, date) values(?,?,?,?,?)', [result.pur_id, result.sell_id, result.p_name, result.pur_price, regdate], (error, results, fields) => {
                  if(error){
                    throw error;
                  }
                  else{
                    db.query('Delete from t5_auctioninfo where p_name=?', [search_cat], (error, results, fields) => {
                      if(error){
                        throw error;}
                        else{
                          sql_str2 = "UPDATE t5_product SET p_status='"+ search_cat2 +"' where p_name='"+ search_cat +"';";

                          db.query(sql_str2, (error, results, fields) =>{
                            if(error){
                              throw error;
                            }
                            else{
                              htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                              res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                                 'warn_message':'경매가 종료되었습니다!',
                                                'return_url':'/auctionm/atstartlist/1'}));
                            }
                          });

                        }
                    });// delete db query
                  }

                });

                       // 조회된 상품정보
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

}

router.get('/finaution', FinishAuction);
router.get('/atstart', StartAuction);
router.get('/standbylist/:page', PrintStandbyList);
router.get('/atstartlist/:page', PrintStartList);
router.get('/atstop', StopAuction);
module.exports = router;
