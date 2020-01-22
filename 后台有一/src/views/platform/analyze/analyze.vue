<template>
    <div class="ly-flex">
        <div class="clearFix">
            <div class="ly-flex-1 fl">
                <el-select v-model="productSelect" placeholder="产品选择">
                    <el-option
                        v-for="item in proList"
                        :key="item.appid"
                        :label="item.cpName"
                        :value="item.appid"
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="channelSelect" placeholder="渠道名">
                    <el-option
                        v-for="item in aaa" 
                        :key="item.appid"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>    
                </el-select>   
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="operateSystem" placeholder="操作系统">
                    <el-option
                        v-for="item in aaa" 
                        :key="item.appid"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>    
                </el-select>   
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="tieGranularity" placeholder="时间粒度">
                    <el-option
                        v-for="item in aaa" 
                        :key="item.appid"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>    
                </el-select>   
            </div>
            <div class="ly-flex-1 fl">
                <el-select v-model="selectTime" placeholder="时间">
                    <el-option
                        v-for="item in aaa" 
                        :key="item.appid"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>    
                </el-select>   
            </div>
        </div>
        <div>
            <div class="ly-flex-1">
             <el-checkbox-group v-model="checkItem" size="medium" @change="checkTableItem">
                 <el-checkbox-button v-for="item in selectList" :label="item" :key="item">LTV{{item}}</el-checkbox-button>
             </el-checkbox-group>
            </div>
        </div>
        <div>
            <div id="chart" :style="{height:'300px'}"></div>
        </div>
        <div>
            <el-table :data="tableData" border >
                <el-table-column prop='' label='日期' align="center" width=''></el-table-column>
                <el-table-column prop='' label='渠道' align="center" width=''></el-table-column>
                <el-table-column prop='' label='产品' align="center" width=''></el-table-column>
                <el-table-column prop='' label='新增' align="center" width=''></el-table-column>
                <el-table-column v-for="item in selectTableList" :key="item" prop='' :label="'LTV'+item" align="center" width=''></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "analyze",
        data(){
            return {
                tabSel:'',
                tableData:'',
                productSelect:'',
                channelSelect:'',
                operateSystem:'',
                tieGranularity:'',
                selectTime:'',
                proList:[],
                aaa:[],
                selectTableList:[],
                tableData:[],
                checkItem:['1~7','8~15','30','60'],
                selectList:['1~7','8~15','16~29','30','31~59','60','61~89','90','91~119','120','121~149','150','151~179','180']
            }
        },
        watch:{
            
        },
        methods:{
            range(arrList, start, end){
                if (end) {
                    for (var i = start; i <= end; i++) {
                        arrList.push(i);
                    }
                }else {
                    arrList.push(start);
                }
                return arrList;
            },
            checkTableItem(){
                this.selectTableList=[]
                for(var i of this.checkItem){
                    if(i.split('~').length >= 2){
                        this.selectTableList=this.range(this.selectTableList,Number(i.split('~')[0]),Number(i.split('~')[1]))
                    }else{
                        this.selectTableList=this.range(this.selectTableList,Number(i.split('~')[0]))
                    }
                }
            }
        },
        mounted(){

            this.checkTableItem()

            var chart = this.$echarts.init(document.querySelector('#chart'));

            chart.setOption({
                xAxis:{
                    type:'category',
                    axisTick:{
                        alignWithLabel :true
                    },
                    data:['2018-9-12','218-9-13','2018-9-14','218-9-15','2018-9-16','2018-9-17','2018-9-18','2018-9-19','2018-9-20']
                },
                yAxis:{
                    // data:[]
                },
                legend:{
                    type:'plain',
                    bottom:'0',
                    selectedMode:false,
                },
               
                series:[
                    {
                        name:'数据',
                        type:'line',
                        smooth: true,
                        data:[50,180,360,780,560,218,368,694,291],
                        lineStyle:{
                            color:'#D1D3E1',
                        },
                        areaStyle:{
                            color:'#E9EAF1',
                            origin:'start'
                        }
                    },
                    {
                        name:'数据2',
                        type:'line',
                        smooth:true,
                        data:[30,710,120,920,140,820,210,750,341],
                        lineStyle:{
                            color:'#E4B07C'
                        },
                        areaStyle:{
                            color:'#DCCCC3',
                            origin:'start'
                        }
                    },
                    {
                        name:'数据3',
                        type:'line',
                        smooth:true,
                        data:[10,910,20,620,340,1020,210,950,641],
                        lineStyle:{
                            color:'#937C69'
                        },
                        areaStyle:{
                            color:'#D1C2B8',
                            origin:'start'
                        }
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

</style>