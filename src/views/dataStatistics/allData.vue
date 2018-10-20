<template>
  <div class="recharge-data">
    <el-row :gutter="20">
      <el-col :span="4" style="line-height: 40px">
        <span v-for="(v, k) in allBalance[0]"> {{k}}总汇金额：{{v}}</span>
      </el-col>
      <el-col v-if="permission === 0 || permission === 1" :span="10">
        <el-col :span="5">
          <el-upload
            class="upload-demo"
            :action="action"
            :headers="uploadHead"
            :disabled="!this.permissionStr.includes('2')"
            :on-success="successFun"
            :on-error="errorFun"
            :show-file-list="false"
            multiple
            :limit="3"
          >
            <el-button >汇总导入</el-button>
          </el-upload>
        </el-col>
        <el-col :span="5">
          <el-button @click="dialogFormVisible = true">汇总导出</el-button>
        </el-col>
      </el-col>
      <el-col :span="8">
        <template>
          <el-date-picker
            v-model="rechargeTime"
            type="daterange"
            align="right"
            @change="timeChange"
            :clearable="false"
            :default-time="['00:00:00', '23:59:59']"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </template>
        <el-button @click="exportTable">导出表格</el-button>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="allStatistics.list"
        border
        style="width: 100%">
        <el-table-column
          prop="createdAtStr"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="value"
          label="ETH汇总金额">
        </el-table-column>
        <el-table-column
          prop="valueComplete"
          label="ETH实际汇总金额">
        </el-table-column>
        <el-table-column
          prop="feeComplete"
          label="实际手续费">
        </el-table-column>
        <el-table-column
          prop="total"
          label="汇总账户数量">
        </el-table-column>
        <el-table-column
          prop="totalComplete"
          label="实际汇总账户数量">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="allStatistics.total">
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
  import { mapGetters } from 'vuex'
  import { formatTime } from '@/utils'
  import { getToken } from '@/utils/auth'
  // import { getToken } from '@/utils/auth'
  export default {
    name: 'allData',
    props: {
      permission: Number,
      manage: Object,
      permissionStr: String
    },
    computed: {
      ...mapGetters({
        allStatistics: 'allStatistics',
        allBalance: 'allBalance'
      })
    },
    data() {
      return {
        rechargeTime: [],
        startTime: '',
        stopTime: '',
        pageNum: 1,
        action: window.urlData.url + '/dashbord/collect/import',
        uploadHead: {
          Authorization: getToken()
        },
        dialogFormVisible: false,
        durationTime: 3,
        checkStatus: false
      }
    },
    mounted() {
      this.formatTime(this.rechargeTime)
      this.$store.dispatch('getCollect')
      // /dashbord/collect?pageNum=1&pageSize=2&orderBy=3&startTime=4&stopTime=5
      this.getTableData(`pageNum=${this.pageNum}&pageSize=2&orderBy=created_at desc&startTime=${this.startTime}&stopTime=${this.stopTime}`)
    },
    methods: {
      timeChange() {
        this.formatTime(this.rechargeTime)
        this.getTableData(`pageNum=${this.pageNum}&pageSize=2&orderBy=created_at desc&startTime=${this.startTime}&stopTime=${this.stopTime}`)
      },
      getTableData(payload) {
        this.$store.dispatch('getSatisticsCollect', payload).then().catch()
      },
      exportTable() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/collect/opr/export?sign=${s}&startTime=${this.startTime}&stopTime=${this.stopTime}`)
        }).catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`startTime=${this.startTime}&stopTime=${this.stopTime}&dateType=${this.dateType}&oprType=recharge`)
      },

      formatTime(t, d) {
        t[0] ? this.startTime = formatTime(t[0], false, d) : this.startTime = '2000/06/07 00:00:00'
        t[1] ? this.stopTime = formatTime(t[1], true, d) : this.stopTime = formatTime(new Date(), false, 'd')
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
      },
      exportHandler() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/collect/export?sign=${s}&all=${this.checkStatus}`)
        }).catch()
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge-data {
    padding: 20px;
  }
</style>
