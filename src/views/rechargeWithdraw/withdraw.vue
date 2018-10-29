<template>
  <div class="company-withdraw">
    <el-row v-if="permission === 0 || permission === 1" :gutter="20">
      <el-col :span="5">
        <el-col :span="7">
          <el-upload
            class="upload-demo"
            :action="action"
            :disabled="!this.permissionStr.includes('2')"
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
    <el-row v-if="permission === 2 || permission === 3" :gutter="20">
      <el-col :span="5">
        <button class="agreeBtn" @click="agreeHandler" v-if="permissionStr.includes('4')">同意已勾选</button>
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
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
        <el-table-column
          v-if="permission === 2 || permission === 3"
          :selectable="isSelectHandler"
          type="selection"
          width="55">
        </el-table-column>
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
          <template slot-scope="scope" >
            <el-dropdown v-if="scope.row.transactionStatus === 1 && (permission === 2 || permission === 3)" @command="handleCommand" :disabled="true">
              <span class="el-dropdown-link">
                待审核<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="!permissionStr.includes('4')" :command="{id: scope.row.id, status: 2}">同意</el-dropdown-item>
                <el-dropdown-item :disabled="!permissionStr.includes('4')" :command="{id: scope.row.id, status: 3}">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown v-else-if="scope.row.transactionStatus === 6 && (permission === 2 || permission === 3)" @command="handleCommand" :disabled="true">
              <span class="el-dropdown-link" :title="scope.row.errorData">
                失败:{{scope.row.errorMsg}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="!permissionStr.includes('4')" :command="{id: scope.row.id, status: 3}">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span  v-else>{{scope.row.transactionStatus | statusFliter}}</span>
            <span :title="scope.row.errorData" v-if="scope.row.errorData">{{'-' + scope.row.errorMsg}}</span>
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
    name: 'withdraw',
    computed: {
      ...mapGetters({
        rwList: 'rwList',
        copyList: 'copyList',
        permissionStr: 'permissionStr'
      })
    },
    props: {
      permission: Number,
      manage: Object
    },
    mounted() {
      let t = ''
      if (this.$route.query.startTime && this.$route.query.stopTime) {
        t = `startTime=${this.$route.query.startTime}&stopTime=${this.$route.query.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`
      } else {
        t = 'pageNum=1&pageSize=20&oprType=withdraw&shopWithdraw=0&orderBy=created_at desc'
      }
      // startTime=1&stopTime=2&shopId=3&toAddress=4&toAddress=5&hash=6&oprType=7&transactionId=8&transactionStatus=9&shopWithdraw=10&pageNum=11&pageSize=12&orderBy=13
      this.getTableData(t)
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
        toAddress: '',
        multipleSelection: [],
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
      isSelectHandler(v) {
        return v.transactionStatus === 1 && this.permissionStr.includes('4')
      },
      agreeHandler() {
        // putMultipleAgree
        if (this.multipleSelection.length === 0) return
        const ids = []
        this.multipleSelection.map((v) => {
          ids.push(v.id)
        })
        this.$confirm('是否批量同意提现？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('putMultipleAgree', ids.toString()).then(() => {
            this.getTableData('pageNum=1&pageSize=20&oprType=withdraw&shopWithdraw=0&orderBy=created_at desc')
          }).catch()
        }).catch(() => {})
      },
      handleSelectionChange(v) {
        this.multipleSelection = v
      },
      handleCommand(v) {
        this.$store.dispatch('putTransactionStatus', v).then(() => {
          this.getTableData('pageNum=1&pageSize=20&oprType=withdraw&shopWithdraw=0&orderBy=created_at desc')
        }).catch()
      },
      searchHandler() {
        this.searchText = this.searchText.replace(/\s/g, '')
        if (this.searchText.length !== 42 && this.searchText.length !== 35) {
          this.transactionId = this.searchText
          this.toAddress = ''
        } else if (this.searchText === '') {
          this.transactionId = ''
          this.toAddress = ''
        } else {
          this.toAddress = this.searchText
          this.transactionId = ''
        }
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      timeChange() {
        this.timeFormat()
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
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
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      statusChange(v) {
        this.companyStatus = v
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
      },
      getTableData(payload) {
        this.$store.dispatch('getRWList', payload).then().catch()
      },
      exportFun() {
        if (!this.permissionStr.includes('2')) return
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/sign/export?sign=${s}&oprType=withdraw&shopWithdraw=0`)
        }).catch()
      },
      importFun() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/transaction/export?sign=${s}&startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0`)
        }).catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&shopId=${this.companyName}&toAddress=${this.toAddress}&oprType=withdraw&transactionId=${this.transactionId}&transactionStatus=${this.companyStatus}&shopWithdraw=0&pageNum=${this.pageNum}&pageSize=20&orderBy=created_at desc`)
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
    .agreeBtn:hover{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
    .agreeBtn{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: .1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
</style>
