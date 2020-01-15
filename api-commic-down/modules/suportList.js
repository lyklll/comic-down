var base64_decode = (data) => {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = "",
        tmp_arr = [];
    if (!data) { return data; }
    data += '';
    do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);
    dec = tmp_arr.join('');
    dec = utf8_decode(dec);
    return dec;
}
var utf8_decode = (str_data) => {
    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;
    str_data += '';
    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return tmp_arr.join('');
}
let obj = [{
    name: "tutumanhua",
    title: "兔兔漫画",
    domain: "https://www.tutumanhua.com/",
    search: {
        method: "Get",
        searchUrl: "https://www.tutumanhua.com/statics/search.aspx?key={$key}&button=%E6%90%9C%E7%B4%A2",
        pager: {
            key: "page"
        },
        filter: {
            parentPath: ".cy_list_mh ul",
            childs: [{
                key: "url",
                path: "a.pic",
                attr: "href"
            }, {
                key: "title",
                path: ".title"
            }, {
                key: "status",
                path: ".zuozhe"
            }, {
                key: "info",
                path: ".info"
            }]
        }
    },
    //获取单个漫画的章节概况
    one: {
        method: "Get",
        searchUrl: "https://www.tutumanhua.com/{$key}",
        filter: {
            imgPath: ".pic",
            parentPath: "#mh-chapter-list-ol-0 li",
            childs: [{
                key: "url",
                path: "a",
                attr: "href"
            }, {
                key: "title",
                path: "a p",
            }]
        }
    },
    single: async (url, httpMothods) => {
        //获取base64
        let getUrl = `https://www.tutumanhua.com/${url}`
        let result = await httpMothods.asyncGet(getUrl)
        if (!result.issuccess) {
            return []
        }

        let startStr = "qTcms_S_m_murl_e=\""
        let startIdx = result.data.indexOf(startStr)
        let tmp = result.data.substr(startIdx + startStr.length)
        let endIdx = tmp.indexOf(";")
        let base64 = tmp.substr(0, endIdx - 1)
        let imgsCode = base64_decode(base64)
        let imgUrls = imgsCode.split("$qingtiandy$")
        return imgUrls
    }

}]
module.exports = obj