var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Post = require('./models/post');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
mongoose.connect("mongodb+srv://Admin:ufn8xxs9R1dIPD9i@cluster0-mt9pz.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed');
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader(
      'Access-Control-Allow-Origin', '*'
  );
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
      title: req.body.title,
      content: req.body.content
  });
  post.save().then( result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
      .then(documents => {
        console.log(documents);
        res.status(200).json({
          message: 'Post fetched succesfully',
          posts: documents
        });
      });
});

app.get('/api/posts/:id', (req, res, next) => {
   Post.findById(req.params.id).then(post => {
    if (post){
        res.status(200).json(post);
    } else {
        res.status(404).json({message: 'Post not found!'});
    }
   });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
      .then(result => {
        res.status(200).json({ message: 'Successful update!'})
      });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log('Hello\t' + req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post Deleted!'});
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
