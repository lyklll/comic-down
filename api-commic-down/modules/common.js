
let obj = {
    //精确的加法
    mathAdd: function(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    },
    //精确的减法
    mathSub: function(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    //精确的乘法
    mathMul: function(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    //精确的除法
    mathDiv: function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {}

        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);

    },
    formartDate: function(date, fmt) {
        date = new Date(date)
        var o = {
            "M+": date.getMonth() + 1, //月份   
            "d+": date.getDate(), //日   
            "h+": date.getHours(), //小时   
            "m+": date.getMinutes(), //分   
            "s+": date.getSeconds(), //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    rndNum(len) {
        let result = ""
        for (var i = 0; i < len; i++) {
            result += Math.floor(Math.random() * (len + 1))
        }
        return result
    },
    //获取客户端Ip
    getClientIp(req) {
        var ipStr = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '';

        var ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if (ipStr.split(',').length > 0) {
            ipStr = ipStr.split(',')[0]
        }
        var ip = ipReg.exec(ipStr);
        return ip ? ip[0] : ipStr
    },
    //随机字符串
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15)
    },
    // sha1加密
    sha1(str) {
        let shasum = crypto.createHash("sha1")
        shasum.update(str)
        str = shasum.digest("hex")
        return str
    },
    //md5加密
    md5(str) {
        return md5(str)
    },
    /**
     * 对参数对象进行字典排序
     * @param {对象} args 签名所需参数对象
     * @return {字符串}  排序后生成字符串
     */
    raw(args, isLower) {
        var keys = Object.keys(args)
        keys = keys.sort()
        var newArgs = {}
        keys.forEach(function(key) {
            newArgs[isLower ? key.toLowerCase() : key] = args[key]
        })
        var string = ''
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k]
        }
        string = string.substr(1)
        return string
    },
    //左补指定位数，eg:dataLeftCompleting(4, "0", 1);  // 要求4位，使用“0”补齐,结果为 0001
    dataLeftCompleting(bits, identifier, value) {
        value = Array(bits + 1).join(identifier) + value;
        return value.slice(-bits);
    }
}

module.exports = obj