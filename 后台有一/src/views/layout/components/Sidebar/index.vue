<template>
  
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in children" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import {getInfo} from '@/api/login'
import SidebarItem from './SidebarItem'
import {asyncRoutes,constantRouterMap} from '@/router'
import {routerMatch} from '@/utils/jurisdiction'
import router from '@/router'

export default {
  components: { SidebarItem },
  data(){
    return{
      daohang:[]
    }
  },
  mounted(){
    //console.log('刷新数据',this.children) 
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'routerList',
      'children'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
  }
}
</script>
