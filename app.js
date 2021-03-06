'use strict'

const express = require("express");
const app     = express();
const path    = require("path");
const axios = require("axios");


// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const portNum = process.env.PORT || 5000;

//sends html page
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

//sends css styles
app.get('/style.css',function(req,res){
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

//sends front end js
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});



//gets the JSON object from the website at the given comic page and returns it to the front end
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

//gets the JSON object from the latest page
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



app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
