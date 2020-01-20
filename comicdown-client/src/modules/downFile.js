import postMethod from "@/modules/httpMethods"
import fs from "fs"
let obj = {}
obj.saveFile = async (imgUrl, filePath, backArg) => {
    let result = await postMethod.asyncPostMain("comic/getImgBase64", {
        imgUrl: imgUrl
    }, false)
    if (result.issuccess) {
        var base64Data = result.data.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = Buffer.from(base64Data, 'base64');
        let saveResult = await new Promise(su => {
            fs.writeFile(filePath, dataBuffer, (err) => {
                if (err) {
                    su({
                        issuccess: false,
                        data: err
                    })
                } else {
                    su({
                        issuccess: true
                    })
                }
            });
        })
        saveResult.backArg = backArg
        return saveResult

    } else {
        result.backArg = backArg
        return result
    }
}
export default obj