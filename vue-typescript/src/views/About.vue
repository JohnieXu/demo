<template>
  <div class="about">
    <h1>This is an about page</h1>
    <c-table :tableData="tableData"></c-table>
    <div id="echarts" ref="echarts"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-console */
import { Component, Vue } from 'vue-property-decorator';
import echarts from 'echarts';
import CTable from '@/components/Table';

@Component({
  components: {
    CTable,
  },
})
export default class About extends Vue {
  private foo: string = 'bar';
  private tableData: any[] = ['测试1'];
  private echartsSeries: any[] = [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20],
  }];
  private updateEchartsOptions(echartsSeries: any[]) {
    const echartsInstance = echarts.init(this.$refs.echarts as HTMLDivElement);
    // console.log(this.foo);
    echartsInstance.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: echartsSeries,
    });
  }
  private mounted() {
    const echartsInstance = echarts.init(this.$refs.echarts as HTMLDivElement);
    this.updateEchartsOptions(this.echartsSeries);
    const self = this;
    setTimeout(() => {
      const echartsSeries = [{
        name: '工资',
        type: 'bar',
        data: [8000, 9000, 1000, 11000, 12000, 13000],
      }];
      self.echartsSeries = echartsSeries;
      self.updateEchartsOptions(echartsSeries);
    }, 1000);
  }
}
</script>

<style lang="less" scoped>
#echarts {
  height: 400px;
}
</style>
