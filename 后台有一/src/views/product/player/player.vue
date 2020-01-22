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
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">渠道选择</span>
        <el-select
          v-model="channelSelect"
          @change="channel"
          placeholder="请选择渠道"
          filterable
          multiple
        >
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.partnerName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
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
        <span class="warp_content">区服选择</span>
        <el-select v-model="areaClothings" @change="area" placeholder="请选择区服">
          <el-option
            v-for="item in areaList"
            :key="item.serverId"
            :label="item.serverId"
            :value="item.serverId"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <el-date-picker
          v-model="selectDate"
          type="date"
          placeholder="选择日期"
          @change="choose"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="ly-flex-1 fl warp">
        <TableSettings
          :checkedCities="checkedCities"
          :checked="checked"
          @handleCheckedCitiesChange="handleCheckedCitiesChange"
        ></TableSettings>
      </div>
      <div class="ly-flex-1 fl warp" @click="grabble">
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div id="chart" :style="{height: '300px'}"></div>
    <div class="export">
      <div class="derive">
        <ul class="warp">
          <li @click="exportExcel('csv')">CSV</li>
          <li @click="exportExcel('xlsx')">Excel</li>
        </ul>
      </div>
      <el-row id="realTime_operate_tab">
        <div id="tabHeighe">
          <simpleTable
            :tableData="tableData"
            :tableHeader="this.tableHeader"
            :tableHeight="tableHeight"
            class="table"
          ></simpleTable>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import TableSettings from "@/components/TableSettings";
import simpleTable from "@/components/SimpleTable";
import { gamersAre, district } from "@/api/product";
import { newDate } from "@/utils/newDate";
import { mapGetters } from "vuex";
import { allWatermark } from "@/utils/allWatermark"; //水印
export default {
  props: {},
  data() {
    return {
      areaClothings: "",
      areaList: [],
      selectDate: "",
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      channelSelect: "",
      proList: [],
      selectP: "",
      replaceChannel: "all",
      systemCon: "all",
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
      tableData: [],
      tableHeight:0,
      tableHeader: [
        { isShow: true, label: "等级", prop: "level" },
        { isShow: true, label: "人数", prop: "number" },
        { isShow: true, label: "百分比", prop: "percent" },
        { isShow: true, label: "相对流失比例", prop: "rlr" },
        { isShow: true, label: "绝对流失比例", prop: "alr" }
      ],
      checkedCities: ["等级", "人数", "百分比", "相对流失比例", "绝对流失比例"],
      checked: [
        { label: "等级", disabled: "disabled" },
        { label: "人数" },
        { label: "百分比" },
        { label: "相对流失比例" },
        { label: "绝对流失比例" }
      ],
      max: 0
    };
  },
  computed: {
    ...mapGetters(["productList"])
  },
  created() {},
  mounted() {
     window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.proList = this.productList;
    this.selectP = this.productList[0].appId;
    this.seletcPro(this.selectP); //渲染渠道列表
    const time = newDate();
    this.selectDate = time;
    this.gamersAreList();
    var realTimeChart = this.$echarts.init(document.querySelector("#chart"));
    realTimeChart.setOption({
      tooltip: {
        trigger: "axis"
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisPointer: {
            type: "shadow"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "百分比",
          min: 0,
          max: 40,
          interval: 10,
          axisLabel: {
            formatter: "{value} %"
          }
        }
      ],
      series: [
        {
          name: "人数",
          type: "line",
          itemStyle: {
            /*设置折线颜色*/
            normal: {
              //  color:'#c4cddc'
            }
          },
          data: []
        },
        {
          name: "百分比",
          type: "bar" /*设置柱状图颜色*/,
          // itemStyle: {
          //   normal: {
          //     color: "#A051F8",
          //     /*信息显示方式*/
          //     label: {
          //       show: true,
          //       position: "top",
          //       formatter: "{b}\n{c}"
          //     }
          //   }
          // },
          data: []
        }
      ]
    });
  },
  watch: {
    tableData() {
      this.chart();
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
          "玩家分布" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    setAllOption(xData, series, max) {
      const realTimeChart = this.$echarts.init(
        document.querySelector("#chart")
      );
      realTimeChart.setOption({
        yAxis: [
          {
            max: max,
            interval: 10,
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        xAxis: {
          data: xData
        },
        series: series
      });
    },
    chart() {
      const operateData = this.tableData;
      var xData = [];
      let series = [
        {
          name: "人数",
          type: "line",
          data: []
        },
        {
          name: "百分比",
          type: "bar" /*设置柱状图颜色*/,
          // itemStyle: {
          //   normal: {color: "#A051F8"}
          // },
          data: []
        }
      ];
      var seriesDataOne = [];
      var seriesDataTwo = [];
      var maxList = []; //最大百分比
      var max = 0;
      if (operateData.length > 0) {
        operateData.forEach(item => {
          xData.push(item.level + `级`);
          seriesDataOne.push(item.number);
          seriesDataTwo.push(item.percent);
          maxList.push(item.percent);
        });
        series[0].data = seriesDataOne;
        series[1].data = seriesDataTwo;
        var maxTwo = maxList.sort(function(a, b) {
          return b - a;
        })[0];
        let max = parseInt((maxTwo % 100) / 10) * 10 + 10; //x百分比最大值
        this.setAllOption(xData, series, max);
      } else {
        this.setAllOption(xData, series,max);
      }
    },
    //选择产品
    async seletcPro(evevt) {
      this.selectP = evevt;
      this.channelList = [
        {
          id: "all",
          partnerName: "全部"
        }
      ]; //先将数组还原
      this.channelSelect = ["all"]; //将渠道的id还原
      this.replaceChannel = "all"; //将参数渠道还原
      let newly = [];
      this.productList.forEach(item => {
        if (evevt == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);
      this.channelList = arr;
      let result = await district(this.selectP); //区服
      this.areaList = result.info.data.servers;
    },
    //选择渠道
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }
      this.channelSelect = event;
    },
    //选择区服
    area(evevt) {
      this.areaClothings = evevt;
    },
    //选择操作系统
    system(evevt) {
      this.systemCon = evevt;
    },
    grabble() {
      this.gamersAreList();
      allWatermark();
    },
    //选择时间
    choose(evevt) {
      this.selectDate = evevt;
    },
    gamersAreList() {
      var appid = this.selectP;
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var serverId = this.areaClothings;
      var date = this.selectDate;
      gamersAre(appid, date, system, channel, serverId)
        .then(response => {
          let result = response.info.data.list;
           var tableTop = document.getElementById("tabHeighe").getBoundingClientRect().top;
          var viewportHeight = document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 20;
          if(result.length > 15){
            this.tableHeight = 1000
          }else{
            this.tableHeight = tableHeight;
          }
          this.tableData = result;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  //移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  components: {
    simpleTable,
    TableSettings
  }
};
</script>

<style scoped lang="scss">
.location {
  position: fixed;
  top: 0;
  z-index: 9999;
}
.map {
  display: flex;
  justify-content: space-evenly;
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
#realTime_operate_tab {
  margin-top: 20px;
}
</style>
