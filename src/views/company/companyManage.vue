<template>
  <div class="company-manage">
    <div>
      <el-button type="success" @click="createCompanyFun">新建店铺</el-button>
    </div>
    <div class="company-manage-table">
      <el-table
        :data="companyList.list"
        border
        style="width: 100%">
        <el-table-column
          prop="shopName"
          label="商家名称">
        </el-table-column>
        <el-table-column
          prop="rechargeNum30"
          label="30日充值金额">
        </el-table-column>
        <el-table-column
          prop="rechargeOrder"
          label="30日充值单数">
        </el-table-column>
        <el-table-column
          prop="withdrawNum30"
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
          :total="companyList.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog width="500px" :title="dialogTitle?'新建商家':'编辑商家'" :visible.sync="dialogFormVisible" center>
      <el-form :model="companyForm" ref="companyForm" :rule="companyRule">
        <el-form-item label="商家名称：" :label-width="formLabelWidth" prop="shopName">
          <el-input v-model="companyForm.shopName"></el-input>
        </el-form-item>
        <el-form-item label="管理员账户：" :label-width="formLabelWidth"  prop="adminAccount">
          <el-input v-model="companyForm.adminAccount"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码：" :label-width="formLabelWidth" prop="adminPassword">
          <el-input type="password" v-model="companyForm.adminPassword"></el-input>
        </el-form-item>
        <el-form-item v-if="!dialogTitle" label="是否停运：" prop="delivery" :label-width="formLabelWidth">
          <el-switch active-value="1" inactive-value="0" v-model="companyForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm('companyForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'
  export default {
    name: 'companyManage',
    data() {
      return {
        dialogTitle: true,
        dialogFormVisible: false,
        pageNum: 1,
        formLabelWidth: '100px',
        companyForm: {
          adminAccount: '',
          adminPassword: '',
          password: '',
          shopId: '',
          shopName: '',
          status: 0
        },
        companyRule: {
          adminAccount: [
            { required: true, message: '请输入管理员账户', trigger: 'blur' }
          ],
          adminPassword: [
            { required: true, message: '请输入管理员密码', trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '请输入商家名称', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters({
        companyList: 'companyList'
      })
    },
    mounted() {
      const un = window.localStorage.getItem('permission')
      if (un) {
        this.permission = JSON.parse(un).adminType
      }
      this.getTableData('?pageNum=1&pageSize=20&orderBy=created_at')
    },
    methods: {
      createCompanyFun() {
        this.dialogFormVisible = true
        this.dialogTitle = true
      },
      getTableData(payload) {
        this.$store.dispatch('getCompanyList', payload).then().catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`?pageNum=${t}&pageSize=20&orderBy=created_at`)
      },
      ajaxFormHandler(t, f, n) {
        if (t) {
          this.$store.dispatch('postCreateCompany', f).then(() => {
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
          this.companyForm.password = value
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
              Object.assign(copyForm, this.companyForm)
              copyForm.adminPassword = md5(md5(copyForm.adminPassword) + this.companyForm.adminAccount)
              copyForm.password = md5(md5(copyForm.password) + un.username)
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
      editManage() {
        this.dialogFormVisible = true
        this.dialogTitle = false
        this.companyForm = {
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
