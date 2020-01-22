<template>
  <div class="ly-flex">
    <div class="clearFix distance">
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
        <span class="warp_content">用户类型</span>
        <el-select v-model="userClassify" placeholder="用户类型" @change="category">
          <el-option
            v-for="item in userlist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <el-date-picker
          v-model="selectDateTwo"
          type="date"
          placeholder="选择日期"
          @change="chooseTwo"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="ly-flex-1 fl warp" @click="grabble">
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="map">
      <div id="chart" :style="{height: '600px',width: '45%'}"></div>
      <el-row id="realTime">
        <el-table :data="tableDataTwo" border style="width:550px" ref="table">
          <el-table-column prop="name" label="城市" align="center" width></el-table-column>
          <el-table-column prop="value" label="用户数" align="center" width></el-table-column>
          <el-table-column prop="per" label="占比" align="center" width></el-table-column>
        </el-table>
      </el-row>
    </div>
    <el-row id="realTime_operate_tab">
      <el-table :data="tableData" border style="width:100%" ref="table">
        <el-table-column prop="name" label="城市" align="center" width></el-table-column>
        <el-table-column prop="value" label="用户数" align="center" width></el-table-column>
        <el-table-column prop="per" label="占比" align="center" width></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { newDate } from "@/utils/newDate";
import { mapGetters } from "vuex";
import { userArea } from "@/api/product";
import "../../../../node_modules/echarts/map/js/china.js";
import { allWatermark } from "@/utils/allWatermark";//水印
export default {
  props: {},
  data() {
    return {
      selectP: "",
      proList: [],
      channelSelect: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
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
      userlist: [
        {
          value: "create",
          label: "新增"
        },
        {
          value: "login",
          label: "活跃"
        }
      ],
      userClassify: "create",
      selectDateTwo: "",
      replaceChannel: "all",
      tableData: [],
      tableDataTwo: []
    };
  },
  computed: {
    ...mapGetters(["productList"])
  },
  created() {},
  mounted() {
    this.proList = this.productList;
    this.selectP = this.productList[0].appId;
    this.seletcPro(this.selectP); //渲染渠道列表
    const time = newDate();
    this.selectDateTwo = time;
    function randomData() {
      return Math.round(Math.random() * 500);
    }
    var mydata = [
      { name: "北京", value: 0 },
      { name: "天津", value: 0 },
      { name: "上海", value: randomData() },
      { name: "重庆", value: randomData() },
      { name: "河北", value: randomData() },
      { name: "河南", value: randomData() },
      { name: "云南", value: randomData() },
      { name: "辽宁", value: randomData() },
      { name: "黑龙江", value: randomData() },
      { name: "湖南", value: randomData() },
      { name: "安徽", value: randomData() },
      { name: "山东", value: randomData() },
      { name: "新疆", value: 222 },
      { name: "江苏", value: randomData() },
      { name: "浙江", value: randomData() },
      { name: "江西", value: randomData() },
      { name: "湖北", value: 0 },
      { name: "广西", value: randomData() },
      { name: "甘肃", value: randomData() },
      { name: "山西", value: randomData() },
      { name: "内蒙古", value: randomData() },
      { name: "陕西", value: randomData() },
      { name: "吉林", value: randomData() },
      { name: "福建", value: randomData() },
      { name: "贵州", value: randomData() },
      { name: "广东", value: randomData() },
      { name: "青海", value: randomData() },
      { name: "西藏", value: randomData() },
      { name: "四川", value: randomData() },
      { name: "宁夏", value: randomData() },
      { name: "海南", value: randomData() },
      { name: "台湾", value: randomData() },
      { name: "香港", value: randomData() },
      { name: "澳门", value: randomData() },
      { name: "南海诸岛", value: randomData() }
    ];
    var realTimeChart = this.$echarts.init(document.querySelector("#chart"));
    realTimeChart.setOption({
      backgroundColor: "#FFFFFF",
      tooltip: {
        trigger: "item"
      },
      visualMap: {
        show: false,
        x: "left",
        y: "bottom",
        splitList: [
          { start: 500, end: 600 },
          { start: 400, end: 500 },
          { start: 300, end: 400 },
          { start: 200, end: 300 },
          { start: 100, end: 200 },
          { start: 1, end: 100 },
          { start: 0, end: 0 }
        ],
        color: [
          "#0364C9",
          "#1276E3",
          "#2C86E5",
          "#4698ED",
          "#67ADF2",
          "#93C4F5",
          "#CBD8E5"
        ]
      },
      series: [
        {
          name: "",
          type: "map",
          mapType: "china",
          roam: false, //放大缩小
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false
                  }
                }
              }
            }
          ],
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          data: mydata
        }
      ]
    });
  },
  watch: {},
  methods: {
    setAllOption(mydata) {},
    //选择产品
    seletcPro(evevt) {
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
    //选择操作系统
    system(event) {
      this.systemCon = event;
    },
    //选择时间
    chooseTwo(event) {
      this.selectDateTwo = event;
    },
    //选择类型
    category(event) {
      this.userClassify = event;
    },
    //点击搜索
    grabble() {
      this.distribution();
      allWatermark();
    },
    //用户地区分布
    distribution() {
      var appid = this.selectP;
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var type = this.userClassify;
      var date = this.selectDateTwo;
      function randomData() {
        return Math.round(Math.random() * 500);
      }
       var mydata = [
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "上海", value: randomData() },
        { name: "重庆", value: randomData() },
        { name: "河北", value: randomData() },
        { name: "河南", value: randomData() },
        { name: "云南", value: randomData() },
        { name: "辽宁", value: randomData() },
        { name: "黑龙江", value: randomData() },
        { name: "湖南", value: randomData() },
        { name: "安徽", value: randomData() },
        { name: "山东", value: randomData() },
        { name: "新疆", value: 222 },
        { name: "江苏", value: randomData() },
        { name: "浙江", value: randomData() },
        { name: "江西", value: randomData() },
        { name: "湖北", value: 0 },
        { name: "广西", value: randomData() },
        { name: "甘肃", value: randomData() },
        { name: "山西", value: randomData() },
        { name: "内蒙古", value: randomData() },
        { name: "陕西", value: randomData() },
        { name: "吉林", value: randomData() },
        { name: "福建", value: randomData() },
        { name: "贵州", value: randomData() },
        { name: "广东", value: randomData() },
        { name: "青海", value: randomData() },
        { name: "西藏", value: randomData() },
        { name: "四川", value: randomData() },
        { name: "宁夏", value: randomData() },
        { name: "海南", value: randomData() },
        { name: "台湾", value: randomData() },
        { name: "香港", value: randomData() },
        { name: "澳门", value: randomData() },
        { name: "南海诸岛", value: randomData() }
      ];
      function compare(value) {
        return function(a, b) {
          var value1 = a[value];
          var value2 = b[value];
          return value2 - value1;
        };
      }
      let Arr = mydata.sort(compare("value"));
      let tableDataTwo = Arr.slice(0,8)
      this.tableDataTwo = tableDataTwo;
      userArea(appid, system, channel, type, date)
        .then(response => {
          let result = response.info.data.data;
          //this.tableData = result;
          this.tableData = mydata;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {}
};
</script>

<style scoped>
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
</style>

<style>
#realTime {
  margin-top: 80px;
  margin-right: 60px;
}
#realTime_operate_tab {
  margin-top: 20px;
}
.el-tabs__header {
  margin: 15px 0 0px;
}
.el-range-separator {
  padding: 0px !important;
}
</style>
