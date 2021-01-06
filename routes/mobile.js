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

// ---- 모바일 연결
// ---- ID CHECK
const TestIdcheck = (req,res) =>{
  console.log('사용자 중복확인 요청');
  let body = req.body;
  let search_cat;
  let sql_str;
  search_cat = body.userID;
  console.log(body.userID);
  sql_str = "SELECT * from t5_user where id='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('아이디 중복X');
                 return res.json({
                   success: true
                 });
                   }
              else {
                console.log('아이디 중복');
                return res.json({
                  success: false
                });
              }
           });
};

const TestRegist = (req,res) =>{

  let body = req.body;
    console.log('사용자 가입 요청');

  let search_cat;
  search_cat = '좋아하는 색깔';
  db.query('INSERT INTO t5_ck_user (id, password, name, gender, birth, phone, address, hint, answer) VALUES (?,?,?,?,?,?,?,?,?)',
  [body.userID, body.userPASS, body.userNAME, body.userGENDER, body.userBIRTH, body.userPHONE, body.userADDRESS, search_cat, body.userHINT], (error, results, fields) => {
     if (error) {
       console.log('db failed');
       return res.json({
         success: false
       });
     } else {
       console.log(body.userID);
       console.log('회원가입 성공');
       return res.json({
         success: true
       });
     }
  });
};

const TestLog = (req,res) =>{
  let body = req.body;
  let sql_str;
  let search_cat, search_cat2;
  search_cat = body.userID;
  search_cat2 = body.userPASS;
  console.log('사용자 로그인 요청');
  console.log(search_cat);
  console.log(search_cat2);
  sql_str = "SELECT name from t5_user where id='"+ search_cat +"' and password='"+ search_cat2 +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('로그인 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('로그인 성공');
                  return res.json({
                    success: true,
                    username : results[0].name

                });
              }
           });
};

const TestId_Need = (req,res) =>{
  console.log('사용자 id 찾기 요청');
  let body = req.body;
  let sql_str;
  let search_cat, search_cat2;
  search_cat = body.userNAME;
  search_cat2 = body.userPHONE;
  console.log(search_cat);
  console.log(search_cat2);
  sql_str = "SELECT * from t5_user where name='"+ search_cat +"' and phone='"+ search_cat2 +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('ID 찾기 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('ID 찾기 성공');
                  return res.json({
                    success: true,
                    userid: results[0].id

                });
              }
           });
};

const TestPass_Need = (req,res) =>{
  console.log('사용자 pass 찾기 요청');
  let body = req.body;
  let sql_str;
  let search_cat, search_cat2;
  search_cat = body.userID;
  search_cat2 = body.userHINT;
  console.log('사용자 로그인 요청');
  console.log(search_cat);
  console.log(search_cat2);
  sql_str = "SELECT * from t5_user where id='"+ search_cat +"' and answer='"+ search_cat2 +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('비밀번호 찾기 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('비밀번호 찾기 성공');
                  return res.json({
                    success: true,
                    userpass : results[0].password

                });
              }
           });
};

const TestPoint = (req,res) =>{
  console.log('사용자 포인트 요청');
  let body = req.body;
  let sql_str;
  let search_cat
  search_cat = body.userID;
  console.log(search_cat);
  sql_str = "SELECT * from t5_user where id='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('포인트 찾기 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('포인트 찾기 성공');
                  return res.json({
                    success: true,
                    userpoint : results[0].point

                });
              }
           });
};
const TestDelete = (req,res) =>{
  let body = req.body;
  let search_cat, search_cat2, sql_str;
  let sql_str2;
  let udata;
  let params;
  let search_cat3;
    search_cat= body.userID;
    search_cat2= body.userPASS;

    console.log(search_cat);
    console.log(search_cat2);
    params= [search_cat, search_cat2];
    sql_str2 = "SELECT password from t5_user where id='"+ search_cat +"';";
    sql_str = 'DELETE FROM t5_user where id=? and password=?';
    db.query(sql_str2, (error, results, fields) => {
      if(error){
        console.log("select DB error");
          return res.json({
            success: false
        }); //return json
      }
      else if (results.length <= 0) {
        return res.json({
          success: false
          });
          }
          else {
              console.log(search_cat2);

            search_cat3 = results[0].password;
              console.log(search_cat3);
          }
        });
          db.query(sql_str, params, (error, results, fields) => {
            if(error) {
              console.log("delete DB error");
                return res.json({
                  success: false
              }); //return json
              console.log(search_cat2);
                console.log(search_cat3);
             }
             else{
               if(search_cat3 == search_cat2){
                 console.log("회원 탈퇴 완료");
                   return res.json({
                     success: true
                 });
               }
               else{
                 console.log("회원탈퇴 실패");
                   return res.json({
                     success: false
                 });

               }

            }

    });

};

const TestCorrection = (req,res) =>{
  console.log('사용자 수정 요청');
  let body = req.body;
  let sql_str;
  let params = [body.userPASS, body.userNAME, body.userGENDER, body.userBIRTH, body.userPHONE, body.userADDRESS, body.userHINT, body.userID]
  sql_str = sql_str = "UPDATE t5_user SET password=?, name=?, gender=?, birth=?, phone=?, address=?, answer=? where id=?;";
           db.query(sql_str, params, (error, results, fields) => {
               if (error) {
                 console.log('db failed');
                 return res.json({
                   success: false
                   });
             }
              else {
                  console.log('회원정보 수정완료');
                  return res.json({
                    success: true,
                });
              }
           });
};

const Test_PushCheck = (req,res) =>{
  console.log('사용자 Push 알림 변경 요청');
  let body = req.body;
  let sql_str;
  let search_cat
  let search_cat2
  search_cat = body.userID;
  search_cat2 = body.userSTATE;
  console.log('사용자 로그인 요청');
  console.log(search_cat);
  console.log(search_cat2);
  let params = [search_cat2, search_cat]
 sql_str = "UPDATE t5_user SET push=? where id=?;";
           db.query(sql_str, params, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('푸쉬알림 변경 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('푸쉬알림 변경 성공');
                  return res.json({
                    success: true,
                });
              }
           });
};

const FavoriteList = (req,res) =>{
  console.log('찜목록 요청');
  let body = req.body;
  console.log(body.userID);
  let sql_str;
  let search_cat;
  search_cat = body.userID;
  sql_str = "SELECT * from t5_favorite where u_id='"+search_cat+"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {

                 return res.json({
                   success: false
                   });
                }
              else {
                let snsn = results.length;
               var list =[{p_name: "메롱" , p_price: "메롱" }];
               for(var i=0;i<snsn;i++){
                 list.push({p_name:results[i].p_name, p_price:results[i].p_price});
               }
               list.shift();
                console.log(list)
                 return res.json({
                   success: true,
                   list: list
               });

              }
           });
};
const P_delete = (req,res) =>{
  let body = req.body;
  let search_cat, search_cat2, sql_str;
  let sql_str2;
  let udata;
  let params;
  let search_cat3;
    search_cat= body.userID;
    search_cat2= body.PNAME;
    console.log(search_cat);
    console.log(search_cat2);
    params= [search_cat, search_cat2];
    sql_str = 'DELETE FROM t5_favorite where u_id=? and p_name=?';
          db.query(sql_str, params, (error, results, fields) => {
            if(error) {
              console.log("delete DB error");
                return res.json({
                  success: false
              });

             }
             else{
                 console.log("찜목록삭제");
                   return res.json({
                     success: true
                 });
            }
    });
};
const Product = (req,res) =>{
  console.log('상품 정보 요청');
  let body = req.body;
  let sql_str;
  let search_cat
  search_cat = body.NAME;
  console.log(search_cat);
  sql_str = "SELECT * from t5_product where p_name='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 console.log('상품조회 실패');
                 return res.json({
                   success: false
                   });
                   }
              else {
                  console.log('상품조회 성공');
                  console.log(results[0].p_number)
                  console.log(results[0].p_kind)
                  console.log(results[0].p_company)
                  console.log(results[0].p_price)
                  console.log(results[0].p_name)
                  return res.json({
                    success : true,
                    userNUMBER : results[0].p_number,
                    userFORM : results[0].p_kind,
                    userCOMPANY : results[0].p_company,
                    userPRICE : results[0].p_price,
                    userNAME : results[0].p_name,
                    userIMAGE : results[0].p_img,
                    p_STATE : results[0].p_status,
                    Image: results[0].p_img
                });
              }
           });
};
const ProductList = (req,res) =>{
  console.log('상품 리스트 요청');
  let body = req.body;
  console.log(body.P_NAME);
  let search_cat
  search_cat = body.P_NAME;
  let sql_str;
  sql_str = "SELECT * from t5_product where p_name ='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 return res.json({
                   success: false
                   });
                   }
              else {
                 let snsn = results.length;
                var list =[{p_name: "메롱" , p_price: "메롱" }];
                for(var i=0;i<snsn;i++){
                  list.push({p_name:results[i].p_name, p_price:results[i].p_price});
                }
                list.shift();
                 console.log(list)
                  return res.json({
                    success: true,
                    list: list
                });

              }
           });
};

const CategoryList = (req,res) =>{
  console.log('카테고리 상품 요청');
  let body = req.body;
  console.log(body.P_NAME);
  let search_cat
  search_cat = body.P_NAME;
  let sql_str;
  sql_str = "SELECT * from t5_product where p_kind ='" +search_cat+ "';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 return res.json({
                   success: false
                   });
                   }
              else {
                 let snsn = results.length;
                var list =[{p_name: "메롱" , p_price: "메롱" }];
                for(var i=0;i<snsn;i++){
                  list.push({p_name:results[i].p_name, p_price:results[i].p_price});
                }
                list.shift();
                 console.log(list)
                  return res.json({
                    success: true,
                    list: list
                });

              }
           });
  };
const Favorite = (req,res) =>{
  console.log('찜하기 insert 요청');
  let body = req.body;
  let sql_str;
  db.query('INSERT INTO t5_favorite (u_id, p_number, p_name, p_kind, p_company, p_price) VALUES (?,?,?,?,?,?)',
  [body.userID, body.P_num, body.P_name, body.P_form, body.P_company, body.P_price], (error, results, fields) => {
     if (error) {
       console.log('db failed');
       return res.json({
         success: false
       });
     } else {
       console.log('찜 등록 성공');
       return res.json({
         success: true
       });
     }
  });
};
const Cost = (req,res) =>{
  console.log('입찰 가격 선택');
  let body = req.body;
  console.log(body.p_NAME);
  console.log(body.userID);
  console.log(body.userFORM);
  console.log(body.userPRICE);
  let search_cat , search_cat2
  search_cat = body.p_NAME;
  search_cat2 =body.userFORM;
  search_cat3 = body.userPRICE;
  search_cat4 = body.userID;
  let sql_str;
  let sql_str2;
  let params;
  sql_str = "SELECT * from t5_auctioninfo where p_name ='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed');
               return res.json({
                 success: false
               }); }
               else if (results.length <= 0) {
                 return res.json({
                   success: false
                   });
                   }
              else {
                    if(search_cat2=="판매자"){
                      console.log("판매자 입니다.");
                        if((results[0].sell_price ==null) || (results[0].sell_price> body.userPRICE))
                      {

                        params = [search_cat4, search_cat3, search_cat];
                        sql_str2 = "UPDATE t5_auctioninfo SET sell_id=?, sell_price=? where p_name=?;";
                        db.query(sql_str2, params, (error, results, fields) => {
                            if (error) { console.log('db update failed'); }
                           else {
                               console.log('판매자 가격 업데이트 성공');
                               return res.json({
                                 success: true
                             });
                           }
                        });
                      }
                      else{
                        console.log("실패 입니다.");
                        return res.json({
                          success: false
                          });
                        }
                      }
                      else{//구매자일경우
                        console.log("구매자 입니다.");
                        if((results[0].pur_price ==null) || (results[0].pur_price< body.userPRICE)){
                          params = [search_cat4, search_cat3, search_cat];
                          sql_str2 = "UPDATE t5_auctioninfo SET pur_id=?, pur_price=? where p_name=?;";
                          db.query(sql_str2, params, (error, results, fields) => {
                              if (error) { console.log('db update failed'); }
                             else {
                                 console.log('구매자 가격 업데이트 성공');
                                 return res.json({
                                   success: true
                               });
                             }
                          });


                        }
                        else{
                            console.log("실패 입니다.");
                          return res.json({
                            success: false
                            });
                        }
                      }
              }
           });
};

const Getcost = (req,res) =>{
  console.log('가격 로딩');
  let body = req.body;
  console.log(body.p_NAME);
  let search_cat
  search_cat = body.p_NAME;
  let sql_str;
  sql_str = "SELECT * from t5_auctioninfo where p_name ='"+ search_cat +"';";
           db.query(sql_str, (error, results, fields) => {
               if (error) { console.log('db failed'); }
               else if (results.length <= 0) {
                 return res.json({
                   success: false
                   });
                   }
              else {
                console.log(results[0].sell_price);
                  console.log(results[0].pur_price);
                  return res.json({
                    success: true,
                    sell_price:results[0].sell_price ,
                    buy_price: results[0].pur_price,
                    buyer_id: results[0].pur_id,
                    seller_id:results[0].sell_id
                }); //return json
              } // else
           }); // db.query()
};


router.post('/test_reg', TestRegist);
router.post('/test_login', TestLog);
router.post('/test_IDcheck', TestIdcheck);
router.post('/testId_Need', TestId_Need);
router.post('/testPass_Need', TestPass_Need);
router.post('/test_point', TestPoint);
router.post('/test_userdelete', TestDelete);
router.post('/test_Correction', TestCorrection);
router.post('/test_PushCheck', Test_PushCheck);
router.post('/favoriteList', FavoriteList);
router.post('/delete',P_delete);
router.post('/product',Product);
router.post('/productlist',ProductList);
router.post('/categorylist',CategoryList);
router.post('/favorite',Favorite);
router.post('/cost',Cost);
router.post('/getcost',Getcost);


module.exports = router;
