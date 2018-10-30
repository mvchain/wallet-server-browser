<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span>{{avatar}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item v-if="permission == 0">
          <span @click="dialogFormVisible = true">手续费设置</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 0">
          <span @click="dialogBalance = true">汇总保留金额</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 2 || permission == 3">
          <span >BTC待提金额：{{withdrawManage.withdrawBtcAmount}}</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 2 || permission == 3">
          <span >BTC余额：{{withdrawManage.balanceBTC}}</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 2 || permission == 3">
          <span >ETH待提金额：{{withdrawManage.withdrawEthAmount}}</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 2 || permission == 3">
          <span>ETH余额：{{withdrawManage.balanceEth}}</span>
        </el-dropdown-item>
        <el-dropdown-item v-if="permission == 2 || permission == 3">
          <span @click="showAddress" >充值地址</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :close-on-click-modal="false"  width="600px"  title="转账手续费设置" :visible.sync="dialogFormVisible">
      <div>
        <span>BTC手续费：</span>
        <span>{{fee.btcGas}}</span>
        <el-slider
          v-model="fee.btcGas"
          :min="0.0001"
          :max="0.001"
          :step="0.00001"
        >
        </el-slider>
      </div>
      <div>
        <span>ETH手续费：</span>
        <span>{{fee.ethGas}}</span>
        <el-slider
          v-model="fee.ethGas"
          :min="0.000210"
          :max="0.002100"
          :step="0.0000021"
        >
        </el-slider>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFee">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"  width="600px"  title="汇总保留金额" :visible.sync="dialogBalance">
      <div>
        <span>ETH保留：</span>
        <span>{{reserved.eth}}</span>
        <el-slider
          v-model="reserved.eth"
          :min="fee.ethGas"
          :max="10"
          :step="0.001"
        >
        </el-slider>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBalance = false">取 消</el-button>
        <el-button type="primary" @click="setReserve">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"  width="600px"  title="充值地址" :visible.sync="showAddressFlag">
      <div>
        <span v-if="addressObj.length">{{addressObj[0].tokenType}}:{{addressObj[0].address}}</span>
      </div>
      <div>
        <span v-if="addressObj.length">{{addressObj[1].tokenType}}:{{addressObj[1].address}}</span>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  props: {
    fee: Object,
    reserved: Object,
    withdrawManage: Object
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
      avatar: '',
      dialogFormVisible: false,
      permission: '',
      dialogBalance: false,
      showAddressFlag: false,
      addressObj: []
    }
  },
  mounted() {
    const un = window.localStorage.getItem('user')
    const pe = window.localStorage.getItem('permission')
    if (un) {
      this.avatar = JSON.parse(un).username
    }
    if (pe) {
      this.permission = JSON.parse(pe).adminType
    }
  },
  methods: {
    showAddress() {
      this.showAddressFlag = true
      this.$store.dispatch('getRechargeAddress', '').then((res) => {
        this.addressObj = res
      }).catch()
    },
    setReserve() {
      this.$store.dispatch('putReserved', this.reserved.eth).then(() => {
        this.$message.success('修改成功')
        this.dialogBalance = false
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    setFee() {
      this.$store.dispatch('putFeeData', this.fee).then(() => {
        this.$message.success('修改成功')
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .balance{
    float:right;
    & span {
      cursor:pointer;
      display: inline-block;
      margin-right:150px;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 19px;
        font-size: 12px;
      }
    }
  }
}
</style>

