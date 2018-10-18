<template>
  <div class="company-withdraw">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-col :span="7">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="uploadHead"
            :on-success="successFun"
            :on-error="errorFun"
            :show-file-list="false"
            multiple
            :limit="3"
          >
            <el-button >导入</el-button>
          </el-upload>
      </el-col>
        <el-button @click="exportFun">导出</el-button>
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
        <el-select @change="statusChange" v-model="companyStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          v-model="rechargeTime"
          @change="timeChange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button @click="importFun">表格导出</el-button>
      </el-col>

      <el-col :span="6">
        <el-input placeholder="输入单号、目标地址" v-model="searchText" class="input-with-select">
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
          prop="transactionId"
          label="单号">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="商家">
        </el-table-column>
        <el-table-column
          label="提币金额">
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
          <template slot-scope="scope">
            <span :title="scope.row.errorMsg">{{scope.row.transactionStatus | statusFliter}}</span>
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
  import { mapGetters } from 'vuex'
  import { formatTime } from '@/utils'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'companyWithdraw',
    computed: {
      ...mapGetters({
        rwList: 'rwList',
        copyList: 'copyList'
      })
    },
    props: {
      permission: Number,
      manage: Object
    },
    mounted() {
      // startTime=1&stopTime=2&shopId=3&fromAddress=4&toAddress=5&hash=6&oprType=7&transactionId=8&transactionStatus=9&shopWithdraw=10&pageNum=11&pageSize=12&orderBy=13
      this.getTableData('pageNum=1&pageSize=20&oprType=withdraw&shopWithdraw=1&orderBy=created_at desc')
    },
    data() {
      return {
        rechargeTime: '',
        action: window.urlData.url + '/dashbord/sign/import',
        uploadHead: {
          Authorization: getToken()
        },
        searchText: '',
        transactionId: '',
        pageNum: '1',
        durationTime: 3,
        fromAddress: '',
        dateType: 0,
        companyName: '',
        companyStatus: '',
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
    methods: {
      searchHandler() {
        this.searchText = this.searchText.replace(/\s/g, '')
        if (this.searchText.length !== 42 && this.searchText.length !== 34) {
          this.transactionId = this.searchText
          this.fromAddress = ''
        } else if (this.searchText === '') {
          this.transactionId = ''
          this.fromAddress = ''
        } else {
          this.fromAddress = this.searchText
          this.transactionId = ''
        }
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      timeChange() {
        this.timeFormat()
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
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
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      statusChange(v) {
        this.companyStatus = v
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      getTableData(payload) {
        this.$store.dispatch('getRWList', payload).then().catch()
      },
      exportFun() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/sign/export?sign=${s}&oprType=withdraw&shopWithdraw=1`)
        }).catch()
      },
      importFun() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/transaction/export?sign=${s}&startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1`)
        }).catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.fromAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=1&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      successFun(s) {
        if (s.code !== 200) {
          this.$message.error(`导入失败${s.message}`)
        } else {
          window.setInterval(() => {
            this.durationTime--
            if (this.durationTime === -1) {
              this.$router.go(0)
            }
          }, 1000)
          this.$message.success({
            message: '上传成功,3秒后刷新页面',
            duration: 3000
          })
        }
      },
      errorFun() {
        this.$message.error('导入失败')
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .company-withdraw{
    padding:20px;
  }
</style>
