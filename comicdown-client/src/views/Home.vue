<template>
    <div class="home">
        <el-container>
            <el-header class="main-head">
                <div class="main-head-icon">
                    <i class="el-icon-eleme">漫画下载器</i>
                </div>
                <div class="main-head-searcher">
                    <el-input placeholder="请输入文本内容" v-model="searchWord">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu @select="menuSelect">
                        <el-submenu index="menu-sites">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>支持站点</span>
                            </template>
                            <el-menu-item :index="item.name" v-for="item in menuList" :key="item.name">{{item.title}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="menu-setting">
                            <i class="el-icon-menu"></i>
                            <span slot="title">软件设置</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <appSearchView v-show="showName=='sites'" :siteName="curSiteSelected" :searchWord="curSearchWord"></appSearchView>
                    <appSettings v-show="showName=='menu-setting'"></appSettings>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
// @ is an alias to /src
import appSearchView from "@/components/appSearchView"
import appSettings from "@/components/appSettings"

export default {
    name: 'home',
    computed: {

    },
    components: {
        appSearchView,appSettings
    },
    data() {
        return {
            searchWord: "",
            curSiteSelected: "",
            curSearchWord: "",
            menuList: [],
            showName:"sites"
        }
    },
    methods: {
        menuSelect(e) {
            if (e.indexOf("menu") < 0) {
                this.curSiteSelected = e
                this.showName="sites"
            }
            else{
                 this.showName=e
            }
        },
        search() {
            this.curSearchWord = this.searchWord
        }
    },
    async created() {


        let menuListResult = await this.$service("comic/getAllSites")

        if (menuListResult.issuccess) {
            this.menuList = menuListResult.data
            this.curSiteSelected = this.menuList[0].name
        } else {
            this.$message.error(menuListResult.data);
        }
    }
}
</script>