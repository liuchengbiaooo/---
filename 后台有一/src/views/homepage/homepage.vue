<template>
  <div class="ly-flex export" style="margin-top: 25px;">
    <div class="derive">
      <ul class="warp">
        <li @click="exportExcel('csv')">CSV</li>
        <li @click="exportExcel('xlsx')">Excel</li>
      </ul>
    </div>
    <el-row id="realTime_operate_table">
      <el-table :data="operateData" border style="width:100%" ref="table" class="table" :header-cell-style="{'user-select': 'text'}">
        <el-table-column prop="appName" label="应用名称" align="center" width></el-table-column>
        <el-table-column prop="total.create" label="累计新增角色" align="center" width></el-table-column>
        <el-table-column prop="total.active" label="累计活跃角色" align="center" width></el-table-column>
        <el-table-column prop="total.pay" label="累计充值角色" align="center" width></el-table-column>
        <el-table-column prop="total.pay_money" label="累计充值金额" align="center" width></el-table-column>
        <el-table-column prop="yestoday.create" label="昨日新增角色" align="center" width></el-table-column>
        <el-table-column prop="yestoday.active" label="昨日活跃角色" align="center" width></el-table-column>
        <el-table-column prop="yestoday.pay" label="昨天充值角色" align="center" width></el-table-column>
        <el-table-column prop="yestoday.pay_money" label="昨日付费金额" align="center" width></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { loginData } from "@/api/login.js";
export default {
  name: "homepage",
  data() {
    return {
      operateData: []
    };
  },
  methods: { 
    async overallData() {
      this.operateData = [];
      const result = await loginData();
      this.operateData = result.info.data.list;
    },
    //导出
    exportExcel(type) {
      // .table要导出的是哪一个表格
      var wb = this.XLSX.utils.table_to_book(document.querySelector(".table"));
      /* get binary string as output */
      var wbout = this.XLSX.write(wb, {
        bookType: type,
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        this.FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "首页" + `.`+type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },
  mounted() {
    this.overallData();
  }
};
</script>

