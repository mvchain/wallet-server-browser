<template>
  <div class="recharge">
    <el-row :gutter="20">
      <el-col  :span="16">
        <el-select @change="shopHandler" v-model="companyName" placeholder="请选择" v-if="permission === 0 || permission === 1">
          <el-option
            v-for="item in copyList.list"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          @change="timeChange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button @click="exportFun">表格导出</el-button>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="输入目标地址、交易哈希" v-model="searchText" class="input-with-select">
          <el-button @click="searchHandler" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="rwList.list"
        border
        style="width: 100%">
        <el-table-column
          prop="createdAtStr"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="商家">
        </el-table-column>
        <el-table-column
          label="充值金额">
          <template slot-scope="scope">
            {{scope.row.value}}{{scope.row.tokenType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="toAddress"
          label="目标地址">
        </el-table-column>
        <el-table-column
          label="交易哈希">
          <template slot-scope="scope">
            <a v-if="scope.row.tokenType === 'BTC'" target="_blank" :href="`https://btc.com/${scope.row.hash}`">{{scope.row.hash}}</a>
            <a target="_blank" v-else  :href="`https://etherscan.io/search?q=${scope.row.hash}`">{{scope.row.hash}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="状态">
          <template slot-scope="scope" >
            {{scope.row.status.substr(-1) === '1' ? '正在充值' : scope.row.status.substr(-1) === '2' ? '充值成功' : '充值失败'}}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="rwList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { formatTime } from '@/utils'
  export default {
    name: 'recharge',
    props: {
      permission: Number,
      manage: Object
    },
    data() {
      return {
        rechargeTime: '',
        searchText: '',
        pageNum: '1',
        toAddress: '',
        dateType: 0,
        companyName: '',
        hash: '',
        statusList: [
          {
            name: '全部状态',
            id: ''
          },
          {
            name: '待审核',
            id: '1'
          },
          {
            name: '待提币',
            id: '2'
          },
          {
            name: '拒绝',
            id: '3'
          },
          {
            name: '正在提币',
            id: '4'
          },
          {
            name: '提币成功',
            id: '5'
          },
          {
            name: '失败',
            id: '6'
          }
        ],
        startTime: '2000/06/07 00:00:00',
        stopTime: '2099/06/07 00:00:00'
      }
    },
    computed: {
      ...mapGetters({
        rwList: 'rwList',
        copyList: 'copyList'
      })
    },
    mounted() {
      let t = ''
      if (this.$route.query.startTime && this.$route.query.stopTime) {
        t = `startTime=${this.$route.query.startTime}&stopTime=${this.$route.query.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`
      } else {
        t = 'pageNum=1&pageSize=20&oprType=recharge&shopWithdraw=0&orderBy=created_at desc'
      }

      // startTime=1&stopTime=2&shopId=3&fromAddress=4&toAddress=5&hash=6&oprType=7&transactionId=8&transactionStatus=9&shopWithdraw=10&pageNum=11&pageSize=12&orderBy=13
      this.getTableData(t)
      // startTime=1&stopTime=2&shopId=3&toAddress=4&toAddress=5&hash=6&oprType=7&transactionId=8&transactionStatus=9&shopWithdraw=10&pageNum=11&pageSize=12&orderBy=13
    },
    methods: {
      shopHandler() {
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      searchHandler() {
        this.searchText = this.searchText.replace(/\s/g, '')
        if (this.searchText.length !== 42 && this.searchText.length !== 35) {
          this.hash = this.searchText
          this.toAddress = ''
        } else if (this.searchText === '') {
          this.hash = ''
          this.toAddress = ''
        } else {
          this.toAddress = this.searchText
          this.hash = ''
        }
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      timeChange() {
        this.timeFormat()
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      timeFormat() {
        if (this.rechargeTime === null) {
          this.startTime = '2000/06/07 00:00:00'
          this.stopTime = formatTime(new Date(), false, 'd')
          return
        }
        this.startTime = formatTime(this.rechargeTime[0], false, 'd')
        this.stopTime = formatTime(this.rechargeTime[1], true, 'd')
      },
      changeFun(v) {
        this.companyName = v
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      getTableData(payload) {
        this.$store.dispatch('getRWList', payload).then().catch()
      },
      exportFun() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/transaction/export?sign=${s}&startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0`)
        }).catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=recharge&hash=${this.hash}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge {
    padding: 20px;
  }
</style>
