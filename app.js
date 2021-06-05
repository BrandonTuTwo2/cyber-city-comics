'use strict'


// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const axios = require("axios");


// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.env.PORT || 1234;



// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});



//returns the JSON object from the url
app.get('/nextPage', function(req,res){
  let nextPage = req.query.page;
  let url = 'http://xkcd.com/';
  let comicJSON = {};

  axios.get(url + nextPage + '/info.0.json')
    .then(result =>{
      comicJSON = result.data;
      console.log(comicJSON);
      res.send(comicJSON);
    })
    .catch(error => {
      console.log(error);
      res.send({error});
    })
});


app.get('/latestPage', function(req,res){
  let nextPage = req.query.page;
  let url = 'http://xkcd.com/info.0.json';
  let comicJSON = {};

  axios.get(url)
    .then(result =>{
      comicJSON = result.data;
      console.log(comicJSON);
      res.send(comicJSON);
    })
    .catch(error => {
      console.log(error);
      res.send({error});
    })
});


/*testy = JSON.parse(testy);
console.log(testy);*/
app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
