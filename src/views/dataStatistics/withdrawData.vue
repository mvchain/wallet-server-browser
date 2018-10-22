<template>
  <div class="recharge-data">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-dropdown style="padding-top:20px;">
          <span class="el-dropdown-link" >
            总充值金额<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>BTC总提币：{{btcTotal.btcAmount}}BTC</el-dropdown-item>
            <el-dropdown-item>ETH总提币：{{btcTotal.ethAmount}}ETH</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="3">
        <el-select @change="changeFun" v-model="companyName" placeholder="请选择">
          <el-option
            v-for="item in copyList.list"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="dateType" @change="changeType" placeholder="请选择">
          <el-option
            v-for="(v, k) in timeChange"
            :key="k"
            :label="v.name"
            :value="v.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <template>
          <el-date-picker
            v-model="rechargeTime"
            v-show="dateType === 0"
            type="daterange"
            align="right"
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </template>
        <el-date-picker
          v-model="rangeWeek[0]"
          v-show="dateType === 1"
          :clearable="false"
          type="week"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy 第 WW 周"
        >
        </el-date-picker>
        <el-date-picker
          v-model="rangeWeek[1]"
          v-show="dateType === 1"
          :clearable="false"
          type="week"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy 第 WW 周"
        >
        </el-date-picker>
        <template>
          <el-date-picker
            v-model="rangeMonth[0]"
            v-show="dateType === 2"
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
            type="month"
          >
          </el-date-picker>
          <el-date-picker
            v-model="rangeMonth[1]"
            v-show="dateType === 2"
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
            type="month"
          >
          </el-date-picker>
        </template>
        <el-button @click="resetSearch">重置</el-button>
        <el-button @click="exportTable">导出表格</el-button>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        @row-click="rowClick"
        :data="statisticsTable.list"
        border
        style="width: 100%">
        <el-table-column
          prop="dateStr"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="商户名">
        </el-table-column>
        <el-table-column
          prop="btcValue"
          label="BTC提币金额">
        </el-table-column>
        <el-table-column
          prop="ethValue"
          label="ETH提币金额">
        </el-table-column>
        <el-table-column
          prop="orderBtcCount"
          label="BTC订单数">
        </el-table-column>
        <el-table-column
          prop="orderEthCount"
          label="ETH订单数">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="statisticsTable.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { formatTime } from '@/utils'
  // import { getToken } from '@/utils/auth'
  export default {
    name: 'withdrawData',
    props: {
      permission: Number,
      manage: Object
    },
    computed: {
      ...mapGetters({
        statisticsTable: 'statisticsTable',
        copyList: 'copyList'
      })
    },
    watch: {
      'rechargeTime': function(v, o) {
        this.formatTime(this.rechargeTime, 'd')
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      },
      'rangeWeek': function() {
        this.formatTime(this.rangeWeek, 'w')
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      },
      'rangeMonth': function() {
        this.formatTime(this.rangeMonth, 'm')
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      }
    },
    data() {
      return {
        rechargeTime: [],
        rangeWeek: [],
        rangeMonth: [],
        dateType: 0,
        btcTotal: 0,
        startTime: '',
        stopTime: '',
        companyName: '',
        timeChange: [
          {
            name: '日数据',
            id: 0
          },
          {
            name: '周数据',
            id: 1
          },
          {
            name: '月数据',
            id: 2
          }
        ],
        balanceTitle: '',
        balanceList: [
          {
            title: 'BTC总提币：',
            value: '2'
          },
          {
            title: 'ETH总提币：',
            value: '1'
          }
        ]
      }
    },
    mounted() {
      this.formatTime(this.rechargeTime, 'd')
      // startTime=1&stopTime=2&shopId=3&fromAddress=4&toAddress=5&hash=6&oprType=7&transactionId=8&transactionStatus=9&shopWithdraw=10&pageNum=11&pageSize=12&orderBy=13
      this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      this.$store.dispatch('getTotalData', `oprType=withdraw&shopId=${this.companyName}`).then((res) => {
        this.btcTotal = res
      }).catch()
    },
    methods: {
      rowClick(r) {
        let startTime = ''
        let stopTime = ''
        if (r.dateStr.includes('至')) {
          startTime = r.dateStr.split('至')[0].replace(/-/ig, '/') + ' 0:0:0'
          stopTime = r.dateStr.split('至')[1].replace(/-/ig, '/') + ' 23:59:59'
        } else {
          if (r.dateStr.length > 7) {
            startTime = r.dateStr.replace(/-/ig, '/') + ' 0:0:0'
            stopTime = r.dateStr.replace(/-/ig, '/') + ' 23:59:59'
          } else {
            const mm = new Date(r.date).getMonth() + 1
            const yy = new Date(r.date).getFullYear()
            const temp = new Date(yy, mm, 0)
            startTime = formatTime(new Date(r.date)).split(' ')[0] + ' 0:0:0'
            stopTime = formatTime(temp).replace(/0:0:0/ig, '') + '23:59:59'
          }
        }
        this.$router.push({ path: '/rechargeWithdraw/withdraw', query: { startTime, stopTime }})
      },
      changeFun(v) {
        this.companyName = v
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
        this.$store.dispatch('getTotalData', `oprType=recharge&shopId=${this.companyName}`).then((res) => {
          this.btcTotal = res
        }).catch()
      },
      changeType(t) {
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${t}&oprType=withdraw`)
      },
      getTableData(payload) {
        this.$store.dispatch('getStatisticsData', payload).then().catch()
      },
      exportTable() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/transaction/count/export?sign=${s}&startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
        }).catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      },
      resetSearch() {
        this.formatTime(false);
        [this.rechargeTime, this.rangeWeek, this.rangeMonth, this.companyName] = ['', [], [], '']
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=withdraw&shopId=${this.companyName}`)
      },
      formatTime(t, d) {
        t[0] ? this.startTime = formatTime(t[0], false, d) : this.startTime = '2000/06/07 00:00:00'
        t[1] ? this.stopTime = formatTime(t[1], true, d) : this.stopTime = formatTime(new Date(), false, 'd')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge-data {
    padding: 20px;
  }
</style>
