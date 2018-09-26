<template>
  <div class="address">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button>地址导入</el-button>
      </el-col>
      <el-col :span="6" style="line-height: 40px">
        <span>待分配地址数量：1200</span>
        <span style="padding-left:50px;">已分配地址数量：1200</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="companyName" placeholder="请选择">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="companyStatus" placeholder="请选择">
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
          <el-button slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div class="address-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="company"
          label="商家">
        </el-table-column>
        <el-table-column
          prop="address"
          width="550"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
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
    name: 'setAddr',
    data() {
      return {
        searchText: '',
        companyName: '1',
        companyStatus: '1',
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
        statusList: [
          {
            name: '全部状态',
            id: '1'
          },
          {
            name: '已分配',
            id: '2'
          },
          {
            name: '未分配',
            id: '3'
          }
        ],
        tableData: [
          {
            company: '淘宝商家',
            address: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '1'
          },
          {
            company: '京东商家',
            address: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '2'
          },
          {
            company: '淘宝商家',
            address: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '1'
          },
          {
            company: '京东商家',
            address: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '2'
          }
        ]
      }
    },
    methods: {
      handleCurrentChange(t) {
        console.log(t)
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
