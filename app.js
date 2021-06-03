'use strict'

// C library API will we be using C idk
//const ffi = require('ffi-napi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
/*const fileUpload = require('express-fileupload');
const uploadPath = './uploads';
const xsdPath = './parser/gpx.xsd';
const uploadPath2 = './uploads/';
const forTesting = './uploads/simple.gpx';
const forTesting2 = './uploads/simple2.gpx';
app.use(fileUpload());
app.use(express.static(path.join(__dirname+'/uploads')));*/

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


/*testy = JSON.parse(testy);
console.log(testy);*/
app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
