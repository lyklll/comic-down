var express = require('express');
//var router = express.Router();
var fs = require('fs');

let result=[]

//读取本路径下的js，并加载
let files = fs.readdirSync(__dirname)
files.forEach(x => {
	if (x != "main.js" && x.indexOf('.js') >= 0) {
		var tmp = require(`./${x}`)
		result.push(tmp)
	}
})

module.exports = result;