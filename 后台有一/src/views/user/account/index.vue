<template>
  <div>
    <el-row id="realTime_operate_table">
      <el-table :data="operateData" border style="width:100%" ref="table">
        <el-table-column prop label="设备号" align="center" width></el-table-column>
        <el-table-column prop label="账号(微信号)" align="center" width></el-table-column>
        <el-table-column prop label="性别" align="center" width></el-table-column>
        <el-table-column prop label="年龄" align="center" width></el-table-column>
        <el-table-column prop label="设备机型" align="center" width></el-table-column>
        <el-table-column prop label="城市位置分布" align="center" width></el-table-column>
        <el-table-column prop label="手机号" align="center" width></el-table-column>
        <el-table-column prop label="邮箱" align="center" width></el-table-column>
        <el-table-column prop label="IP" align="center" width></el-table-column>
        <el-table-column prop label="IP地址" align="center" width></el-table-column>
        <el-table-column prop label="付费金额" align="center" width></el-table-column>
        <el-table-column prop label="玩过的应用类型" align="center" width></el-table-column>
        <el-table-column prop label="平台注册时间" align="center" width></el-table-column>
        <el-table-column prop label="最后一次登录时间" align="center" width></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      operateData: []
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
</style>

