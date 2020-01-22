<template>
  <div class="ly-flex ssss">
    <div class="clearFix distance" id="head">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="channelCon" @change="seletcPro" placeholder="产品选择" filterable>
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
        <el-select v-model="channelSelect" @change="channel" placeholder="渠道名" filterable multiple>
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
        <el-select v-model="operateSystem" @change="system" placeholder="操作系统">
          <el-option
            v-for="item in systemList"
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
          <el-checkbox-button v-for="item in selectList" :label="item" :key="item">LTV{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
    </div>
    <div>
      <div id="chart" :style="{height:'300px'}"></div>
    </div>

    <div class="chartCenter" style="margin-left:420px">
      <div class="ly-flex-1">
        <el-checkbox-group v-model="checkItemTwo" size="medium" @change="LTVanalyze">
          <el-checkbox-button v-for="item in checkItemList" :label="item" :key="item">LTV{{item}}</el-checkbox-button>
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
      <el-row>
        <div id="tabHeighe">
          <el-table
            :data="tableData"
            border
            ref="table"
            height="tableHeight"
            class="table"
            id="tableHeight"
            :header-cell-style="{'user-select': 'text'}"
            :default-sort="{prop: 'date', order: 'descending'}"
          >
            <el-table-column prop="date" label="日期" align="center" width="125"></el-table-column>
            <el-table-column prop="productName" label="产品" align="center" width="120"></el-table-column>
            <el-table-column prop="classes" label="新增" align="center" width></el-table-column>

            <el-table-column
              :label="'LTV'+item"
              width="180"
              v-for="(item,index) in selectTableList"
              :key="index"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.ltv[index]">
                  <span style="margin-left: 10px">{{scope.row.ltv[index].classes_ltv}}</span>
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              :label="'LTV'+item.day"
              width="180"
              v-for="(item,index) in statusOptions"
              :key="index"
              align="center"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{scope.row.ltv[index].classes_ltv}}</span>
              </template>
            </el-table-column>-->

            <!-- <template v-for="(item,index) in statusOptions">
          <el-table-column width="120" :label="'LTV'+item.day" :prop="item.end_date" :key="index"></el-table-column>
            </template>-->
            <!-- <el-table-column v-for="(item,index) in statusOptions" :key="index" :prop="item.labelVlaue" :label="'LTV'+item.time" align="center" width=''></el-table-column> -->
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getGameLTV, channels } from "@/api/realtime";
import HelpDocument from "@/components/HelpDocument";
import { gameLtv } from "@/api/product";
import { getToken } from "@/utils/auth";
import { allWatermark } from "@/utils/allWatermark"; //水印
import { newDate, getBeforeDate, getMyDay } from "@/utils/newDate";

export default {
  name: "analyze",
  data() {
    return {
      tabSel: "",
      statusOptions: [],
      tableData: [],
      tableHeight: 0,
      productSelect: "",
      channelSelect: [],
      operateSystem: "all",
      tieGranularity: "role",
      selectTime: "",
      channelCon: "",
      proList: [],
      selectTable: [],
      days: "",
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
      LTVcategory: [
        {
          label: "角色LTV",
          value: "role"
        },
        {
          label: "账号LTV",
          value: "account"
        },
        {
          label: "设备LTV",
          value: "equipment"
        }
      ],
      selectTableList: [],
      selectDate: [],
      channelList: [
        {
          id: "all",
          partnerName: "全部"
        }
      ],
      token: getToken(),
      checkItem: ["1~7", "8~14", "15", "30", "60", "90", "180"],
      selectList: [
        "1~7",
        "8~14",
        "15",
        "16~29",
        "30",
        "31~59",
        "60",
        "61~89",
        "90",
        "91~119",
        "120",
        "121~149",
        "150",
        "151~179",
        "180"
      ],

      checkItemTwo: ["1"],
      checkItemList: [
        "1",
        "3",
        "5",
        "7",
        "15",
        "30",
        "60",
        "90",
        "120",
        "150",
        "180"
      ],
      replaceChannel: "all",
      help: {
        name: "LTV分析",
        data: [
          {
            name: "新增",
            address: "新增数，根据用户类别分别按角色、账号、设备"
          }
        ]
      }
    };
  },
  watch: {
    tableData(val) {
      if (val.length > 0) {
        let arr = [1];
        this.LTVanalyze(arr); //数据拿到，构建图表
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
    checkTableItem() {
      this.selectTableList = [];
      for (var i of this.checkItem) {
        if (i.split("~").length >= 2) {
          this.selectTableList = this.range(
            this.selectTableList,
            Number(i.split("~")[0]),
            Number(i.split("~")[1])
          );
        } else {
          this.selectTableList = this.range(
            this.selectTableList,
            Number(i.split("~")[0])
          );
        }
      }
      this.selectTableList.sort(function(a, b) {
        //数组进行排序
        return a - b;
      });
      var list;
      console.log("list", this.selectTableList);
      list = this.selectTableList.join(); //转化成字符串
      this.days = list;
      //用户点击日期tab进行发请求
      this.queryTheGame();
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
          "LTV分析" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //用户点击中间的按钮
    LTVanalyze(evevt) {
      var titleList = evevt;
      const tableData = this.tableData;

      let xDate = [];
      let series = [
        {
          name: "LTV1",
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
          name: "LTV3",
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
          name: "LTV5",
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
          name: "LTV7",
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
          name: "LTV15",
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
          name: "LTV30",
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
          name: "LTV60",
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
          name: "LTV90",
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
          name: "LTV120",
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
          name: "LTV150",
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
          name: "LTV180",
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
            if (tm.name == "LTV" + title) {
              tm.name = "LTV" + title;
              if (item.ltv[title - 1] == undefined) {
                tm.data = [0.0];
              } else {
                var dist = parseFloat(item.ltv[title - 1].classes_ltv);
                tm.data.unshift(dist);
              }
            }
          });
        });
      });
      this.setAllOption(xDate, series);
    },
    //类别选择后发生的事件
    category(evevt) {
      this.tieGranularity = evevt;
      //this.queryTheGame();
    },

    //用户点击选择产品
    async seletcPro(evevt) {
      this.channelCon = evevt;
      //获取渠道信息
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
      //this.queryTheGame()
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
      this.channelSelect = evevt;
      //this.queryTheGame();
    },

    //用户选择操作系统
    system(evevt) {
      this.operateSystem = evevt;
      //this.queryTheGame();
    },

    //用户选择了时间
    choose(evevt) {
      this.selectDate = evevt;
    },
    //用户点击搜索
    grabble() {
      this.queryTheGame();
      allWatermark();
    },

    //查询游戏的ltv
    queryTheGame() {
      var appid = this.channelCon;
      var start_date = this.selectDate[0];
      var end_date = this.selectDate[1];
      var system = this.operateSystem;
      var channel = this.replaceChannel;
      var day = this.days;

      var result = [];
      var classes; //新增 角色或账号或设备
      var classes_ltv; // 角色或账号或设备 Ltv值
      var appid; //产品
      var channels; //渠道
      var time; //星期
      var productName; //匹配的产品名
      gameLtv(appid, start_date, end_date, system, channel, day)
        .then(response => {
          appid = this.channelCon;
          channels = this.channelSelect;
          this.tableData = [];
          result = response.info.data.list;
          //设置表格高度

          var tableheiht = document.getElementById("tableHeight");
          var tableTop = document
            .getElementById("tabHeighe")
            .getBoundingClientRect().top;
          var viewportHeight =
            document.documentElement.clientHeight || document.body.clientHeight;
          var tableHeight = viewportHeight - tableTop - 40; //40
          this.tableHeight = 1000;
          tableheiht.style.height = 1000 + "px";
          if (result.length > 15) {
            //对数据进行判断 如果 数据过大 给宽度
            this.tableHeight = 1000;
            tableheiht.style.height = 1000 + "px";
          } else {
            this.tableHeight = tableHeight;
            tableheiht.style.height = tableHeight + "px";
          }
          this.productList.forEach(item => {
            //加上产品
            if (item.appId == this.channelCon) {
              productName = item.appName;
            }
          });

          if (result.length == 0) {
            //当用户选择时间时，返回空数组
            var arr = {};
            arr.day = 1;
            arr.retention = " ";
            arr.role_per = "";
            arr.role_keep = "";
            var derk = {};
            derk.keep = [];
            derk.productName = productName;
            derk.date = this.selectDate[0];
            derk.role_create = 0;
            derk.account_create = 0;
            derk.device_create = 0;
            derk.keep.push(arr);
            result.push(derk);
          }

          result.forEach(item => {
            //给每一个数据加上产品信息
            item.productName = productName;
            time = getMyDay(new Date(item.date)); //给日期加上星期几
            item.date = item.date + time;
            //给外面层设置
            if (this.tieGranularity == "role") {
              item.classes = item.role_create;
            } else if (this.tieGranularity == "account") {
              item.classes = item.account_create;
            } else if (this.tieGranularity == "equipment") {
              item.classes = item.device_create;
            }
            item.ltv.forEach(cont => {
              //给里面的层设置
              if (this.tieGranularity == "role") {
                cont.classes_ltv = cont.role_ltv;
              } else if (this.tieGranularity == "account") {
                cont.classes_ltv = cont.account_ltv;
              } else if (this.tieGranularity == "equipment") {
                cont.classes_ltv = cont.device_ltv;
              }
            });
          });

          this.selectTableList.forEach(die => {
            //拿到tab数组进行对加工 没有返回数据的 给空
            var arr = {};
            arr.day = die;
            arr.retention = "";
            result.forEach(item => {
              if (item.ltv[die - 1] == undefined) {
                item.ltv.push(arr);
              }
            });
          });

          this.statusOptions = result[0].ltv; //默认是给的第二个ltv的数据
          this.tableData = result;
          console.log("SSSS", this.statusOptions, this.tableData);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
    this.proList = this.productList;
    this.channelCon = this.productList[0].appId;
    this.seletcPro(this.channelCon);
    const time = newDate();
    const eightDays = getBeforeDate(8);
    this.selectDate = [eightDays, time]; //默认时间
    this.checkTableItem();

    var chart = this.$echarts.init(document.querySelector("#chart"));

    chart.setOption({
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
        // data:[加]
      },
      legend: {
        type: "plain",
        bottom: "0",
        selectedMode: false
      },

      series: []
    });

    //console.log("SSSS")
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
.chartCenter {
  margin: 10px 0px 10px 0px;
}
.distance {
  margin-bottom: 15px;
}
</style>
<style>
.el-range-separator {
  padding: 0px !important;
}
</style>
