<template>
  <div class="helpDocument">
    <el-popover placement="left" width="500" trigger="manual" v-model="visible">
      <div class="helpDocument_text">{{help.name}}</div>
      <el-table :data="help.data" stripe :show-header="false">
        <el-table-column property="name" width="150"></el-table-column>
        <el-table-column property="address"></el-table-column>
      </el-table>
      <el-button slot="reference" @click="visible = !visible" type='info'>帮助</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    help:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.helpDocument{
    margin-left: 10px;
}
.helpDocument_text {
  height: 35px;
  background-color: #d3d0d0;
  font-size: 16px;
  line-height: 35px;
  padding-left: 8px;
  color: #302f2f;
  border-bottom: 1px solid #a09999;
}
</style>
