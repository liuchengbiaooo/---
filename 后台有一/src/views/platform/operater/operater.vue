<template>
    <div class="ly-flex">
        <div class="clearFix">
            <div class="ly-flex-1 fl">
                 <el-select v-model="channelCon" @change="seletcPro" placeholder="请选择渠道">
                     <el-option
                    v-for="item in proList"
                    :key="item.appid"
                    :label="item.appName"
                    :value="item.appId">
                    </el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                 <el-select v-model="systemCon" placeholder="操作系统">
                    <el-option
                    v-for="item in systemList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="userClassify" @change="changeClassify" placeholder="用户类型">
                    <el-option
                    v-for="item in userlist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                 <el-select v-model="itemCon" placeholder="时间粒度">
                    <el-option
                    v-for="item in itemList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-date-picker v-model="selectDate" type="date" start-placeholder="选择日期" >
                </el-date-picker>
            </div>
        </div>
        <div>
            <div class="ly-flex-1">
                <el-tabs v-model="tabSel" id='realTime_operate_tab' type="card"  :addable='true' @tab-click="handleClick">
                    <el-tab-pane :label="'新增'+user" :name="user == '用户'?'newAdd': user == '角色'?'newAddRole':user == '账号'?'newAddAccount':''" ></el-tab-pane> 
                    <el-tab-pane :label="'活跃'+user" name="active" ></el-tab-pane>
                    <el-tab-pane :label="'付费'+user" name="rechargeP"></el-tab-pane>
                    <el-tab-pane :label="'新增付费'+user" name="addrecharge"></el-tab-pane>
                    <!-- <el-tab-pane label="新增账号" name="newAddAccount"></el-tab-pane> -->
                    <el-tab-pane label="新增付费金额" name="addreahargeNum" ></el-tab-pane>
                    <el-tab-pane label="付费率" name="fuPerscent" ></el-tab-pane>
                    <el-tab-pane label="新增付费率" name="addfuPerscent" ></el-tab-pane>
                    <el-tab-pane label="付费arpu" name="fuarpu" ></el-tab-pane>
                    <el-tab-pane label="新增付费arpu" name="adddfuarpu" ></el-tab-pane>
                </el-tabs>
            </div>
             <div>
                <div id="realTime_operate_chart" :style="{height:'300px'}"></div>
            </div>
            <el-row id='realTime_operate_table'>
                <el-table :data="operateData" border  style="width:100%" ref="table">
                    <el-table-column prop="product"  label="产品" align="center" width=""></el-table-column>
                    <el-table-column prop="date"  label="日期" align="center" width="180"></el-table-column>
                    <el-table-column prop="channel"  label="渠道" align="center" width=""></el-table-column>
                    <el-table-column prop="newAddRole"  :label="'新增'+user" align="center" width=""></el-table-column>
                    <el-table-column prop="activeRole"  :label="'活跃'+user" align="center" width=""></el-table-column>
                    <el-table-column prop="payRole"  :label="'付费'+user" align="center" width=""></el-table-column>
                    <el-table-column prop="newAddPayRole"  :label="'新增付费'+user" align="center" width=""></el-table-column>
                    <el-table-column prop="newAddPayNum"  label="新增付费金额" align="center" width=""></el-table-column>
                    <el-table-column prop="middlePayNum"  label="中付费金额" align="center" width=""></el-table-column>
                    <el-table-column prop="payRate"  label="付费率" align="center" width=""></el-table-column>
                    <el-table-column prop="newAddPayRate"  label="新增付费率" align="center" width=""></el-table-column>
                    <el-table-column prop="payRapu"  label="付费arpu" align="center" width=""></el-table-column>
                    <el-table-column prop="newAddRapu"  label="新增付费arpu" align="center" width=""></el-table-column>
                </el-table>
            </el-row>
        </div>
       
       
    </div> 
</template>

<script>
import {getCPList,activeRole,newAddRole,newAddAccount,rechargeNum} from '@/api/realtime'
import { getToken } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'

    export default {
        name: "operater",
        data(){
            return{
                user:'角色',
                selectP:'',
                channelCon:'1000001',
                appName:'',
                systemCon:'',
                itemCon:'',
                selectDate:'',
                datetime :'2019-01-04',
                newAddRoleCount:'',
                activeRoleCount:'',
                newAddPayCount:'',
                payRoleCount:'',
                // datetime :this.selectDate == ''|| undefined ?'2019-01-04' :this.selectDate,
                userClassify:'role',
                tabSel:this.user == "角色"?'newAddRole':this.user == '用户'?'newAdd':this.user == '账号'?'newAddAccount':'',
                operateData:[
                    {
                        'product':this.channelCon,
                        'date':'2019-1-25',
                        'channel':'',
                        'newAddRole':1,//this.newAddRoleCount
                        'activeRole':1,//this.activeRoleCount
                        'payRole':1,//this.payRoleCount
                        'newAddPayRole':'',
                        'newAddPayNum':0,//this.newAddPayCount
                        'middlePayNum':'',//this.middlePayCount
                        'payRate':'11',
                        'newAddPayRate':'',
                        'payRapu':'1',
                        'newAddRapu':''
                    }
                ],
                selectData:[],
                userlist:[],
                chartData:[820,932,934,1290,1330,3120],
                token:getToken(),
                proList:[],
                userlist:[
                    {
                        value:'user',
                        label:'用户'
                    },
                    {
                        value:'role',
                        label:'角色'
                    },
                    {
                        value:'account',
                        label:'账号'
                    }
                ],
                itemList:[
                    {
                        value:1,
                        label:'小时'
                    },
                    {
                        value:2,
                        label:'天'
                    },
                    {
                        value:3,
                        label:'月'
                    }
                ],
                systemList:[
                     {
                        value:1,
                        label:'安卓'
                    },
                    {
                        value:2,
                        label:'ios'
                    },
                    {
                        value:3,
                        label:'ios越狱'
                    }
                ]
            }
        },
        watch:{
            
        },
        methods:{
            //点击tab
             handleClick(tab,event){
                 console.log(tab.name)
                 if(tab){
                     tab.name == 'newAdd'?""
                     :tab.name == 'newAddRole'?this.newadd()//新增角色
                     :tab.name == 'active'?this.activeRoleData()//活跃角色
                     :tab.name == 'newAddAccount'?this.newaddAccount()//新增账号
                     :tab.name == 'rechargeP'?""
                     :tab.name == 'addrecharge'?""
                     :tab.name == 'addreahargeNum'?this.getRechargeNumber()//付费金额
                     :tab.name == 'fuPerscent'?""
                     :tab.name == 'addfuPerscent' ?""
                     :tab.name == "fuarpu"?""
                     :tab.name == "adddfuarpu"?"":""
                 }
                // return tab;
            },
            setAllOption(xData,yData,name){
                const realTimeChart = this.$echarts.init(document.querySelector('#realTime_operate_chart'));

                console.log('=====================')
                // console.log(xData)
                // console.log(yData)
                console.log(name)
                realTimeChart.setOption({
                    xAxis:{
                        data:xData
                    },
                    series:{
                        name:name,
                        data:yData
                    }
                })
            },
            //用户类型
            changeClassify(env){
                // console.log(env)
                env == 'role' ? this.user='角色':env == 'account' ? this.user='账号' :env == "user" ?this.user='用户':""
                // if(env == 'role'){
                //     this.user = '角色'
                //     this.newadd(this.channelCon);
                // }else if(env == 'account' ){
                //     this.user = '账号'
                // }else{
                //     return;
                // }
            },

             //选择产品
            seletcPro(env){
                console.log(this.channelCon)
                this.channelCon = env;
                var token = getToken();
                this.newadd(this.channelCon)
                this.tabSel='newAddRole'
                // this.operateData[0].product=this.channelCon
                // this.operateData[0].date=this.datetime
                // var datetime = '2019-01-04';
                // handleClick()
                // if(env){
                //     this.user == '用户'? Message({message:'暂无新增用户数据，请选择用户类型查看新增角色或账号',type:'warning'}) : this.user == '角色'?this.newadd(this.channelCon):''
                // }
            },

            //获取产品列表
            getproList(){
                console.log("============="+this.channelCon)
                getCPList().then((response)=> {
                    this.proList = response.info
                    this.proList.forEach(el => {
                        console.log(el)
                        if(el.appId ==this.channelCon){
                            this.appName=el.appName
                            console.log(el.appName)
                            console.log('cp===='+this.appName)
                        }
                    });
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        mounted(){
            this.getproList();
           
             const realTimeChart = this.$echarts.init(document.querySelector('#realTime_operate_chart'));
            realTimeChart.setOption({
                tooltip: {
                    trigger: "axis"
                },
                // legend:{
                //     data:['在线']
                // },
                 grid: {
                    // left: "3%",
                    // right: "4%",
                    // bottom: "3%",
                    // containLabel: true
                    // show:true
                },
                xAxis:{
                    name:'时间',
                    // stack:'总量',
                    type: 'category',
                    // boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis:{
                    type: 'value',
                    data:[0,1000,2000,3000,4000,5000]
                },
                series:[
                    {   name:'在线',
                        stack:'总量',
                        data:this.chartData,
                        type:'line'
                    }
                   
                ]   
            })
        },
        // updated(env){
        //     console.log(env)
        // }
    }
</script>

<style scoped>
.fl{float: left;}
.fr{float: right;}
.clearFix{
    zoom: 1;
}
.clearFix::after{
    content: '';
    clear: both;
    display: block;
}

</style>

<style>
#realTime_operate_tab{
    margin-top: 20px;
}
.el-tabs__header{
        margin: 15px 0 0px;
}
</style>
