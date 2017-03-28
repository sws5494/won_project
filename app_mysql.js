var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: _storage
});
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'o2'
});
conn.connect();
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.get('/upload', function(req, res) {
    res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res) {
    console.log(req.file);
    res.send('Uploaded: ' + req.file.filename);
});
app.get('/topic/add', function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, topics, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        res.render('add', {
            topics: topics
        });
    });
});
app.post('/topic/add', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, result, fields) {
        console.log(result);
        if (err) {
            res.status(500).send('Server Error');
        } else {
            res.redirect('/topic/' + result.insertId);
        }
    });
});
app.get(['/topic/:id/edit'], function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, topics, fields) {
        var id = req.params.id;
        if (id) {
            var sql = 'select * from topic where id=?';
            conn.query(sql, [id], function(err, topic, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Server Error');
                } else {
                    res.render('edit', {
                        topics: topics,
                        topic: topic[0]
                    });
                }
            });
        } else {
            console.log('no id');
            res.status(500).send('Server Error');
        }
    });
});
app.post(['/topic/:id/edit'], function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    console.log(req.params.title);
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    conn.query(sql, [title, description, author, id], function(err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/topic/'+id);
        }
    });
});
app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT id, title FROM topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic){
      if(err){
        console.log(err);
        res.status(500).send('Internal Error');
      }else{
        if(topic.length === 0){
          console.log('There is no record');
          res.status(500).send('Internal Error');
        }else{
          res.render('delete', {topics:topics, topic:topic[0]});
        }
      }
    });
  });
});
app.post('/topic/:id/delete', function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result){
      res.redirect('/topic/');
  });
});
app.get(['/topic', '/topic/:id'], function(req, res) {
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, topics, fields) {
        var id = req.params.id;
        if (id) {
            var sql = 'select * from topic where id=?';
            conn.query(sql, [id], function(err, topic, fields) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('view', {
                        topics: topics,
                        topic: topic[0]
                    });
                }
            });
        } else {
            res.render('view', {
                topics: topics
            });
        }
    });
    // fs.readdir('data', function(err, files){
    //   if(err){
    //     console.log(err);
    //     res.status(500).send('Server Error');
    //   }
    //   var id = req.params.id;
    //   if(id){
    //     //id값이 있을 때
    //     fs.readFile('data/'+id, 'utf8', function(err, data){
    //       if(err){
    //         console.log(err);
    //         res.status(500).send('Server Error');
    //       }
    //       res.render('view', {topics:files, title:id, description:data});
    //     });
    //   }else{
    //     //id값이 없을 때
    //       res.render('view', {topics:files, title:'Welcome', description:'hello javascript'});
    //   }
    // });
});
/*app.get('/topic/:id', function(req, res){
  var id = req.params.id;
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Server Error');
    }
    fs.readFile('data/'+id, 'utf8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Server Error');
      }
      res.render('view', {topics:files, title:id, description:data});
    });
  });
});*/
/*app.post('/topic', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/' + title, description, function(err) {
        if (err) {
            res.status(500).send('Server Error');
        }
        res.redirect('/topic/' + title);
    });
});*/
app.listen(3000, function() {
    console.log('Connected 3000 port!');
});
