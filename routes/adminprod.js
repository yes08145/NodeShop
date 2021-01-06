const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const upload = multer({dest: __dirname + '/../public/images/uploads/products'});  // 업로드 디렉터리를 설정한다.
const   router = express.Router();
var url = require('url').URL;

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

//  -----------------------------------  상품리스트 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const AdminPrintProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminproduct.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_product order by p_date desc"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/mainui' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/logout',
                                                       'loglabel': 'Logout',
                                                       'regurl': '/admodified',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                       prodata : results }));  // 조회된 상품정보
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
}

//  -----------------------------------  상품등록기능 -----------------------------------------
// 상품등록 입력양식을 브라우져로 출력합니다.
const PrintAddProductForm = (req, res) => {
  let    htmlstream = '';

       if (req.session.auth) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product_form.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                           'regurl': '/users/profile',
                                           'reglabel': req.session.who }));
       }
       else {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'세션오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

// 상품등록 양식에서 입력된 상품정보를 신규로 등록(DB에 저장)합니다.
const HanldleAddProduct = (req, res) => {  // 상품등록
  let    body = req.body;
  let    htmlstream = '';
  let    datestr, y, m, d, regdate;
  let    prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
  let    picfile = req.file;
  let    results = { originalname  : picfile.originalname,
                   size : picfile.size     };
                   console.log(body.p_kind);
       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth) {

              prodimage = prodimage + picfile.filename;
              regdate = new Date();
              db.query('INSERT INTO t5_product (p_number, p_kind, p_company, p_name, p_date, p_price, p_img ,ad_use) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.p_number, body.p_kind, body.p_company, body.p_name, regdate,
                      body.p_price, prodimage, body.ad_use], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상품등록 오류',
                                 'warn_message':'상품으로 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/mainui' }));
                } else {
                  htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
                  res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_message':'상품 등록 완료!',
                                    'return_url':'/adminprod/list/1'}));
                   console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
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
router.get('/addform', PrintAddProductForm);   // 상품등록화면을 출력처리
router.post('/addproduct', upload.single('photo'), HanldleAddProduct);  // 상품등록내용을 DB에 저장처리
router.get('/list/:page', AdminPrintProd);
   // 상품리스트를 화면에 출력
// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

// ----------------------------------- 상품 수정 삭제 --------------------------------------
const ProductEditForm = (req,res) =>{
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
          console.log(req.query.id);
           search_cat= req.query.id;

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/proedit_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from t5_product where p_number='"+ search_cat +"';";

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
                                                prodata : results }));
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

const ProductEdit = (req,res) =>{
  let    body = req.body;
  let    htmlstream = '';
  let    sql_str, search_cat;
  let    datestr, y, m, d, regdate;
  let    prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
  let    picfile = req.file;
  let    results = { originalName  : picfile.originalname,
                   size : picfile.size     };

       if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
           search_cat= req.query.p_number;
           prodimage = prodimage + picfile.filename;
           regdate = new Date();
           let params = [body.p_kind, body.p_name, body.p_price, body.p_date, body.p_company , body.ad_use, prodimage, regdate];
           sql_str = "UPDATE t5_product SET p_kind=?, p_name=?, p_price=?, p_date=?, p_company=?, ad_use=?, p_img=?, p_date=? where p_number='"+ search_cat +"';";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, params, (error, results, fields) => {
             if (error) {
               throw error;
               console.log('db error');
               htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_title':'DB설정 오류',
                                  'warn_message':'다시 시도해주세요',
                                  'return_url':'/mainui' }));
             } else {
               console.log('상품정보 수정 완료');
               htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
               res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                                  'warn_message':'상품정보 수정 완료!',
                                 'return_url':'/adminprod/list/1'}));
              console.log("DB에 "+ search_cat +" 의 정보를 수정하였습니다.!");

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

const ProductDelete = (req,res) =>{

    let htmlstream = '';
    let search_cat, sql_str;
    let udata;
    let params;
  if (req.session.auth)   {  // 관리자로 로그인된 경우에만 처리한다
      search_cat= req.query.id;
      console.log(search_cat);
      sql_str = 'DELETE FROM t5_product where p_number=?';
      params = [search_cat];
      db.query(sql_str, params, (error, results, fields) =>{

        if(error){
          htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
          res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                        'warn_title':'삭제 오류',
                        'warn_message':'삭제 오류',
                        'return_url':'/mainui' }));
        }
        else{
          console.log("상품 삭제에 성공했습니다.!");
          htmlstream = fs.readFileSync(__dirname + '/../views/js_alert.ejs','utf8');
          res.status(200).end(ejs.render(htmlstream, { 'title': '알리미',
                        'warn_message':'상품 삭제에 성공했습니다',
                        'return_url':'/adminprod/list/1' }));

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

router.get('/promodified', ProductEditForm);
router.get('/prodelete', ProductDelete);
router.post('/promodified', upload.single('photo'), ProductEdit);
module.exports = router;
