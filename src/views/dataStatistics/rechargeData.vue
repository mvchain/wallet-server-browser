<template>
  <div class="recharge-data">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          unlink-panels
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
        <el-button @click="importFun">表格导出</el-button>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="time"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="founds"
          label="充值金额">
        </el-table-column>
        <el-table-column
          prop="order"
          label="订单数">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="50">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'rechargeData',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        rechargeTime: '',
        searchText: '',
        tableData: [
          {
            time: '2017/01/11',
            founds: '2000ETH',
            order: '123'
          },
          {
            time: '2017/01/11',
            founds: '2000ETH',
            order: '123'
          },
          {
            time: '2017/01/11',
            founds: '2000ETH',
            order: '123'
          }
        ]
      }
    },
    methods: {
      importFun() {
        console.log(this.rechargeTime)
      },
      handleCurrentChange(t) {
        console.log(t)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge-data {
    padding: 20px;
  }
</style>
