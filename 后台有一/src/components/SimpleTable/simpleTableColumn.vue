<template>
  <div>
    <!-- :sortable='true' :sort-method="sortChange" -->
    <el-table-column v-if="columnInfo.isShow" :label="columnInfo.label" align="center" :width="columnInfo.width"> 
      <template slot-scope="scope">
        <span>
          <template>{{ getText(scope.row, columnInfo.prop) }}</template>
        </span>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  props: {
    columnInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
  },
  watch: {},
  methods: {
    getText(row, prop) {
      try {
        return eval("row." + prop);
      } catch (error) {}
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
