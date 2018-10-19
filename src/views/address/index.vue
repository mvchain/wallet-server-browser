<template>
  <div class="address">
    <el-row :gutter="20">
      <el-col :span="2">
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
          <el-button >地址导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="5" style="line-height: 40px">
        <span>待分配地址数量：{{addressData.surplus}}</span>
        <span style="padding-left:50px;">已分配地址数量：{{addressData.use}}</span>
      </el-col>
      <el-col :span="3">
        <el-select @change="tokenFun" v-model="tokenType" placeholder="请选择">
          <el-option
            v-for="(v, k) in tokenList"
            :key="k"
            :label="v"
            :value="v">
          </el-option>
        </el-select>
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
      <el-col :span="5">
        <el-select @change="statusChange" v-model="companyStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="exportTable">导出表格</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="输入来源地址、交易哈希" v-model="searchText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchHandler">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div class="address-table">
      <el-table
        :data="addressList.list"
        border
        style="width: 100%">
        <el-table-column
          prop="shopName"
          label="商家">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="isUsedStr"
          label="状态">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="addressList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'setAddr',
    props: {
      permission: Number,
      manage: Object,
      permissionStr: String
    },
    data() {
      return {
        searchText: '',
        tokenList: ['ETH', 'BTC'],
        durationTime: 3,
        action: window.urlData.url + '/dashbord/account/import',
        uploadHead: {
          Authorization: getToken()
        },
        tokenType: 'ETH',
        companyName: '',
        companyStatus: '',
        pageNum: 1,
        statusList: [
          {
            name: '全部状态',
            id: ''
          },
          {
            name: '已分配',
            id: '1'
          },
          {
            name: '未分配',
            id: '0'
          }
        ]
      }
    },
    mounted() {
      this.getTableData('pageNum=1&pageSize=20&orderBy=created_at&tokenType=ETH')
      this.$store.dispatch('getAddressData', this.tokenType).then().catch()
    },
    computed: {
      ...mapGetters({
        addressList: 'addressList',
        copyList: 'copyList',
        addressData: 'addressData'
      })
    },
    methods: {
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
      tokenFun(v) {
        this.tokenType = v
        this.$store.dispatch('getAddressData', this.tokenType).then().catch()
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${this.companyName}&tokenType=${this.tokenType}`)
      },
      searchHandler() {
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${this.companyName}&tokenType=${this.tokenType}`)
      },
      changeFun(v) {
        this.companyName = v
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${v}&tokenType=${this.tokenType}`)
      },
      statusChange(v) {
        this.companyStatus = v
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${this.companyName}&tokenType=${this.tokenType}`)
      },
      getTableData(payload) {
        this.$store.dispatch('getAddressList', payload).then().catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`pageNum=${t}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${this.companyName}&tokenType=${this.tokenType}`)
      },
      exportTable() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/dashbord/account/export?sign=${s}&address=${this.searchText}&isUsed=${this.companyStatus}&shopId=${this.companyName}&tokenType=${this.tokenType}`)
        }).catch()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .address {
    padding: 20px;
    .address-table {
      margin-top: 20px;
    }
  }
</style>
