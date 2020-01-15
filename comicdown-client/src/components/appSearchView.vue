<template>
    <div class="appSearchView">
        <el-table style="width: 100%" :data="list" @row-dblclick="openDetail">
            <el-table-column prop="title" label="漫画名" width="200">
            </el-table-column>
            <el-table-column prop="author" label="作者" width="180">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="180">
            </el-table-column>
            <el-table-column prop="info" label="简介">
            </el-table-column>
        </el-table>
        <el-drawer :title="showItem.title" :visible.sync="drawer" direction="rtl" :close-on-press-escape="false" :size="'70%'">
            <div class="detail-view">
                <img :src="showItem.img">
                <el-table style="width: 100%" :data="showItem.list" ref="downTable">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="title" label="章节" width="200">
                    </el-table-column>
                    <el-table-column label="下载进度">
                        <template slot-scope="scope">
                            <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.compResult"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="下载" width="100">
                        <template slot="header" slot-scope="scope">
                            <el-button size="mini" @click="downloadAll">下载所选</el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini" @click="download(scope.row)">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>
    </div>
</template>
<script>
import fs from "fs"
var path = require('path');
export default {
    props: ["siteName", "searchWord"],
    computed: {
        toSearch() {
            if (this.siteName && this.searchWord) {

                return `${this.siteName}_${this.searchWord}`
            } else {
                return ""
            }
        }
    },
    watch: {
        toSearch(newVal, oldVal) {
            if (newVal) {
                this.search()
            }
        }
    },
    data() {
        return {
            drawer: false,
            list: [],
            showItem: {}
        }
    },
    methods: {
        dataLeftCompleting(bits, identifier, value) {
            value = identifier.repeat(bits) + value;
            return value.slice(-bits);
        },
        //同步递归创建方法
        mkdirsSync(dirname) {
            if (fs.existsSync(dirname)) {
                return true;
            } else {
                if (this.mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname);
                    return true;
                }
            }
        },
        downloadAll() {
            this.$refs.downTable.selection.forEach(x => {
              this.download(x)  
            })
        },
        createDirs(bookName, groupName) {
            let configPath = path.join("./", "setting.cfg")
            if (!fs.existsSync(configPath)) {
                let newSetting = {
                    default_down_path: "./"
                }
                fs.writeFileSync(configPath, JSON.stringify(newSetting))
            }
            var settings = fs.readFileSync(configPath, 'utf-8');
            settings = JSON.parse(settings)
            let basePath = settings.default_down_path
            let sumPath = path.join(basePath, bookName)
            sumPath = path.join(sumPath, groupName)
            fs.existsSync(sumPath) || this.mkdirsSync(sumPath)
            return sumPath
        },
        async saveImg(imgUrl, bookName, groupName, name, rowData, rowCount) {
            let result = await this.$service("comic/getImgBase64", {
                imgUrl: imgUrl
            },false)
            if (result.issuccess) {
                var base64Data = result.data.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                let parentPath = this.createDirs(bookName, groupName)


                let filePath = path.join(parentPath, `${name}.jpg`)
                fs.writeFile(filePath, dataBuffer, function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        rowData.compNum += 1
                        rowData.compResult = Math.floor(rowData.compNum / rowCount * 100)

                    }
                });
            } else {
                this.$message.error(result.data);
            }
        },

        async download(data) {
            let result = await this.$service("comic/getImgs", {
                imgPath: data.url,
                siteName: this.siteName
            },false)
            if (result.issuccess) {
                for (var i = 0; i < result.data.length; i++) {
                    this.saveImg(result.data[i], this.showItem.title, data.title, this.dataLeftCompleting(4, "0", (i + 1)), data, result.data.length)
                }

            } else {
                this.$message.error(result.data);
            }
        },
        openDetail(row, column, event) {
            this.showItem = row
            this.getComicInfo(row)
            this.drawer = true
        },
        async getComicInfo(rowData) {

            let comicListResult = await this.$service("comic/getComicInfo", {
                searchPath: rowData.url,
                siteName: this.siteName
            })
            if (comicListResult.issuccess) {
                this.$set(this.showItem, "img", comicListResult.data.img)
                this.$set(this.showItem, "list", comicListResult.data.list)
            } else {
                this.$message.error(comicListResult.data);
            }


        },
        async search() {

            let comicListResult = await this.$service("comic/searchComic", {
                searchKey: this.searchWord,
                siteName: this.siteName
            })

            if (comicListResult.issuccess) {
                this.list = comicListResult.data
            } else {
                this.$message.error(comicListResult.data);
            }
        }
    },
    created() {}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.appSearchView {
    .detail-view {
        overflow-y: auto;
        height: calc(100vh - 80px);
    }

    .detail-view::-webkit-scrollbar {
        width: 10px;
    }

    .detail-view::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        border-radius: 10px;

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        background: #888888;

    }

    .detail-view::-webkit-scrollbar-track {
        /*滚动条里面轨道*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        border-radius: 10px;

        background: #EDEDED;

    }
}
</style>