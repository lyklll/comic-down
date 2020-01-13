var accessLogfile = require('./logger');
var config = require('./config')
var mkdirp = require('mkdirp')
var axios = require('axios')
var fs = require('fs');
class httpMothods {
    async asyncPostErp(commonName, request, withoutToken) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let base_url = ""
        let oldTime = new Date()
        try {
            let settings = await this.getBussinessSettings(request.bussinessId)
            base_url = settings.erp.apiServiceUrl + commonName
            if (!withoutToken) {
                request = request || {}
                if (!settings.erp.token) {
                    request.Token = await this.createErpToken(settings, request.bussinessId)
                } else {
                    request.Token = settings.erp.token
                }
            }
            result = await axios.post(base_url, request);
            //result = res.data
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "ERP",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })

        if (errTrack) {
            return {
                issuccess: false,
                data: errMsg
            };
        } else {
            return result.data
        }
    }

    //魔力娃
    async asyncPostMlw(commonName, request) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let base_url = ""
        let oldTime = new Date()
        try {
            let settings = await this.getBussinessSettings(request.bussinessId)
            base_url = settings.erp.mlwServiceUrl + commonName

            request = request || {}
            request.auth_code = settings.erp.mlwCode
            request.authCode = settings.erp.mlwCode
            result = await axios.post(base_url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "ERP",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })
        if (errTrack) {
            return {
                issuccess: false,
                data: errMsg
            };
        } else {
            return result.data
        }
    }

    //营销系统
    async asyncPostGroup(commonName, request) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let base_url = ""
        let oldTime = new Date()
        try {
            let settings = await this.getBussinessSettings(request.bussinessId)
            base_url = settings.erp.groupServiceUrl + commonName
            request = request || {}
            request.authCode = settings.erp.groupServiceToken
            result = await axios.post(base_url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "GROUP",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })
        if (errTrack) {
            return {
                issuccess: false,
                data: errMsg
            };
        } else {
            if (result.data.code == 0) {
                return {
                    issuccess: true,
                    data: result.data.data || result.data
                }
            } else {
                return {
                    issuccess: false,
                    data: result.data.msg
                }
            }
        }
    }


    //开放平台
    async asyncPostOldErp(commonName, request, withAppid) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let base_url = ""
        let oldTime = new Date()

        try {
            let settings = await this.getBussinessSettings(request.bussinessId)
            base_url = settings.erp.apiOldServiceUrl + commonName
            request = request || {}
            //request.Token = settings.erp.oldToken
            if (withAppid) {
                request.appid = settings.erp.apiOldAppId
                request.timestamp = common.formartDate(new Date(), "yyyy-MM-dd hh:mm:ss")
                let signSource = `appid=${request.appid}&timestamp=${request.timestamp}&token=${settings.erp.oldToken}`
                let shasum = crypto.createHash("md5")
                request.sign = shasum.update(signSource).digest("hex")
            }
            result = await axios.post(base_url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "OERP",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })
        return {
            issuccess: !Boolean(errTrack),
            data: errTrack ? errMsg : result.data
        }

    }

    //开车
    async asyncPostJtc(commonName, request, withoutToken) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let base_url = ""
        let oldTime = new Date()
        try {

            let settings = await this.getBussinessSettings(request.bussinessId)
            base_url = settings.erp.jtcServiceUrl + commonName
            request = request || {}
            result = await axios.post(base_url, request);

            let newTime = Number(new Date())
        } catch (err) {

            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "JTC",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })

        if (errTrack) {
            return {
                issuccess: false,
                data: errMsg
            };
        } else {
            return result.data
        }
    }

    //微信
    async asyncPostWechat(url, request) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        try {
            result = await axios.post(url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "WECA",
            startTime: oldTime,
            endTime: new Date(),
            apUri: url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? errMsg : "",
            data: result.data
        };
    }
    //收钱吧支付
    async asyncPostShowQianBa(url, request, sn, sign) {
        let baseUrl = 'https://api.shouqianba.com/'
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        try {
            result = await axios.post(baseUrl + url, request, {
                headers: { Authorization: sn + " " + sign }
            });
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "SQB",
            startTime: oldTime,
            endTime: new Date(),
            apUri: url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack,
            otherData: {
                sign: sign
            }
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? errMsg : "",
            data: result.data
        };
    }

    //扫呗支付
    async asyncPostSaobei(url, request, beforeSign, afterSign) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        let sign = {
            before: beforeSign,
            after: afterSign
        }
        try {
            result = await axios.post(url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "SAOB",
            startTime: oldTime,
            endTime: new Date(),
            apUri: url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack,
            otherData: {
                sign: sign
            }
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? errMsg : "",
            data: result.data
        };
    }
    async asyncGet(base_url, request) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        try {
            result = await axios.get(base_url, request);
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "WGET",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            resposeData: result ? result.data : "",
            errorData: errTrack
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? message : "",
            data: result.data
        };
    }
    async asyncPostCommon(url, request, responseType) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        try {
            result = await axios.post(url, request, {
                responseType: responseType
            });
        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "POST",
            startTime: oldTime,
            endTime: new Date(),
            apUri: url,
            requestData: request,
            resposeData: result.data || "",
            errorData: errTrack
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? errMsg : "",
            data: result.data
        };
    }
    asyncPostByCert(url, mch_id, request) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        return new Promise((su, rj) => {
            requester({
                url: url,
                method: 'POST',
                body: request,
                agentOptions: {
                    pfx: fs.readFileSync(__dirname + '/' + mch_id + '.p12'),
                    passphrase: mch_id
                }
            }, async function(err, response, body) {
                await accessLogfile.customWriteLog({
                    apiType: "WCGET",
                    startTime: oldTime,
                    endTime: new Date(),
                    apUri: url,
                    requestData: request,
                    resposeData: body || "",
                    errorData: err.stack || "",
                    otherData: {
                        mch_id: mch_id
                    },
                })

                if (!err && response.statusCode == 200) {
                    su(body)
                } else {
                    rj({ err, response, body })
                }
            })
        })

    }
    async asyncGetByResponseType(base_url, request, responseType) {
        let errTrack = ""
        let errMsg = ""
        let result = null
        let oldTime = new Date()
        try {
            result = await axios.get(base_url, {
                params: request,
                responseType: responseType,
                encoding: null
            });

        } catch (err) {
            errTrack = err.stack
            errMsg = err.message
        }
        await accessLogfile.customWriteLog({
            apiType: "WCGET",
            startTime: oldTime,
            endTime: new Date(),
            apUri: base_url,
            requestData: request,
            //resposeData: result || "",
            errorData: errTrack || ""
        })

        return {
            issuccess: !Boolean(errTrack),
            msg: errTrack ? message : "",
            data: result.data
        };
    }
    async getBussinessSettings(bussinessId) {
        let result = await execDb(db => {
            return db.collection("bussinessSettings").findOne({
                "bussinessId": bussinessId
            })
        })
        return result
    }
    async createErpToken(wxConfig, bussinessId) {
        let request = {
            TerminalGUID: wxConfig.erp.terminalGUID,
            LoginBusinessGUID: bussinessId,
            LoginName: wxConfig.erp.loginName,
            LoginPassword: wxConfig.erp.loginPassword,
            bussinessId: bussinessId
        }
        let erpResult = await this.asyncPostErp('Terminal/Login', request, true)
        if (erpResult.issuccess) {
            await execDb(db => {
                return db.collection("bussinessSettings").updateOne({
                    bussinessId: bussinessId
                }, {
                    $set: {
                        "erp.token": erpResult.data.Token
                    }
                })
            })

        }
        return erpResult.data.Token
    }
    /*
        将BASE64编码文件保存到本地，并返回保存到数据库表uploadFile的信息
    */
    async saveImg(bussinessId, imgData, fileName, uploader) {
        let exNameIdx = fileName.lastIndexOf(".")
        let exName = fileName.substring(exNameIdx + 1)
        let id = uuidv1()
        let xdPath = `files/${bussinessId}/${common.formartDate(new Date(),"yyyy-MM-dd")}/`
        let localPath = fs.readdirSync(__dirname)
        // linux
        //let savePath = `/home/jam/01.works/my_factory/Erp-Manager/${xdPath}`

        //win
        let savePath = `${config.FilePath}${xdPath}`
        let checkExits = await new Promise((su, er) => {
            fs.exists(savePath, function(exists) {
                su(exists)
            })
        })

        if (!checkExits) {
            await new Promise(su => {
                mkdirp(savePath, function(err) {
                    su(err)
                })
            })
        }

        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = Buffer.from(base64Data, 'base64');
        let result = await new Promise((su, er) => {
            fs.writeFile(`${savePath}${id}.${exName}`, dataBuffer, async err => {
                if (err) {
                    er(err);
                } else {
                    //保存完成，提交到数据库
                    let dbResult = await execDb(db => {
                        return db.collection("uploadFile").insertOne({
                            oldFileName: fileName,
                            newFileName: `${id}.${exName}`,
                            xdPath: xdPath,
                            filePath: savePath,
                            exName: exName,
                            createTime: new Date(),
                            creator: uploader
                        })
                    })
                    debugger
                    su(dbResult.ops)
                }
            });
        })
        return result

    }

}



module.exports = new httpMothods()