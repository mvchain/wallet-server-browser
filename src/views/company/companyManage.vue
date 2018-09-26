<template>
  <div class="company-manage">
    <div>
      <el-button type="success" @click="dialogFormVisible = true; dialogTitle = '新建店铺'">新建店铺</el-button>
    </div>
    <div class="company-manage-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="company"
          label="商家名称">
        </el-table-column>
        <el-table-column
          prop="rechargeFounds"
          label="30日充值金额">
        </el-table-column>
        <el-table-column
          prop="rechargeOrder"
          label="30日充值单数">
        </el-table-column>
        <el-table-column
          prop="withdrawFounds"
          label="30日提币金额">
        </el-table-column>
        <el-table-column
          prop="withdrawOrder"
          label="30日提币单数">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="钱包余额">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="editManage">编辑</el-button>
          </template>
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
    <el-dialog width="500px" :title="dialogTitle" :visible.sync="dialogFormVisible" center>
      <el-form :model="manageForm">
        <el-form-item label="商家名称：" :label-width="formLabelWidth">
          <el-input v-model="manageForm.name"></el-input>
        </el-form-item>
        <el-form-item label="管理员账户：" :label-width="formLabelWidth">
          <el-input v-model="manageForm.account"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码：" :label-width="formLabelWidth">
          <el-input type="password" v-model="manageForm.password"></el-input>
        </el-form-item>
        <el-form-item label="是否控制：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'companyManage',
    data() {
      return {
        tableData: [
          {
            company: '淘宝商家',
            rechargeFounds: '30.0000001ETH',
            rechargeOrder: '54',
            withdrawFounds: '82.64654ETH',
            withdrawOrder: '232',
            status: '1'
          },
          {
            company: '京东商家',
            rechargeFounds: '30.0000001ETH',
            rechargeOrder: '54',
            withdrawFounds: '82.64654ETH',
            withdrawOrder: '232',
            status: '2'
          },
          {
            company: '淘宝商家',
            rechargeFounds: '30.0000001ETH',
            rechargeOrder: '54',
            withdrawFounds: '82.64654ETH',
            withdrawOrder: '232',
            status: '3'
          },
          {
            company: '淘宝商家',
            rechargeFounds: '30.0000001ETH',
            rechargeOrder: '54',
            withdrawFounds: '82.64654ETH',
            withdrawOrder: '232',
            status: '4'
          }
        ],
        dialogTitle: '新建店铺',
        dialogFormVisible: false,
        formLabelWidth: '100px',
        manageForm: {
          name: '',
          account: '',
          password: '',
          status: 0
        }
      }
    },
    methods: {
      handleCurrentChange(t) {
        console.log(t)
      },
      subForm() {
        this.$prompt('请输入主管理员密码确认提交信息', {
          confirmButtonText: '确定',
          inputType: 'password',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '密码: ' + value
          })
        }).catch(() => {})
      },
      editManage() {
        this.dialogFormVisible = true
        this.dialogTitle = '编辑店铺'
        this.manageForm = {
          name: '大西瓜',
          account: 'asdfasdf',
          password: '123123',
          status: '1'
        }
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .company-manage{
    padding:20px;
    .company-manage-table{
      margin-top: 20px;
    }
  }
</style>
