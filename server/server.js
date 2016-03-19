var express = require('express');
var path = require ('path');
var bodyParser = require('body-parser');
var pg = require('pg');
//add routes to modules here
var todo = require('./routes/todo');

var app = express();

var port = process.env.PORT || 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true} ));

// add additional app.use here for routing/modules-->done
app.use('/todo', todo);

// get/post/put calls here

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/choresDB';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('error connecting to db', err);
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS chores (' + 'id SERIAL PRIMARY KEY, ' +
                                                                'chore varchar(80) NOT NULL, ' +
                                                                'complete boolean);'
  );

  query.on('end', function () {
    console.log('successfully ensured schema exists');
    done();
  });

  query.on('error', function (error) {
    console.log('error making schema', error);
    done();
  });
}
});

app.get('/*', function(req,res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename));
});

app.listen(port, function(){
  console.log('listening for requests on port: ' , port);
});
