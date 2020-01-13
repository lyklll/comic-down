//日志存放
var path = require('path');
var fs = require('fs');
var fileStreamRotator = require('file-stream-rotator')
var config = require("./config.js")
// var execDb = require("./mongodb.js")
var common = require('./common')
var logDirectory = config.logDir || path.join("./", 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogfile = fileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})
accessLogfile.customWriteLog=async (options)=>{
    options = options || {}
    options.startTime = options.startTime || new Date()
    options.endTime = options.endTime || new Date()
    options.apUri = options.apUri || ""
    options.requestData = options.requestData || ""
    options.resposeData = options.resposeData || ""
    options.errorData = options.errorData || ""
    options.apiType = options.apiType || "SYS"
    options.ip = options.ip || ""

    accessLogfile.write(
        `[${common.formartDate(options.startTime, 'yyyy-MM-dd hh:mm:ss:S')}] [${options.apiType}] ${options.apUri} 
[耗时] ${Number(options.endTime)-Number(options.startTime)}毫秒
[请求参数] ${JSON.stringify(options.requestData)}
[响应结果] ${JSON.stringify(options.resposeData)}
[异常信息] ${options.errorData} 

`)
    // await execDb(db => {
    //     return db.collection("execLogs").insertOne({
    //         apiType: options.apiType,
    //         ip: options.ip,
    //         requestUrl: options.apUri,
    //         spanTime: Number(options.endTime)-Number(options.startTime),
    //         requestParams: options.requestData,
    //         resposeResult: options.resposeData,
    //         exceptionStr: options.errorData,
    //         otherData:options.otherData,
    //         createDate: options.startTime
    //     })
    // })


}
module.exports = accessLogfile;