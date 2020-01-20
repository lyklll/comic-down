var express = require('express');
var router = express.Router();
var routerMethod = require("../modules/routerMethods.js")
var httpMothods = require("../modules/httpMethods.js")
var config=require("../modules/config")
var a=false
router.post("/test/command", routerMethod(async (body, db, options) => {
	console.log(body.idx+"：开始")
	
		await delay(200000)
	console.log(body.idx+"：完成")

    return routerMethod.createRespose("成功")
}))

var delay=(time)=>{
	return new Promise(s=>{
		setTimeout(()=>{
			s()
		},time)
	})
}

module.exports = router