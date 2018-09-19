<template>
  <div class="admin">
    <div>
      <el-button type="success" @click="dialogFormVisible = true; dialogTitle = '新建管理员'">新建管理员</el-button>
    </div>
    <div class="admin-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="label"
          label="管理员名称">
        </el-table-column>
        <el-table-column
          with="600"
          label="操作">
          <template slot-scope="scope">
            <el-button plain type="primary" @click="editManage" size="small">编辑</el-button>
            <el-button plain type="danger" size="small">删除</el-button>
          </template>
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
        <el-form-item label="名称：" :label-width="formLabelWidth">
          <el-input v-model="manageForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账户：" :label-width="formLabelWidth">
          <el-input v-model="manageForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth">
          <el-input type="password" v-model="manageForm.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员控制：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="订单审核：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.review"></el-switch>
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
    name: 'AdministratorSettings',
    data() {
      return {
        dialogTitle: '新建管理员',
        dialogFormVisible: false,
        formLabelWidth: '100px',
        tableData: [
          {
            type: '主管理员',
            label: '菠萝'
          },
          {
            type: '大管理员',
            label: '草莓'
          },
          {
            type: '中管理员',
            label: '桔子'
          },
          {
            type: '小管理员',
            label: '西瓜'
          }
        ],
        manageForm: {
          name: '',
          account: '',
          password: '',
          status: 0,
          review: 0
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
        this.dialogTitle = '编辑管理员'
        this.manageForm = {
          name: '大西瓜',
          account: 'asdfasdf',
          password: '123123',
          status: '1',
          review: '1'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .admin {
    padding: 20px;
    .admin-table {
      margin-top: 20px;
    }
  }
</style>
