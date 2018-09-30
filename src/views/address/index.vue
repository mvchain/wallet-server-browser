<template>
  <div class="address">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button>地址导入</el-button>
      </el-col>
      <el-col :span="6" style="line-height: 40px">
        <span>待分配地址数量：{{addressData.surplus}}</span>
        <span style="padding-left:50px;">已分配地址数量：{{addressData.use}}</span>
      </el-col>
      <el-col :span="3">
        <el-select @change="changeFun" v-model="companyName" placeholder="请选择">
          <el-option
            v-for="item in companyList.list"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
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
      <el-col :span="7">
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
          width="550"
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
  export default {
    name: 'setAddr',
    props: {
      permission: Number,
      manage: Object
    },
    data() {
      return {
        searchText: '',
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
      // id=0&tokenType=1&address=2&createdAt=3&updatedAt=4&isUsed=5&balance=6&userId=7&shopId=8
      this.getTableData('pageNum=1&pageSize=20&orderBy=created_at')
      this.$store.dispatch('getCompanyList', 'pageNum=1&pageSize=1000&orderBy=status desc,created_at desc').then(() => {
        this.companyList.list.unshift({ shopName: '全部商家', shopId: '' })
      }).catch()
      this.$store.dispatch('getAddressData').then().catch()
    },
    computed: {
      ...mapGetters({
        addressList: 'addressList',
        companyList: 'companyList',
        addressData: 'addressData'
      })
    },
    methods: {
      searchHandler() {
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&balance=6&userId=7&shopId=${this.companyName}`)
      },
      changeFun(v) {
        this.companyName = v
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&balance=6&userId=7&shopId=${v}`)
      },
      statusChange(v) {
        this.companyStatus = v
        this.getTableData(`pageNum=${this.pageNum}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&balance=6&userId=7&shopId=${this.companyName}`)
      },
      getTableData(payload) {
        this.$store.dispatch('getAddressList', payload).then().catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`pageNum=${t}&pageSize=20&address=${this.searchText}&isUsed=${this.companyStatus}&balance=6&userId=7&shopId=${this.companyName}`)
      },
      exportTable() {
        console.log('导出表格')
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
