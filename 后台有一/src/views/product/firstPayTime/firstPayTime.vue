<template>
  <div class="ly-flex">
    <div class="clearFix distance">
      <div class="ly-flex-1 fl warp" style="margin-left: 0px;">
        <span class="warp_content">产品选择</span>
        <el-select v-model="channelCon" @change="seletcPro" placeholder="产品数据" filterable>
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
        <el-select v-model="userClassify" @change="changeClassify" placeholder="用户类型">
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
          v-model="selectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="choose"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>

      <!-- <div class="ly-flex-1 fl warp">
        <TableSettings
          :checkedCities="checkedCitieList"
          :checked="checkedList"
          @handleCheckedCitiesChange="handleCheckedCitiesChange"
        ></TableSettings>
      </div>-->

      <div class="ly-flex-1 fl warp" @click="grabble">
        <el-button type="primary">搜索</el-button>
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
        <div id="selectTable">
          <el-table
            :data="tableData"
            border
            ref="table"
            class="table"
            id="tableHeight"
            height="tableheiht"
            :header-cell-style="{'user-select': 'text'}"
          >
            <el-table-column prop="date" label="日期" align="center" width="125"></el-table-column>
            <el-table-column prop="registers" label="当天注册人数" align="center" width="120"></el-table-column>
            <el-table-column prop="pays" label="付费数" align="center" width></el-table-column>
            <el-table-column
              :label="item + '天'"
              width="180"
              v-for="(item,index) in statusOptions"
              :key="index"
              align="center"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{scope.row.day[index]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { newDate, getBeforeDate } from "@/utils/newDate";
import { mapGetters } from "vuex";
import { fistPayTime } from "@/api/product";
import { allWatermark } from "@/utils/allWatermark"; //水印
export default {
  props: {},
  data() {
    return {
      channelCon: "",
      proList: [],
      channelSelect: "",
      channelList: [],
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
      userClassify: "role",
      userlist: [
        {
          value: "device",
          label: "设备"
        },
        {
          value: "role",
          label: "角色"
        },
        {
          value: "account",
          label: "账号"
        }
      ],
      selectDate: [],
      tableheiht:500,
      replaceChannel: "all",
      tableData: [],
      statusOptions: []
    };
  },
  computed: {
    ...mapGetters(["productList", "pickerOptions"])
  },
  created() {},
  mounted() {
    this.dayNubmer(); //日期
    this.proList = this.productList;
    this.channelCon = this.productList[0].appId;
    this.seletcPro(this.channelCon); //渲染渠道列表
    const time = newDate();
    const eightDays = getBeforeDate(8);
    this.selectDate = [eightDays, time]; //默认时间
    //this.paytime();
  },
  watch: {},
  methods: {
    //天数
    dayNubmer() {
      var arr = new Array(30);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = i + 1;
      }
      this.statusOptions = arr;
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
          "首次付费时间分布" + `.` + type
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //用户选择产品
    seletcPro(env) {
      this.channelCon = env;
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
        if (env == item.appId) {
          newly.push(item.channel);
        }
      });
      const arr = this.channelList.concat(...newly);
      this.channelList = arr;
    },
    //渠道选择
    channel(event) {
      if (event.indexOf("all") == "-1") {
        //选择了全部 传all就行
        let channel = event.join(",");
        this.replaceChannel = channel;
      } else {
        this.replaceChannel = "all";
      }

      this.channelSelect = event; //多选必须是数组
    },
    //操作系统
    system(event) {
      this.systemCon = event;
    },
    //用户类型
    changeClassify(env) {
      this.userClassify = env;
    },
    //时间选择
    choose(event) {
      this.selectDate = event;
    },
    //搜索
    grabble() {
      this.paytime();
      allWatermark();
    },
    //付费时间
    paytime() {
      var appid = this.channelCon;
      var channel = this.replaceChannel; //渠道
      var system = this.systemCon;
      var type = this.userClassify;
      var start_date = this.selectDate[0];
      var end_date = this.selectDate[1];
      fistPayTime(appid, start_date, end_date, type, system, channel)
        .then(response => {
          let result = response.info.data.list;
           var tableheiht = document.getElementById("tableHeight");
            var tableTop = document
              .getElementById("selectTable")
              .getBoundingClientRect().top;
            var viewportHeight =
              document.documentElement.clientHeight ||
              document.body.clientHeight;
            var tableHeight = viewportHeight - tableTop - 20; //40
         
            this.tableHeight = tableHeight;
            tableheiht.style.height = tableHeight + "px";
          
          this.tableData = result;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
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
.paging {
  position: absolute;
  right: 0;
}
.chartCenter {
  margin: 10px 0px 10px 0px;
}
</style>

<style>
.el-range-separator {
  padding: 0px !important;
}
</style>

