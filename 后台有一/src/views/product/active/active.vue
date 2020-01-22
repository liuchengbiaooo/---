<template>
  <div class="ly-flex">
    <div class="clearFix distance" id="head">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="selectP" @change="seletcPro" placeholder="请选择产品" filterable>
          <el-option
            v-for="item in proList"
            :key="item.appid"
            :label="item.appName"
            :value="item.appId"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl ly-20 warp">
        <span class="warp_content">渠道选择</span>
        <el-select v-model="channelCon" @change="channel" placeholder="请选择渠道" filterable multiple>
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.partnerName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl ly-20 warp">
        <span class="warp_content">操作系统</span>
        <el-select v-model="systemCon" @change="system" placeholder="操作系统">
          <el-option
            v-for="item in systemList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <el-date-picker
          v-model="selectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="choose"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="ly-flex-1 fl warp">
        <TableSettings
          :checkedCities="checkedCities"
          :checked="checked"
          @handleCheckedCitiesChange="handleCheckedCitiesChange"
        ></TableSettings>
      </div>
      <div class="ly-flex-1 fl warp">
        <el-button type="primary" @click="grabble">搜索</el-button>
      </div>
    </div>
    <div>
      <div id="chart" :style="{height: '300px',width: '100%'}"></div>
    </div>

    <div class="chartCenter" style="margin-left:320px">
      <div class="ly-flex-1">
        <el-checkbox-group v-model="checkItemTwo" size="medium" @change="preserve">
          <el-checkbox-button
            v-for="item in checkItemList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          >{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>

    <div class="export">
      <div class="derive">
        <ul class="warp">
          <li @click="exportExcel('csv')">CSV</li>
          <li @click="exportExcel('xlsx')">Excel</li>
        </ul>
      </div>
      <el-row id="reamTime_selectTable">
        <div id="tabHeighe">
          <simpleTable
            :tableData="tableData"
            :tableHeader="this.tableHeader"
            :tableHeight="tableHeight"
            class="table"
          ></simpleTable>
        </div>
        <!-- <el-table :data="tableData" border style="width:100%" ref="table" class="table">
          <el-table-column prop="date" label="日期" align="center" width="150"></el-table-column>
          <el-table-column prop="productName" label="产品" align="center" width></el-table-column>
          <el-table-column prop="new_device" label="新增设备数" align="center" width></el-table-column>
          <el-table-column prop="new_account" label="	新增账号数" align="center" width></el-table-column>
          <el-table-column
            prop="new_every_account_login_times"
            label="新增每账号登录次数"
            align="center"
            width
          ></el-table-column>
          <el-table-column prop="new_every_device_account" label="新增每设备登录次数" align="center" width></el-table-column>
          <el-table-column prop="login_device" label="登录设备数" align="center" width></el-table-column>
          <el-table-column prop="login_account" label="登录账号数" align="center" width></el-table-column>
          <el-table-column prop="active_user" label="活跃用户数" align="center" width></el-table-column>
          <el-table-column prop="active_user_important" label="重度活跃用户数" align="center" width></el-table-column>
          <el-table-column prop="device_every_account" label="每设备账号数" align="center" width></el-table-column>
          <el-table-column prop="login_every_account" label="每账号登录次数" align="center" width></el-table-column>
          <el-table-column prop="active_percent" label="活跃度" align="center" width></el-table-column>
          <el-table-column prop="active_percent_important" label="重度活跃度" align="center" width></el-table-column>
        </el-table>-->
      </el-row>
    </div>
  </div>
</template>

<script>
import TableSettings from "@/components/TableSettings";
import simpleTable from "@/components/SimpleTable";
import { mapGetters } from "vuex";
import { activeAnalysis } from "@/api/product";
import { getBeforeDate, getMyDay } from "@/utils/newDate";
import { allWatermark } from "@/utils/allWatermark"; //水印
export default {
  name: "change",
  data() {
    return {
      selectP: "",
      channelCon: [],
      systemCon: "all",
      itemCon: "",
      selectData: [],
      proList: [
        {
          label: "",
          value: ""
        }
      ],
      channelList: [
        {
          label: "",
          value: ""
        }
      ],
      systemList: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "android",
          label: "安卓"
        },
        {
          value: "ios",
          label: "ios"
        }
      ],
      itemList: [
        {
          label: "",
          value: ""
        }
      ],
      selectDate: [],
      checkItemTwo: ["活跃度"],
      checkItemList: [
        {
          label: "活跃度",
          value: "1"
        },
        {
          label: "重度活跃度",
          value: "2"
        },
        {
          label: "新增每账号登录次数",
          value: "3"
        },
        {
          label: "每账号登录次数",
          value: "4"
        }
      ],
      replaceChannel: "all",
      tableData: [],
      tableHeight:0,
      tableHeader: [
        { isShow: true, label: "日期", prop: "date" },
        { isShow: true, label: "产品", prop: "productName" },
        { isShow: true, label: "新增设备数", prop: "new_device" },
        { isShow: true, label: "新增账号数", prop: "new_account" },
        {
          isShow: true,
          label: "新增每账号登录次数",
          prop: "new_every_account_login_times"
        },
        {
          isShow: true,
          label: "新增每设备登录次数",
          prop: "new_every_device_account"
        },
        { isShow: true, label: "登录设备数", prop: "login_device" },
        { isShow: true, label: "登录账号数", prop: "login_account" },
        { isShow: true, label: "活跃用户数", prop: "active_user" },
        {
          isShow: true,
          label: "重度活跃用户数",
          prop: "active_user_important"
        },
        { isShow: true, label: "每设备账号数", prop: "device_every_account" },
        { isShow: true, label: "每账号登录次数", prop: "login_every_account" },
        { isShow: true, label: "活跃度", prop: "active_percent" },
        { isShow: true, label: "重度活跃度", prop: "active_percent_important" }
      ],
      checkedCities: [
        "日期",
        "产品",
        "新增设备数",
        "新增账号数",
        "新增每账号登录次数",
        "新增每设备登录次数",
        "登录设备数",
        "登录账号数",
        "活跃用户数",
        "重度活跃用户数",
        "每设备账号数",
        "每账号登录次数",
        "活跃度",
        "重度活跃度"
      ],
      checked: [
        { label: "日期", disabled: "disabled" },
        { label: "产品" },
        { label: "新增设备数" },
        { label: "新增账号数" },
        { label: "新增每账号登录次数" },
        { label: "新增每设备登录次数" },
        { label: "登录设备数" },
        { label: "登录账号数" },
        { label: "活跃用户数" },
        { label: "重度活跃用户数" },
        { label: "每设备账号数" },
        { label: "每账号登录次数" },
        { label: "活跃度" },
        { label: "重度活跃度" }
      ]
    };
  },
  computed: {
    ...mapGetters(["productList", "pickerOptions"])
  },
  watch: {
    tableData() {
      this.checkItemTwo = ["活跃度"];
      this.preserve(["活跃度"]);
    }
  },
  methods: {
     //滚动事件
    handleScroll() {
      let topSize = document.getElementById("tabHeighe").getBoundingClientRect().top;
      let topSizeTwo = topSize - 80;
      let headSizeTwo = document.getElementById("head");
      if (topSizeTwo <= 0) {
        headSizeTwo.classList.add("location");
      } else {
        headSizeTwo.classList.remove("location");
      }
    },
    //表格设置
    handleCheckedCitiesChange(value) {
      let btn = value;
      this.tableHeader.forEach(item => {
        if (btn.indexOf(item.label) == "-1") {
          item.isShow = false;
        } else {
          item.isShow = true;
        }
      });
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
          "活跃分析" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //用户点击选择产品
    seletcPro(evevt) {
      this.selectP = evevt;
      //获取渠道信息
      this.channelList = [
        {
          id: "all",
          partnerName: "全部"
        }
      ]; //先将数组还原
      this.channelCon = ["all"]; //将渠道的id还原
      this.replaceChannel = "all"; //将参数渠道还原
      let newly = [];
      this.productList.forEach(item => {
        if (evevt == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);
      this.channelList = arr;
    },
    //用户点击搜索
    grabble() {
      this.changeAnalyze();
      allWatermark();
    },
    //用户选择渠道
    channel(evevt) {
      if (evevt.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = evevt.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }
      this.channelCon = evevt;
      //this.queryTheGame();
    },
    //用户选择操作系统
    system(evevt) {
      this.systemCon = evevt;
    },
    //用户选择了时间
    choose(evevt) {
      this.selectDate = evevt;
    },

    setAllOption(xData, series) {
      const realTimeChart = this.$echarts.init(
        document.querySelector("#chart")
      );
      realTimeChart.setOption({
        tooltip: {
          trigger: "axis"
        },

        legend: {
          type: "plain",
          bottom: "0",
          selectedMode: false
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          data: xData
        },
        series: series
      });
    },
    //用户点击中间的title
    preserve(evevt) {
      var titleList = evevt;
      const tableData = this.tableData;
      let xDate = [];
      let series = [
        {
          name: "活跃度",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#CD5A57"
          },
          areaStyle: {
            color: "rgba(205,90,87,0.3)",
            origin: "start"
          }
        },
        {
          name: "重度活跃度",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#2F4655"
          },
          areaStyle: {
            color: "rgba(47,70,85,0.3)",
            origin: "start"
          }
        },
        {
          name: "新增每账号登录次数",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#7DB2B7"
          },
          areaStyle: {
            color: "rgba(125,178,183,0.3)",
            origin: "start"
          }
        },
        {
          name: "每账号登录次数",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#DC977F"
          },
          areaStyle: {
            color: "rgba(220,151,127,0.3)",
            origin: "start"
          }
        }
      ];
      titleList.forEach(title => {
        tableData.forEach(item => {
          if (xDate.length < tableData.length) {
            xDate.push(item.date);
          }
          series.forEach(tm => {
            if (title == "活跃度" && tm.name == "活跃度") {
              tm.data.push(item.active_percent);
            } else if (title == "重度活跃度" && tm.name == "重度活跃度") {
              tm.data.push(item.active_percent_important);
            } else if (
              title == "新增每账号登录次数" &&
              tm.name == "新增每账号登录次数"
            ) {
              tm.data.push(item.new_every_account_login_times);
            } else if (
              title == "每账号登录次数" &&
              tm.name == "每账号登录次数"
            ) {
              tm.data.push(item.login_every_account);
            }
          });
        });
      });
      this.setAllOption(xDate, series);
    },
    //查询游戏的转化分析
    changeAnalyze() {
      var appid = this.selectP;
      var start_date = this.selectDate[0];
      var end_date = this.selectDate[1];
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var productName; //匹配的产品名
      activeAnalysis(appid, start_date, end_date, system, channel)
        .then(response => {
          let result = response.info.data.list;
          this.productList.forEach(item => {
            //加上产品
            if (item.appId == this.selectP) {
              productName = item.appName;
            }
          });
           var tableTop = document.getElementById("tabHeighe").getBoundingClientRect().top;
          var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 20;
          if(result.length > 15){
            this.tableHeight = 1000
          }else{
            this.tableHeight = tableHeight;
          }
          result.forEach(item => {
            item.productName = productName; //加上产品
            // item.account = item.new_account + `(` + item.account_c_rate + `%` + `)`;
            // item.role = item.new_role + `(` + item.role_c_rate + `%` + `)`;
            // item.total = item.total_c_rate + `%`;
          });
          this.tableData = result;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
     window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.proList = this.productList;
    this.selectP = this.productList[0].appId;
    this.seletcPro(this.selectP); //渲染渠道列表
    const time = getBeforeDate(1);
    const eightDays = getBeforeDate(8); //拿到时间
    this.selectDate = [eightDays, time]; //默认时间
    this.changeAnalyze();
    var realTimeChart = this.$echarts.init(document.querySelector("#chart"));

    realTimeChart.setOption({
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        data: [
          "2018-9-12",
          "2018-9-13",
          "2018-9-14",
          "2018-9-15",
          "2018-9-16",
          "2018-9-17",
          "2018-9-18",
          "2018-9-19",
          "2018-9-20"
        ]
      },
      yAxis: {
        // data:[]
      },
      legend: {
        type: "plain",
        bottom: "0",
        selectedMode: false
      },

      series: []
    });
  },
  
  //移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  components: {
    TableSettings,
    simpleTable
  }
};
</script>

<style scoped>
.location {
  position: fixed;
  top: 0;
  z-index: 9999;
}
.warp {
  position: relative;
  margin-left: 10px;
}
.warp_content {
  position: absolute;
  z-index: 999;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin-left: 8px;
  color: #aaafb2;
  cursor: pointer;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearFix {
  zoom: 1;
}
.clearFix::after {
  content: "";
  clear: both;
  display: block;
}
.distance {
  margin-bottom: 15px;
}

.chartCenter {
  margin: 10px 0px 10px 0px;
}
</style>


<style>
#reamTime_selectTable {
  margin-top: 20px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
.el-range-separator {
  padding: 0px !important;
}
</style>