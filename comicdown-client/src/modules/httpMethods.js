/***************************
 * 领域服务基类
 **************************/
import axios from "axios"
class apiServiceBase {
    //base_url = 'http://10.254.252.41:3000/' //当不使用代理时
    //base_url = 'http://api.raincat.xin/' //当不使用代理时
    //base_url = "http://localhost:3000/" //当使用uni-app时



    async asyncPost(command, request, showLoading = true) {
        let loading = null
        if (showLoading) {
            loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        }
        try {
            let base_url = "/apis/"
            request = request || {}

            let url = base_url + command;

            let res = await axios.post(url, request);

            return res.data
        } catch (err) {
            console.log(err)
            return {
                issuccess: false,
                data: err.message
            }
        } finally {
            if (loading)
                loading.close()
        }
    }

}
export default new apiServiceBase()