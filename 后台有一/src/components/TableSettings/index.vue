<template>
  <div>
    <el-popover placement="bottom" width="300" trigger="click">
      <el-checkbox-group v-model="checkedCitie" @change="handleCheckedCitiesChange">
        <el-checkbox
          v-for="(city,index) in checked"
          :label="city.label"
          :key="index"
          :disabled="city.disabled"
        >{{city.label}}</el-checkbox>
      </el-checkbox-group>
      <el-button slot="reference" type="primary">表格设置</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: ['checkedCities','checked'],
  data() {
    return {
       checkedCitie:[]
    };
  },
  computed: {
  },
  created() {},
  mounted() {
      this.checkedCitie = this.checkedCities
  },
  watch: {},
  methods: {
    handleCheckedCitiesChange(value) {
      let btn = value;
      this.$emit('handleCheckedCitiesChange',btn)
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
