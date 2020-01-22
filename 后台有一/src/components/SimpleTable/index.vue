<template>
  <div id="tabHeighe">
    <el-table
      ref="table"
      :data="tableData"
      border
      height="tabheight"
      style="width:100% ; user-select: text; overflow-y: auto"
      id="tableHeight"
      :highlight-current-row="false"
      :header-cell-style="{'user-select': 'text'}"
    >
      <el-table-column v-if="true" type="selection" width="1px"></el-table-column>
      <simple-table-column
        :column-info="column"
        v-for="(column, index) of tableHeader"
        :key="index"
      ></simple-table-column>
    </el-table>
  </div>
</template>

<script>
import simpleTableColumn from "./simpleTableColumn";
export default {
  props: {
    tableHeader: {
      type: Array,
      default: []
    },
    tableData: {
      type: Array,
      default: []
    },
    tableHeight: {
      type: Number
    }
  },
  data() {
    return {
      tabheight: 0
    };
  },
  computed: {},
  created() {},
  created() {},
  beforeMount() {},
  mounted() {
   window.addEventListener("scroll", this.handleScroll); //给window添加一个滚动滚动监听事件
  },
  watch: {
    tableHeight() {
      var tableheiht = document.getElementById("tableHeight");
      this.tabheight = this.tableHeight;
      tableheiht.style.height = this.tabheight + "px";
    }
  },
  methods: {
    handleScroll() {
      var topSize = document.getElementById("tabHeighe").getBoundingClientRect().top;
      var viewportHeight =document.documentElement.clientHeight || document.body.clientHeight;
      var tableheiht = document.getElementById("tableHeight");
      if (topSize <= 0) {
        this.tabheight = viewportHeight - 80;
        tableheiht.style.height = viewportHeight - 80 + "px";
      }
    }
  },
  //移除掉这个window添加的监听事件，要不然在别的界面也会出发滚动监听
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll); //  离开页面清除（移除）滚轮滚动事件
  },
  components: {
    simpleTableColumn
  }
};
</script>

<style scoped lang="scss">
</style>
