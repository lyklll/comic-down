var accessLogfile = require('./logger');
var common = require('./common')
var routerHandler = function(fn) {
    return async function(req, res, next) {
        let startTime = new Date()
        let result = null
        let errTrack = ""
        let curConn = null
     
        try {
            result = await fn(req.body)
        } catch (ex) {
            result = {
                issuccess: false,
                data: ex.message
            }
            errTrack = ex.stack
        } finally {
            if (curConn) {
                curConn.release();
            }
        }
        res.send(result)
        await accessLogfile.customWriteLog({
            apiType: "SYS",
            startTime: startTime,
            endTime: new Date(),
            apUri: req.originalUrl,
            requestData: req.body,
            resposeData: result,
            errorData: errTrack,
            ip: common.getClientIp(req)
        })
    }
}
routerHandler.createRespose = function(data = "", issuccess = true) {
    return {
        issuccess: issuccess,
        data: data
    }
}

module.exports = routerHandler