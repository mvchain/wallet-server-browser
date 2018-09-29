<template>
  <div class="recharge">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button>汇总导入</el-button>
        <el-button @click="dialogFormVisible = true">汇总导出</el-button>
      </el-col>
      <el-col :span="10">
        <el-select v-model="companyName" placeholder="请选择">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
        <el-button @click="importFun">表格导出</el-button>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="输入来源地址、交易哈希" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="time"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="company"
          label="商家">
        </el-table-column>
        <el-table-column
          prop="founds"
          label="充值金额">
        </el-table-column>
        <el-table-column
          prop="from"
          width="550"
          label="来源地址">
        </el-table-column>
        <el-table-column
          prop="hash"
          width="600"
          label="交易哈希">
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
    <el-dialog  width="400px" title="汇总导出设置" :visible.sync="dialogFormVisible">
      <el-checkbox v-model="checkStatus">是否彻底清空所有用户地址内余额</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportHandler">导 出</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'recharge',
    props: {
      permission: Number,
      manage: Object
    },
    data() {
      return {
        rechargeTime: '',
        dialogFormVisible: false,
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
        searchText: '',
        tableData: [
          {
            time: '2017/01/11',
            company: '京东商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            company: '淘宝商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            company: '蘑菇鸡商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            company: '大盘鸡商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            company: '啤酒鸭商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          },
          {
            time: '2017/01/11',
            company: '辣子鸡商城',
            founds: '2000ETH',
            from: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            hash: '0x96ab8901985b15f27a26e0f0b6fe1bba6aeb285268c604c6f8d556a400788bcf'
          }
        ],
        companyList: [
          {
            name: '全部商家',
            id: '1'
          },
          {
            name: '淘宝商家',
            id: '2'
          },
          {
            name: '京东商家',
            id: '3'
          }
        ],
        companyName: '1',
        checkStatus: '0',
      }
    },
    computed: {
      ...mapGetters({
        rwList: 'rwList'
      })
    },
    mounted() {
      this.getTableData('pageNum=1&pageSize=20&orderBy=created_at desc')
    },
    methods: {
      getTableData(payload) {
        this.$store.dispatch('getRWList', payload).then().catch()
      },
      exportHandler() {
        console.log(this.checkStatus)
      },
      importFun() {
      },
      handleCurrentChange(t) {
        console.log(t)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge {
    padding: 20px;
  }
</style>
