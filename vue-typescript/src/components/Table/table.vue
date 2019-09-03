<template>
  <div class="table">
    <p>{{ JSON.stringify(tableData) }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

type TableData = {
  title: string,
  data: string[] | TableCellData[],
};

type TableCellData = {
  subtitle: string,
  children: Array<{
    main_leader: string, // 主要领导
    main_phone: number, // 主要领导联系方式
    main_duty: string, // 主要领导职务
    connector_name: string, // 联络员姓名
    connector_phone: number, // 联络员联系方式
    connector_duty: string, // 联络员职务
  }>,
};

@Component
export default class HelloWorld extends Vue {
  @Prop() private tableData!: TableData[];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.table {}
</style>
