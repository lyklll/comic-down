<template>
    <div id="app">
       <router-view></router-view>  
    </div>
</template>
<style lang="scss">
.main-head {
    display: flex;

    .main-head-icon {
        width: 200px;
        display: flex;

        align-items: center;
    }

    .main-head-searcher {
        display: flex;
        align-items: center;
        width: 100%;
    }
}
</style>