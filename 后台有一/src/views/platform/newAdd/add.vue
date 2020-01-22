<template>
    <div>
        <div class="ly-flex clearFix">
            <div class="ly-flex-1" style="float:left">
                <el-select v-model="selitem" placeholder="请选择">
                    <el-option 
                    v-for="item in selLists" 
                    :key="item.value"
                    :label="item.label"
                    :value='item.label'
                    ></el-option>
                </el-select>
            </div>
            <div class="ly-flex-1" style="float:left">
                <el-select v-model="dateItem" placeholder="请选择">
                    <el-option 
                    v-for="item in selLists" 
                    :key="item.value"
                    :label="item.label"
                    :value='item.label'
                    ></el-option>
                </el-select>
            </div>
        </div>
        <el-row>
            <el-table :data="addData" border style="width:100%" ref="table">
                <el-table-column  label="日期"></el-table-column>
                <el-table-column  label="日期"></el-table-column> 
                <el-table-column  label="日期"></el-table-column>  
            </el-table>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "new-add",
        data:function(){
            return {
                selitem:'',
                dateItem:'',
                addData:[],
                tableList:[],
                 selLists: [{
                    value: '选项1',
                    label: '激活'
                    }, {
                    value: '选项2',
                    label: '账号'
                    }, {
                    value: '选项3',
                    label: '角色'
                    }, {
                    value: '选项4',
                    label: '下载'
                    }, {
                    value: '选项5',
                    label: '充值'
                }]
            }
        },
        updated() {
            console.log(this.selitem)
        },
        methods:{
            demo(){
                console.log(this.selitem)
            }
        },
        mounted(){
            this.demo()
        }
    }
</script>

<style scoped>
.clearFix{
    zoom: 1;
}
.clearFix::after{
    content: '';
    clear: both;
    display: block;
}
</style>
