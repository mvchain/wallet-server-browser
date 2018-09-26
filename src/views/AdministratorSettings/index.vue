<template>
  <div class="admin">
    <div>
      <el-button type="success" @click="createManageFun">新建管理员</el-button>
    </div>
    <div class="admin-table">
      <el-table
        :data="adminList.list"
        border
        style="width: 100%">
        <el-table-column
          prop="adminType"
          :formatter="adminTypeFormat"
          label="类型">
        </el-table-column>

        <el-table-column
          prop="username"
          label="管理员名称">
        </el-table-column>
        <el-table-column
          with="600"
          label="操作">
          <template slot-scope="scope">
            <el-button plain type="primary" @click="editManage(scope.row)" size="small">编辑</el-button>
            <el-button plain type="danger" size="small" @click="deleteManage(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="adminList.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog width="500px" :title="dialogTitle?'新建管理员':'编辑管理员'" :visible.sync="dialogFormVisible" center>
      <el-form :rules="manageRule" :model="manageForm" ref="manageForm">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="username">
          <el-input v-model="manageForm.username"></el-input>
        </el-form-item>
        <el-form-item label="账户：" :label-width="formLabelWidth" prop="accountName">
          <el-input v-model="manageForm.accountName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="manageForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="reviewSwitch" label="管理员控制：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.permissionAdmin"></el-switch>
        </el-form-item>
        <el-form-item v-if="permission === 2" label="订单审核：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.permissionReview"></el-switch>
        </el-form-item>
        <el-form-item v-if="permission === 0" label="汇总操作：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.permissionCollect"></el-switch>
        </el-form-item>
        <el-form-item v-if="permission === 0" label="提币操作：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="manageForm.permissionWithdraw"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subForm('manageForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'
  export default {
    name: 'AdministratorSettings',
    data() {
      return {
        dialogTitle: true,
        reviewSwitch: false,
        permission: '',
        dialogFormVisible: false,
        subFlag: false,
        formLabelWidth: '100px',
        manageForm: {
          accountName: '',
          adminPassword: '',
          password: '',
          permissionAdmin: 0,
          permissionCollect: 0,
          permissionWithdraw: 0,
          permissionReview: 0,
          userId: '',
          username: ''
        },
        manageRule: {
          accountName: [
            { required: true, message: '请输入账户', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      const un = window.localStorage.getItem('permission')
      if (un) {
        this.permission = JSON.parse(un).adminType
      }
      this.getTableData('?pageNum=1&pageSize=20&orderBy=created_at')
    },
    computed: {
      ...mapGetters({
        adminList: 'adminList'
      })
    },
    methods: {
      getTableData(payload) {
        this.$store.dispatch('getAdminList', payload).then().catch()
      },
      handleCurrentChange(t) {
        console.log(t)
      },
      ajaxFormHandler(t, f, n) {
        if (t) {
          this.$store.dispatch('postCreateList', f).then(() => {
            this.subFlag = false
            this.getTableData('?pageNum=1&pageSize=20&orderBy=created_at')
          }).catch(() => {

          })
        } else {
          this.$store.dispatch('putCreateList', f).then(() => {
            this.subFlag = false
            this.getTableData('?pageNum=1&pageSize=20&orderBy=created_at')
          }).catch(() => {
            this.subFlag = false
          })
        }
        this.$refs[n].resetFields()
      },
      subForm(ruleForm) {
        this.$prompt('请输入主管理员密码确认提交信息', {
          confirmButtonText: '确定',
          inputType: 'password',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.manageForm.adminPassword = value
          const un = JSON.parse(window.localStorage.getItem('user'))
          if (!value) {
            this.$message({
              type: 'error',
              message: '请输入管理员密码'
            })
            return
          }
          this.$refs[ruleForm].validate((valid) => {
            if (valid) {
              this.subFlag = true
              const copyForm = {}
              Object.assign(copyForm, this.manageForm)
              copyForm.password = md5(md5(copyForm.password) + this.manageForm.accountName)
              copyForm.adminPassword = md5(md5(copyForm.adminPassword) + un.username)
              this.ajaxFormHandler(this.dialogTitle, copyForm, ruleForm)
            } else {
              this.subFlag = false
              this.$message({
                type: 'error',
                message: '请输入正确信息'
              })
              return false
            }
          })
        }).catch(() => {
        })
      },
      createManageFun() {
        this.dialogFormVisible = true
        this.dialogTitle = true
      },
      deleteManage(id) {
        this.$prompt('输入密码确认删除管理员', {
          confirmButtonText: '确定',
          inputType: 'password',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          console.log(id)
          this.$message.success('删除成功')
        }).catch(() => {
        })
        // this.$store.dispatch('deleteAdminList', id).then(() => {
        //   this.$message.success('删除成功')
        // }).catch()
      },
      editManage(obj) {
        this.dialogFormVisible = true
        if (this.permission === 2) {
          this.reviewSwitch = true
        }
        this.dialogTitle = false
        this.manageForm = obj
      },
      adminTypeFormat(v, column) {
        if (v.adminType === 0 || v.adminType === 2) {
          return '主管理员'
        } else if (v.adminType === 1 || v.adminType === 3) {
          return '子管理员'
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
