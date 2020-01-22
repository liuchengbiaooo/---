<template>
    <div class="ly-flex">
        <div class="clearFix">
            <div class="ly-flex-1 fl">
                <el-select v-model="proSelect" placeholder="产品名">
                    <el-option
                        v-for="item in proNameList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="systemSelect" placeholder="操作系统">
                    <el-option
                        v-for="item in systemlList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="resourceSelect" placeholder="资源模块">
                    <el-option
                        v-for="item in resourceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="channelSelect" placeholder="渠道名">
                    <el-option
                        v-for="item in channelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="classifySelect" placeholder="用户类别">
                    <el-option
                        v-for="item in classifyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="timeSelect" placeholder="时间">
                    <el-option
                        v-for="item in timeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
        </div>
        <div>
            <div id="missChart" :style="{height:'400px'}"></div>
        </div>
        <el-row>
            <el-table :data="loginMissData" border style="width:100%" ref="table">
                <el-table-column prop="" label="步骤ID" align="center" width="140"></el-table-column>
                <el-table-column prop="" label="步骤名称" align="center" width=""></el-table-column>
                <el-table-column prop="" label="设备/账号数" align="center" width=""></el-table-column>
                <el-table-column prop="" label="成功数" align="center" width=""></el-table-column>
                <el-table-column prop="" label="平均完成时间(毫秒)" align="center" width=""></el-table-column>
                <el-table-column prop="" label="相对转化" align="center" width=""></el-table-column>
                <el-table-column prop="" label="绝对转化" align="center" width=""></el-table-column>
            </el-table>
        </el-row>
    </div>
</template>

<script>
// import  api  from '@/utils/api';

    export default {
        name: "loginmiss",
        data(){
            return {
                loginMissData:[],
                proNameList:[],
                systemlList:[],
                resourceList:[],
                channelList:[],
                classifyList:[],
                timeList:[],
                proSelect:'',
                systemSelect:'',
                resourceSelect:'',
                channelSelect:'',
                classifySelect:'',
                timeSelect:''

            }
            
        },
        update(){

        },
        methods:{

        },
        mounted(){
            const chart = this.$echarts.init(document.querySelector('#missChart'));

            chart.setOption({
                tooltip:{
                    trigger:"axis"
                },
                legend:{
                    data:['绝对转化','相对转化','用户数']
                },
            //     grid:{

            //     },
                xAxis:{
                    type:'登录流程',
                    type: 'category',
                    // boundaryGap:false,
                    data:['开始游戏','请求login','加载协议','登录主页面','请求创建角色','选择职业','选择职业完毕','请求进入地图','待加载','待加载','待加载','待加载']
                },
                yAxis:{
                    type:'value',
                    data:[0,10,60,80,120,150,180,210],
                },
                series:[
                    {
                        name:'用户数',
                        type:'bar',
                        // xAxisIndex: 1,
                        // yAxisIndex: 1,
                        barWidth:20,
                        data:[89,90,82,68,76,55,73,89,99,73,80,78],
                        label:{
                            width:40
                        },
                        itemStyle:{
                            color:'#61A0A8',
                            borderWidth:30
                        }
                    },
                    {
                        name:'绝对转化',
                        type:'line',
                        data:[59,80,62,78,66,75,73,80,69,63,60,68]
                    },
                    {
                        name:'相对转化',
                        type:'line',
                        data:[79,69,78,88,76,85,87,90,79,73,70,78]
                    }
                ]
                // legend:{
                //     data:['用户数','绝对转化','相对转化']
                // },
                // xAxis: {
                //     type:'登录流程',
                //     type: 'category',
                    
                //     data:['开始游戏','请求login','加载协议','登录主页面','请求创建角色','选择职业','选择职业完毕','请求进入地图','待加载','待加载','待加载','待加载']
                // },
                // yAxis: {
                //     type:'value',
                //     data:[0,10,60,80,120,150,180,210],
                    
                // },
                // series: [
                //     {
                //         barWidth:20,
                //         data:[89,90,82,68,76,55,73,89,99,73,80,78],
                //         type: 'bar',
                //         itemStyle:{
                //              color:'#61A0A8',
                //         }
                //     },
                //     {
                //         name:'绝对转化',
                //         type:'line',
                //         data:[59,80,62,78,66,75,73,80,69,63,60,68]
                //     },
                //     {
                //         name:'相对转化',
                //         type:'line',
                //         data:[79,69,78,88,76,85,87,90,79,73,70,78]
                //     }
                // ]
            })
        }
    }
</script>

<style scoped>

</style>
<style>
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

