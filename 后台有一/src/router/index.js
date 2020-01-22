import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
//import { resolve } from 'dns';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    // {
    //   path: '/404',
    //   component: () =>
    //     import('@/views/404'),
    //   hidden: true
    // },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/home/home')
        }]
    },


    // {
    // 	path: '/user',
    // 	component: Layout,
    // 	// redirect: '/user/portrayal',
    // 	name: 'User',
    // 	meta: {
    // 		title: '用户系统',
    // 		icon: 'tree'
    //   },
    //   children:[
    //     {
    //       path:'portrayal',
    //       name:'portrayal',
    //       component:()=>
    //       import('@/views/user/portrayal/index'),
    //       meta:{
    //         title:'用户画像',
    //         icon:'people'
    //       }
    //     },
    //     {
    //       path:'account',
    //       name:'account',
    //       component:()=>
    //       import('@/views/user/account/index'),
    //       meta:{
    //         title:'账号详情',
    //         icon:'icon'
    //       }
    //     }
    //   ]

    // },

    // {
    // 	path: 'external-link',
    // 	component: Layout,
    // 	children: [{
    // 		path: 'https://www.baidu.com',
    // 		meta: {
    // 			title: '帮助',
    // 			icon: 'link'
    // 		}
    // 	}]
    // },


]




export const asyncRoutesTwo = [{
        path: 'external-link',
        component: Layout,
        children: [{
            path: 'https://www.baidu.com',
            meta: {
                title: '帮助',
                icon: 'link'
            }
        }]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]



export const asyncRoutes = [{
        path: '/homepage',
        component: Layout,
        name: 'Homepage',
        redirect: '/homepage/home',
        meta: {
            title: '首页',
            icon: 'peoples'
        },
        children: [{
            path: '/homepage/home',
            name: 'home',
            component: () =>
                import ('@/views/homepage/homepage'),
            meta: {
                title: '首页数据',
                icon: 'homepage'
            }
        }]
    },
    {
        path: '/realtime',
        component: Layout,
        redirect: '/realtime/operater',
        alwaysShow: true,
        name: "realtime",
        meta: {
            title: '实时数据',
            icon: 'real'
        },
        children: [{
                path: '/realtime/operater',
                name: 'operater',
                component: () =>
                    import ('@/views/realtime/operater/operater'),
                meta: {
                    title: '运营报表',
                    icon: 'chart'
                }
            },
            {
                path: '/realtime/exposure',
                name: 'exposure',
                component: () =>
                    import ('@/views/realtime/exposure/exposure'),
                meta: {
                    title: '点击曝光',
                    icon: 'tree'
                }
            },
            {
                path: '/realtime/loginmiss',
                name: 'loginmiss',
                component: () =>
                    import ('@/views/realtime/loginmiss/loginmiss'),
                meta: {
                    title: '登录流失',
                    icon: 'peoples'
                }
            }
        ]
    },
    {
        path: '/platform',
        component: Layout,
        // redirect: '/platform/leave',
        name: 'Platform', // 面包二级菜单
        alwaysShow: true,
        meta: {
            title: '平台数据',
            icon: 'edit'
        },
        children: [{
                path: '/platform/operater',
                name: 'operate',
                component: () =>
                    import ('@/views/platform/operater/operater'),
                meta: {
                    title: '运营报表',
                    icon: 'chart'
                }
            },
            {
                path: '/platform/LTVanalyze',
                name: 'LTVanalyze',
                component: () =>
                    import ('@/views/platform/analyze/analyze'),
                meta: {
                    title: 'LTV分析',
                    icon: 'peoples'
                }
            },
            {
                path: '/platform/leave',
                name: 'leave',
                component: () =>
                    import ('@/views/platform/leave/leave'),
                meta: {
                    title: '访问分析',
                    icon: 'tree'
                }
            },
            {
                path: '/platform/remain',
                name: 'remain',
                component: () =>
                    import ('@/views/platform/remain/remain'),
                meta: {
                    title: '留存分析',
                    icon: 'table'
                }
            }
        ]
    },
    {
        path: '/product',
        component: Layout,
        redirect: '/product/operater',
        name: "Product",
        alwaysShow: true,
        meta: {
            title: '产品数据',
            icon: 'excel'
        },
        children: [{
                path: '/product/operater',
                name: 'operat',
                component: () =>
                    import ('@/views/product/operater/operater'),
                meta: {
                    title: '运营报表',
                    icon: 'chart'
                }
            },
            {
                path: '/product/analyze',
                name: 'analyze',
                component: () =>
                    import ('@/views/product/analyze/analyze'),
                meta: {
                    title: 'LTV分析',
                    icon: 'ltv'
                }
            },
            {
                path: '/product/remain',
                name: 'remainProduct',
                component: () =>
                    import ('@/views/product/remain/remain'),
                meta: {
                    title: '留存分析',
                    icon: 'component'
                }
            },
            {
                path: '/product/change',
                name: 'change',
                component: () =>
                    import ('@/views/product/change/change'),
                meta: {
                    title: '转化分析',
                    icon: 'example'
                }
            },
            {
                path: '/product/player',
                name: 'player',
                component: () =>
                    import ('@/views/product/player/player'),
                meta: {
                    title: '玩家分布',
                    icon: 'player'
                }
            },
            {
                path: '/product/active',
                name: 'active',
                component: () =>
                    import ('@/views/product/active/active'),
                meta: {
                    title: '活跃分析',
                    icon: 'active'
                }
            },
            {
                path: '/product/payrank',
                name: 'payrank',
                component: () =>
                    import ('@/views/product/payrank/payrank'),
                meta: {
                    title: '个人信息',
                    icon: 'peoples'
                }
            },
            {
                path: '/product/payranktime',
                name: 'payranktime',
                component: () =>
                    import ('@/views/product/payranktime/payranktime'),
                meta: {
                    title: '充值排行',
                    icon: 'payrank'
                }
            },
            {
                path: '/product/region',
                name: 'region',
                component: () =>
                    import ('@/views/product/region/region'),
                meta: {
                    title: '地区分布',
                    icon: 'region'
                }
            },
            {
                path: '/product/IPmessage',
                name: 'IPmessage',
                component: () =>
                    import ('@/views/product/IPmessage/IPmessage'),
                meta: {
                    title: 'IP信息',
                    icon: 'IPmessage'
                }
            },
            {
                path: '/product/indent',
                name: 'indent',
                component: () =>
                    import ('@/views/product/indent/indent'),
                meta: {
                    title: '订单查询',
                    icon: 'indent'
                }
            },
            {
                path: '/product/custom',
                name: 'custom',
                component: () =>
                    import ('@/views/product/custom/custom'),
                meta: {
                    title: '自定义事件',
                    icon: 'custom'
                }
            },
            {
                path: '/product/customStatistics',
                name: 'customStatistics',
                component: () =>
                    import ('@/views/product/customStatistics/customStatistics'),
                meta: {
                    title: '自定义事件统计',
                    icon: 'customTwo'
                }
            },
            {
                path: '/product/firstPayTime',
                name: 'firstPayTime',
                component: () =>
                    import ('@/views/product/firstPayTime/firstPayTime'),
                meta: {
                    title: '首次付费时间分布',
                    icon: 'payment'
                },
            },
        ]
    },
    {
        path: '/permission',
        component: Layout,
        name: 'Permission',
        redirect: '/permission/page',
        alwaysShow: true,
        meta: {
            title: '权限控制',
            icon: 'jurisdiction'
        },
        children: [{
            path: '/permission/page',
            name: 'page',
            component: () =>
                import ('@/views/permission/page/page'),
            meta: {
                title: '管理员列表',
                icon: 'peoples'
            }
        }]
    }
]


export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})