var express = require('express');
var router = express.Router();
var routerMethod = require("../modules/routerMethods.js")
var httpMothods = require("../modules/httpMethods.js")
var suportList = require("../modules/suportList.js")
var cheerio = require("cheerio")
router.post("/comic/getAllSites", routerMethod(async (body, db, options) => {

    return routerMethod.createRespose(suportList)
}))

router.post("/comic/searchComic", routerMethod(async (body, db, options) => {
    if (!body.searchKey || !body.siteName) {
        return routerMethod.createRespose("无效的关键字", false)
    }
    let comicConfig = suportList.find(x => x.name == body.siteName)
    if (!comicConfig) {
        return routerMethod.createRespose("无效的配置名", false)
    }

    let params = null
    let url = ""

    switch (comicConfig.search.method) {
        case "Get":
            url = comicConfig.search.searchUrl.replace(/\{\$key\}/, encodeURIComponent(body.searchKey))
            break
        case "Form":
            url = comicConfig.search.searchUrl
            params = {}
            params[comicConfig.search.searchKey] = body.searchKey
            break
    }
    let result = await httpMothods["async" + comicConfig.search.method](url, params)
   
    if (!result.issuccess) {
        return routerMethod.createRespose("请求漫画列表失败", false)
    }
    let $ = cheerio.load(result.data)
    let parent = $(comicConfig.search.filter.parentPath)
    let comicList = []

    parent.each(idx => {

        let child = {}
        comicConfig.search.filter.childs.forEach(y => {
            if (y.attr) {
                child[y.key] = $(parent[idx]).find(y.path).attr(y.attr)
            } else {
                child[y.key] = $(parent[idx]).find(y.path).text()
            }

        })

        comicList.push(child)
    })
    return routerMethod.createRespose(comicList)
}))

router.post("/comic/getComicInfo", routerMethod(async (body, db, options) => {
    if (!body.siteName || !body.searchPath) {
        return routerMethod.createRespose("无效的关键字", false)
    }
    let comicConfig = suportList.find(x => x.name == body.siteName)
    if (!comicConfig) {
        return routerMethod.createRespose("无效的配置名", false)
    }
    let url = comicConfig.one.searchUrl.replace(/\{\$key\}/, body.searchPath)
    let result = await httpMothods["async" + comicConfig.one.method](url)
    if (!result.issuccess) {
        return routerMethod.createRespose("获取详细信息失败", false)
    }
    let $ = cheerio.load(result.data)

    let img = $(comicConfig.one.filter.imgPath)
    let parent = $(comicConfig.one.filter.parentPath)
    let comicList = []

    parent.each(idx => {
        let child = {
            idx: idx,
            compResult: 0,
            compNum: 0,

        }
        comicConfig.one.filter.childs.forEach(y => {
            if (y.attr) {
                child[y.key] = $(parent[idx]).find(y.path).attr(y.attr)
            } else {
                child[y.key] = $(parent[idx]).find(y.path).text()
            }
        })
        comicList.push(child)
    })
    comicList.sort((a, b) => {
        return b.idx - a.idx
    })
    return routerMethod.createRespose({
        img: img.attr("src"),
        list: comicList
    })

}))
router.post("/comic/getImgs", routerMethod(async (body, db, options) => {
    if (!body.siteName || !body.imgPath) {
        return routerMethod.createRespose("无效的关键字", false)
    }
    let comicConfig = suportList.find(x => x.name == body.siteName)
    if (!comicConfig) {
        return routerMethod.createRespose("无效的配置名", false)
    }
    let a = await comicConfig.single(body.imgPath, httpMothods)
    return routerMethod.createRespose(a)
}))

router.post("/comic/getImgBase64", routerMethod(async (body, db, options) => {
    if (!body.imgUrl) {
        return routerMethod.createRespose("无效的关键字", false)
    }
    let result = await httpMothods.asyncGetImgBase64(body.imgUrl)
    return result
}))


module.exports = router