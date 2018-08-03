var express = require('express');
// npm express-validator
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
// npm mongojs
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 設定靜態路徑 Set Static Path
app.use(express.static(path.join(__dirname, 'public')));
// 全域變數 Global Var
app.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});

// Express Validator Middleware
// npm express-validator 空值驗證
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    ,root = namespace.shift()
    ,formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// 首頁顯示
app.get('/', function(req, res) {
  db.users.find(function (err, docs) {
    res.render('index',{
      title: '會員清單',
      users: docs
    });
  })
});

// 新增會員
app.post('/users/add', function(req, res){

  req.checkBody('name', '名字不能是空值').notEmpty();
  req.checkBody('email', '電子信箱不能是空值').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('index',{
      title: '會員清單',
      users: users,
      errors: errors
    });
    console.log('驗證錯誤');
  }else{
    var newUser = {
      name: req.body.name,
      email: req.body.email
    }
    db.users.insert(newUser, function (err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  }
});

// 刪除會員
app.delete('/users/delete/:id', function (req, res) {
  db.users.remove({_id: ObjectId(req.params.id)},function (err, result) {
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
  console.log(req.params.id);
});

// 埠號3000監聽
app.listen(3000, function(){
  console.log('Port 3000 已連線 ');
});
// 資料庫 db.users.insert([{name:'Johne',email:'werwer@sdfsdf.com.tw'},{name:'Aiienl',email:'xwfkjin@yahppcom.tw'}])