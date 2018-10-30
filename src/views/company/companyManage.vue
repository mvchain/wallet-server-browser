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
          prop="adminName"
          label="管理员账号">
        </el-table-column>
        <el-table-column
          label="30日充值金额">
          <template slot-scope="scope">
            <div>ETH:{{scope.row.rechargeEth30}}</div>
            <div>BTC:{{scope.row.rechargeBtc30}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="30日充值单数">
          <template slot-scope="scope">
            <div>ETH:{{scope.row.rechargeEthNum30}}</div>
            <div>BTC:{{scope.row.rechargeBtcNum30}}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="30日提币金额">
          <template slot-scope="scope">
            <div>ETH:{{scope.row.withdrawEth30}}</div>
            <div>BTC:{{scope.row.withdrawBtc30}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="30日提币单数">
          <template slot-scope="scope">
            <div>ETH:{{scope.row.withdrawEthNum30}}</div>
            <div>BTC:{{scope.row.withdrawBtcNum30}}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="钱包余额">
          <template slot-scope="scope">
            <div>ETH:{{scope.row.ethBalance}}</div>
            <div>BTC:{{scope.row.btcBalance}}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="[scope.row, 1]">编辑</el-dropdown-item>
                <el-dropdown-item :command="[scope.row, 2]">ETH提现</el-dropdown-item>
                <el-dropdown-item :command="[scope.row, 3]">BTC提现</el-dropdown-item>
                <el-dropdown-item :command="[scope.row, 4]">充值地址</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{scope.row.status === 1 ? '正常' : '停运'}}
          </template>
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
        <el-form-item label="管理员密码：" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="companyForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="!dialogTitle" label="是否停运："  :label-width="formLabelWidth">
          <el-switch :active-value="0" :inactive-value="1" v-model="companyForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subForm('companyForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px" title="商家提现" :visible.sync="dialogWithdraw" center>
      <el-form :model="withdrawForm" ref="withdrawForm" :rule="withdrawRule">
        <el-form-item label="商家名称：" :label-width="formLabelWidth" prop="address">
          <el-col :span="12"><span>{{withdrawForm.shopName}}</span></el-col>
          <el-col :span="12"><span>钱包余额：{{withdrawForm.balance}}{{tokenName}}</span></el-col>
        </el-form-item>
        <el-form-item label="提现地址：" :label-width="formLabelWidth" prop="address">
          <el-input v-model="withdrawForm.address"></el-input>
        </el-form-item>
        <el-form-item label="提现金额：" :label-width="formLabelWidth"  prop="value">
          <el-input v-model="withdrawForm.value"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码：" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="withdrawForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWithdraw = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="ajaxWithdrawHandler('withdrawForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"  width="600px"  title="充值地址" :visible.sync="showAddressFlag">
      <div>
        <span v-if="addressObj.length">{{addressObj[0].tokenType}}：{{addressObj[0].address}}</span>
      </div>
      <div style="margin-top:15px;">
        <span v-if="addressObj.length">{{addressObj[1].tokenType}}：{{addressObj[1].address}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import md5 from 'blueimp-md5'
  export default {
    name: 'companyManage',
    props: {
      permission: Number,
      manage: Object
    },
    data() {
      return {
        tokenName: '',
        dialogTitle: true,
        dialogFormVisible: false,
        dialogWithdraw: false,
        subFlag: false,
        showAddressFlag: false,
        addressObj: [],
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
          password: [
            { required: true, message: '请输入管理员密码', trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '请输入商家名称', trigger: 'blur' }
          ]
        },
        withdrawRule: {
          address: [
            { required: true, message: '请输入提现地址', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入提现金额', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入当前管理员密码', trigger: 'blur' }
          ]
        },
        withdrawForm: {
          address: '',
          password: '',
          shopId: '',
          value: '',
          shopName: '',
          balance: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        companyList: 'companyList',
        permissionStr: 'permissionStr'
      })
    },
    mounted() {
      this.getTableData('pageNum=1&pageSize=20&orderBy=status desc,created_at desc')
    },
    methods: {
      handleCommand(v) {
        switch (v[1]) {
          case 1:
            this.editManage(v[0])
            break
          case 2:
            if (!this.permissionStr.includes('3')) return
            this.tokenName = 'ETH'
            this.withDrawManage(v[0])
            break
          case 3:
            if (!this.permissionStr.includes('3')) return
            this.tokenName = 'BTC'
            this.withDrawManage(v[0])
            break
          case 4:
            this.showAddressFlag = true
            this.$store.dispatch('getRechargeAddress', v[0].shopId).then((res) => {
              this.addressObj = res
            }).catch()
            break
        }
      },
      createCompanyFun() {
        this.dialogFormVisible = true
        this.dialogTitle = true
      },
      getTableData(payload) {
        this.$store.dispatch('getCompanyList', payload).then().catch()
      },
      handleCurrentChange(t) {
        this.pageNum = t
        this.getTableData(`pageNum=${t}&pageSize=20&orderBy=status desc,created_at desc`)
      },
      ajaxFormHandler(t, f, n) {
        if (t) {
          this.$store.dispatch('postCreateCompany', f).then(() => {
            this.subFlag = false
            this.$refs[n].resetFields()
            this.getTableData('pageNum=1&pageSize=20&orderBy=status desc,created_at desc')
            this.$message.success('创建成功')
          }).catch(() => {
            this.subFlag = false
          })
        } else {
          this.$store.dispatch('putCreateCompany', f).then(() => {
            this.subFlag = false
            this.getTableData('pageNum=1&pageSize=20&orderBy=status desc,created_at desc')
            this.$message.success('修改成功')
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
          this.companyForm.adminPassword = value
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
              copyForm.password = md5(md5(copyForm.password) + this.companyForm.adminAccount)
              copyForm.adminPassword = md5(md5(copyForm.adminPassword) + this.manage.username)
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
      editManage(obj) {
        this.dialogFormVisible = true
        this.dialogTitle = false
        Object.assign(this.companyForm, obj)
        this.companyForm.adminAccount = obj.adminName
      },
      withDrawManage(obj) {
        this.dialogWithdraw = true
        this.withdrawForm.shopId = obj.shopId
        this.withdrawForm.shopName = obj.shopName
        this.withdrawForm.tokenType = this.tokenName
        this.withdrawForm.balance = obj.balance
      },
      ajaxWithdrawHandler(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.subFlag = true
            const copyForm = {}
            Object.assign(copyForm, this.withdrawForm)
            copyForm.password = md5(md5(copyForm.password) + this.manage.username)
            this.$store.dispatch('postWithdraw', copyForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.$refs[ruleForm].resetFields()
              this.dialogWithdraw = false
              this.subFlag = false
            }).catch(() => {
              this.subFlag = false
            })
          } else {
            this.subFlag = false
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            })
            return false
          }
        })
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
