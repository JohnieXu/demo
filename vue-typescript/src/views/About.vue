<template>
  <div class="about">
    <h1>This is an about page</h1>
    <c-table :tableData="tableData"></c-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CTable from '@/components/Table';
@Component({
  components: {
    CTable,
  },
  data() {
    return {
      tableData: ['测试1'],
    };
  },
})
export default class About extends Vue {}
</script>
