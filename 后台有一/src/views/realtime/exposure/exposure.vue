<template>
    <div class="ly-flex">
        <div class="clearFix">
            <div class="ly-flex-1 fl">
                <el-select v-model="selectP" @change="getSelect" placeholder="请选择产品" >
                    <el-option
                    v-for="item in proList"
                    :key="item.appid"
                    :label="item.cpName"
                    :value="item.appId">
                    </el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                 <el-select v-model="channelCon" placeholder="请选择渠道">
                    <el-option
                    v-for="item in channelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
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
                 <el-select v-model="itemCon" placeholder="时间粒度">
                    <el-option
                    v-for="item in itemList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div>
            <div class="ly-flex-1">
                <el-tabs v-model="tabSel" id='realTime_operate_tab' type="card"  :addable='true' @tab-click="handleClick">
                    <el-tab-pane label="曝光PV" name="online" ></el-tab-pane> 
                    <el-tab-pane label="曝光UV" name="active" ></el-tab-pane>
                    <el-tab-pane label="点击PV" name="addAccount"></el-tab-pane>
                    <el-tab-pane label="点击UV" name="recharge"></el-tab-pane>
                    <el-tab-pane label="新增" name="reahcrgeNum" ></el-tab-pane>
                </el-tabs>
            </div>
            <el-row id='realTime_operate_table'>
                <el-table :data="operateData" border  style="width:100%" ref="table">
                    <el-table-column prop="date"  label="曝光PV" align="center" width="180"></el-table-column>
                    <el-table-column prop="online"  label="曝光UV" align="center" width=""></el-table-column>
                    <el-table-column prop="huoyue"  label="点击PV" align="center" width=""></el-table-column>
                    <el-table-column prop="new"  label="点击UV" align="center" width=""></el-table-column>
                    <el-table-column prop="chongzhi"  label="新增" align="center" width=""></el-table-column>
                </el-table>
            </el-row>
        </div>
        <div>
            <div id="realTime_operate_chart" :style="{height:'300px',width:'800px'}"></div>
        </div>
        <el-row id='reamTime_selectTable'>
            <el-table :data="selectData" border style="width:100%" ref="table">
                <el-table-column prop="" label="时间" align="center" width="180"></el-table-column>
                <el-table-column prop="" label="今日" align="center" width=""></el-table-column>
                <el-table-column prop="" label="昨日" align="center" width=""></el-table-column>
                <el-table-column prop="" label="上周" align="center" width=""></el-table-column>
            </el-table>
        </el-row>
    </div> 
</template>

<script>

import {getCPList} from '@/api/realtime'


    export default {
        name: "operater",
        data(){
            return {
                selectP:'',
                channelCon:'',
                systemCon:'',
                itemCon:'',
                tabSel:'online',
                operateData:[
                    // {
                    //     date:'2018-1-14',
                    //     online:'',
                    //     huoyue:'95',
                    //     new:'36',
                    //     chongzhi:'536',
                    //     chongzhirenshu:'12'
                    // },
                  
                ],
                selectData:[],
                proList:[],
                channelList:[
                    {
                        value:6666,
                        label:'渠道1'
                    },
                    {
                        value:5555,
                        label:'渠道2'
                    },
                    {
                        value:4444,
                        label:'渠道3'
                    },
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
        updated() {
        //    console.log(this.selectP)
        },
        methods:{
            handleClick(tab,event){
                // this.tabSel == 'online' ? this.online : this.tabSel =='active' ? this.active : this.tabSel == 'addAccount' ? this.addAccount:this.tabSel == 'recharge' ?this.recharge:this.tabSel == 'reahcrgeNum'?this.reahcrgeNum:""
            },
          getSelect(env){
              console.log(env)
          },

            getCp(){
                getCPList().then(response => {
                    this.proList = response.info    
                }).catch(err => {
                    console.log(err)
                })

            }
            
        },
        mounted(){
            this.getCp();
            const realTimeChart = this.$echarts.init(document.querySelector('#realTime_operate_chart'));
            realTimeChart.setOption({
                tooltip: {
                    trigger: "axis"
                },
                legend:{
                    data:['在线','充值','活跃']
                },
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
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis:{
                    type: 'value',
                    data:[0,1000,2000,3000,4000,5000]
                },
                series:[
                    {   name:'在线',
                        stack:'总量',
                        data:[820,932,934,1290,1330,3120],
                        type:'line'
                    },
                    {   name:'充值',
                        stack:'总量',
                         data:[320,732,1834,1590,1230,2920],
                        type:'line'
                    },
                    {   name:'活跃',
                        stack:'总量',
                         data:[520,632,704,1056,1123,3523],
                        type:'line'
                    }
                ]   
            })
        }
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
