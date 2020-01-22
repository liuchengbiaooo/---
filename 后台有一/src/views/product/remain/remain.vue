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
        <span class="warp_content">留存类别</span>
        <el-select v-model="yonghuClass" @change="classesList" placeholder="留存类别">
          <el-option
            v-for="item in remainList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ly-flex-1 fl warp">
        <span class="warp_content">用户类别</span>
        <el-select v-model="tieGranularity" placeholder="用户类别" @change="category">
          <el-option
            v-for="item in LTVcategory"
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

      <div class="ly-flex-1 fl warp" @click=" grabble">
        <el-button type="primary">搜索</el-button>
      </div>

      <div class="ly-flex-1 fl">
        <HelpDocument :help="help"></HelpDocument>
      </div>
    </div>
    <div>
      <div class="ly-flex-1">
        <el-checkbox-group v-model="checkItem" size="medium" @change="checkTableItem">
          <el-checkbox-button
            v-for="item in selectList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          >{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
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
          >{{item.label+'日留存'}}</el-checkbox-button>
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
      <el-row id="realTime_operate_tab">
        <div id="tabHeighe">
          <el-table
            :data="tableData"
            border
            height="tableHeight"
            style="width:100%"
            ref="table"
            class="table"
            id="tableHeight"
            :header-cell-style="{'user-select': 'text'}"
          >
            <el-table-column prop="date" label="日期" align="center" width="150"></el-table-column>
            <el-table-column prop="productName" label="产品" align="center" width="120"></el-table-column>
            <el-table-column prop="classes" label="新增" align="center" width></el-table-column>
            <el-table-column prop="one_login_per" label="一阶登陆比" align="center" width></el-table-column>
            <el-table-column prop="two_login_per" label="二阶登陆比" align="center" width></el-table-column>
            <el-table-column
              :label="item+'日留存'"
              width="180"
              v-for="(item,index) in selectTableList"
              :key="index"
              align="center"
              border
            >
              <template slot-scope="scope">
                <span v-if="scope.row.keep[index]">
                  <span style="margin-left: 10px">{{scope.row.keep[index].retention}}</span>
                </span>
                <!-- scope.row.keep[index].retention -->
              </template>
            </el-table-column>
            <!-- <template v-for="item in selectTableList">
          <el-table-column :key="item" prop :label="item+'日留存'" align="center" width></el-table-column>
            </template>-->
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { channels, mockRetentions } from "@/api/realtime";
import HelpDocument from "@/components/HelpDocument";
import { retentionRate, titleRate } from "@/api/product";
import { getBeforeDate, getMyDay } from "@/utils/newDate";
import { allWatermark } from "@/utils/allWatermark"; //水印
export default {
  name: "remain",
  data() {
    return {
      proList: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
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
      selectTableList: [],
      statusOptions: [],
      selectP: "",
      channelSelect: [],
      systemCon: "all",
      yonghuClass: "login",
      tieGranularity: "role",
      tableData: [],
      tableHeight: 0,
      selectDate: [],
      days: "",
      LTVcategory: [
        {
          label: "角色留存",
          value: "role"
        },
        {
          label: "账号留存",
          value: "account"
        },
        {
          label: "设备留存",
          value: "equipment"
        }
      ],
      remainList: [
        {
          label: "新增",
          value: "login"
        },
        {
          label: "新增付费",
          value: "pay"
        }
      ],
      checkItem: ["次日~7日"],
      selectList: [
        { label: "次日~7日", value: "2~7" },
        { label: "8日~15日", value: "8~15" },
        { label: "16日~29日", value: "16~29" },
        { label: "30日", value: "30" },
        { label: "60日", value: "60" },
        { label: "90日", value: "90" },
        { label: "120日", value: "120" },
        { label: "150日", value: "150" },
        { label: "180日", value: "180" }
      ],

      checkItemTwo: [1],
      checkItemList: [
        { label: 1, value: "1" },
        { label: 3, value: "3" },
        { label: 5, value: "5" },
        { label: 7, value: "7" },
        { label: 15, value: "15" },
        { label: 30, value: "30" },
        { label: 60, value: "60" },
        { label: 90, value: "90" },
        { label: 120, value: "120" },
        { label: 150, value: "150" },
        { label: 180, value: "180" }
      ],
      replaceChannel: "all", //渠道
      help: {
        name: "留存分析",
        data: [
          {
            name: "新增",
            address: "新增数，根据用户类别分别按角色、账号、设备"
          },
          {
            name: "一阶登录比",
            address: "登录比留存用户 / 登录比有效用户"
          },
          {
            name: "二阶登录比",
            address: "二阶段登录比留存用户 / 二阶段登录比有效用户"
          },
          {
            name: "登录比留存用户",
            address: "从用户首次登录（含注册）为节点，一周内登录3天或以上的用户"
          },
          {
            name: "二阶段登录比有效用户	",
            address:
              "新增用户中注册前7日内有不少于3天登录行为的用户（登录比留存用户）"
          },
          {
            name: "二阶段登录比留存用户	",
            address: "二阶段登录比有效用户中，在8-14日有登录行为的用户"
          }
        ]
      }
    };
  },
  watch: {
    tableData(val) {
      if (val.length > 0) {
        let arr = [1];
        this.preserve(arr); //数据拿到，构建图表
      }
    }
  },
  computed: {
    ...mapGetters(["productList", "pickerOptions"])
  },
  methods: {
    //滚动事件
    handleScroll() {
      var clients =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight; //滚动距离
      let topSize = document.getElementById("tabHeighe").getBoundingClientRect()
        .top;
      var tableheiht = document.getElementById("tableHeight");
      let headSizeTwo = document.getElementById("head");
      if (topSize <= 0) {
        this.tableHeight = clients - 80;
        tableheiht.style.height = clients - 80 + "px";
      }
      let topSizeTwo = topSize - 80;
      if (topSizeTwo <= 0) {
        headSizeTwo.classList.add("location");
      } else {
        headSizeTwo.classList.remove("location");
      }
    },
    range(arrList, start, end) {
      if (end) {
        for (var i = start; i <= end; i++) {
          arrList.push(i);
        }
      } else {
        arrList.push(start);
      }
      return arrList;
    },
    clear(filter) {
      if (filter == "次日") {
        return 1;
      } else {
        return filter.slice(0, filter.indexOf("日"));
      }
    },
    checkTableItem() {
      //点击按键拿到的数组
      this.selectTableList = [];
      var aa;
      for (var item of this.checkItem) {
        aa = this.clear(item.split("~"));
        if (item.split("~").length >= 2) {
          this.selectTableList = this.range(
            this.selectTableList,
            Number(this.clear(item.split("~")[0])),
            Number(this.clear(item.split("~")[1]))
          );
        } else {
          this.selectTableList = this.range(
            this.selectTableList,
            Number(this.clear(item.split("~")[0]))
          );
        }
      }
      this.selectTableList.sort(function(a, b) {
        //数组进行排序
        return a - b;
      });
      let list;
      list = this.selectTableList.join(); //转化成字符串
      this.days = list;
      //用户点击日期tab进行发请求
      this.gameRetention();
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
          "留存分析" + `.` + type
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
      //const result = await channels(this.selectP);
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
      //this.gameRetention();
    },

    //用户点击选择渠道
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }

      this.channelSelect = event;

      //this.gameRetention();
    },

    //用户点击选择操作系统
    system(event) {
      this.systemCon = event;
    },

    //用户点击选择类别
    classesList(event) {
      this.yonghuClass = event;
      //this.gameRetention();
    },

    //用户选择时间
    choose(event) {
      this.selectDate = event;
      //this.gameRetention();
    },

    //用户选择留存类型
    category(event) {
      this.tieGranularity = event;
      this.gameRetention();
    },
    //用户点击搜索
    grabble() {
      //this.days = "1,2,3,4,5,6,7";
      // (this.checkItem = ["次日~7日"]), //this.checkTableItem();
      this.gameRetention();
      allWatermark();
    },

    //用户选择中间title
    preserve(event) {
      var titleList = event;

      const tableData = this.tableData;

      let xDate = [];
      let series = [
        {
          name: "1日留存",
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
          name: "3日留存",
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
          name: "5日留存",
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
          name: "7日留存",
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
        },
        {
          name: "15日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#A2CFBB"
          },
          areaStyle: {
            color: "rgba(162,207,187,0.3)",
            origin: "start"
          }
        },
        {
          name: "30日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#81A88E"
          },
          areaStyle: {
            color: "rgba(129,168,142,0.3)",
            origin: "start"
          }
        },
        {
          name: "60日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#D9A85F"
          },
          areaStyle: {
            color: "rgba(217,168,95,0.3)",
            origin: "start"
          }
        },
        {
          name: "90日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#C6AFA8"
          },
          areaStyle: {
            color: "rgba(198,175,168,0.3)",
            origin: "start"
          }
        },
        {
          name: "120日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#75777C"
          },
          areaStyle: {
            color: "rgba(117,119,124,0.3)",
            origin: "start"
          }
        },
        {
          name: "150日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#728189"
          },
          areaStyle: {
            color: "rgba(114,129,137,0.3)",
            origin: "start"
          }
        },
        {
          name: "180日留存",
          type: "line",
          smooth: true,
          data: [],
          lineStyle: {
            color: "#CAD1D7"
          },
          areaStyle: {
            color: "rgba(202,209,215,0.3)",
            origin: "start"
          }
        }
      ];
      titleList.forEach(title => {
        tableData.forEach(item => {
          if (xDate.length < tableData.length) {
            xDate.unshift(item.date);
          }
          series.forEach(tm => {
            if (tm.name == title + "日留存") {
              tm.name = title + "日留存";
              if (item.keep[title - 1] == undefined) {
                tm.data = [0.0];
              } else {
                var dist = parseFloat(item.keep[title - 1].retention);
                tm.data.unshift(dist);
              }
            }
          });
        });
      });
      this.setAllOption(xDate, series);
    },

    //查询游戏的留存率
    gameRetention() {
      var appid = this.selectP;
      var start_date = this.selectDate[0];
      var end_date = this.selectDate[1];
      var system = this.systemCon;
      var channel = this.replaceChannel; //渠道
      var day = this.days;
      var type = this.yonghuClass;
      var result = [];
      var appid; //产品
      var channels; //渠道
      var time; //星期
      var productName; //匹配的产品名
      var retention; //加工留存率
      var classes; //新增 角色或账号或设备
      var classes_remain; // 角色或账号或设备
      retentionRate(appid, start_date, end_date, system, channel, day, type)
        .then(response => {
          this.tableData = [];
          result = response.info.data.list;
          this.productList.forEach(item => {
            //加上产品
            if (item.appId == this.selectP) {
              productName = item.appName;
            }
          });

          // if (result.length == 0) {
          //   //当用户选择时间时，返回空数组
          //   var arr = {};
          //   arr.day = 1;
          //   arr.retention = "";
          //   arr.role_per = "";
          //   arr.role_keep = "";
          //   var derk = {};
          //   derk.keep = [];
          //   derk.productName = productName;
          //   derk.date = this.selectDate[0];
          //   derk.role_create = 0;
          //   derk.account_create = 0;
          //   derk.device_create = 0;
          //   derk.keep.push(arr);
          //   result.push(derk);
          // }
          //设置表格高度

          var tableheiht = document.getElementById("tableHeight");
          var tableTop = document
            .getElementById("tabHeighe")
            .getBoundingClientRect().top;
          var viewportHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 40; //40
          if (result.length > 15) {
            //对数据进行判断 如果 数据过大 给宽度
            this.tableHeight = 1000;
            tableheiht.style.height = 1000 + "px";
          } else {
            this.tableHeight = tableHeight;
            tableheiht.style.height = tableHeight + "px";
          }

          result.forEach(item => {
            //给一个数据加上产品与渠道信息
            item.productName = productName;
            time = getMyDay(new Date(item.date)); //时间
            item.date = item.date + time;
            item.one_login_per =
              item.one_login_per +
              `%` +
              `(` +
              item.effective_user +
              `/` +
              item.keep_user +
              `)`;
            item.two_login_per =
              item.two_login_per +
              `%` +
              `(` +
              item.second_effective_user +
              `/` +
              item.second_keep_user +
              `)`;

            if (this.tieGranularity == "role") {
              item.classes = item.role_create;
            } else if (this.tieGranularity == "account") {
              item.classes = item.account_create;
            } else if (this.tieGranularity == "equipment") {
              item.classes = item.device_create;
            }

            item.keep.forEach(cont => {
              //加上百分号 对空的不处理
              if (this.tieGranularity == "role") {
                //判断目前的流程类型,对返回数据加工
                cont.retention =
                  cont.role_per + `%` + `(` + cont.role_keep + `)`;
              } else if (this.tieGranularity == "account") {
                cont.retention =
                  cont.account_per + `%` + `(` + cont.account_keep + `)`;
              } else if (this.tieGranularity == "equipment") {
                cont.retention =
                  cont.device_per + `%` + `(` + cont.device_keep + `)`;
              }
            });
          });

          this.selectTableList.forEach(die => {
            //拿到tab数组进行对加工 没有返回数据的 给空
            var arr = {};
            arr.day = die;
            arr.retention = "";
            result.forEach(item => {
              if (item.keep[die - 1] == undefined) {
                item.keep.push(arr);
              }
            });
          });
          this.tableData = result;
          this.statusOptions = result[0].keep;
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
    this.checkTableItem();
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
    HelpDocument
  }
};
</script>

<style scoped>
.location {
  position: fixed;
  top: 0;
  z-index: 9999;
}
.export {
  margin-top: 50px;
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

