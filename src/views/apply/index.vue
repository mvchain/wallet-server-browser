<template>
  <div class="apply">
    <div class="apply-form">
      <el-form ref="applyForm" :model="applyForm" label-width="150px">
        <el-form-item label="提现地址：">
          <el-input v-model="applyForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="提现金额：">
          <el-input v-model="applyForm.founds"></el-input>
        </el-form-item>
        <el-form-item label="主管理员密码：">
          <el-input v-model="applyForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">申请提现</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="apply-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="time"
          label="提现时间">
        </el-table-column>
        <el-table-column
          prop="founds"
          label="提现金额">
        </el-table-column>
        <el-table-column
          prop="addr"
          label="提现地址">
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
    name: 'apply',
    data() {
      return {
        applyForm: {
          addr: '',
          founds: '',
          password: ''
        },
        tableData: [
          {
            time: '2018/11/22',
            founds: '1234.67856ETH',
            addr: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '1'
          },
          {
            time: '2018/11/22',
            founds: '1234.67856ETH',
            addr: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '2'
          },
          {
            time: '2018/11/22',
            founds: '1234.67856ETH',
            addr: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '3'
          },
          {
            time: '2018/11/22',
            founds: '1234.67856ETH',
            addr: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '4'
          },
          {
            time: '2018/11/22',
            founds: '1234.67856ETH',
            addr: '0x648662ac074c16f5a807c7c9a979cb2786576cae',
            status: '0'
          }
        ]
      }
    },
    methods: {
      onSubmit() {
        console.log(this.applyForm)
      },
      handleCurrentChange(t) {
        console.log(t)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .apply {
    padding: 20px;
    .apply-form{
      width:600px;
      margin-bottom:20px;
    }
  }
</style>
