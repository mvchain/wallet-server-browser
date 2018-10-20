<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar :fee="newFee" :reserved="reserve" :withdrawManage="withdrawManage"></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

export default {
  name: 'layout',
  data() {
    return {
      newFee: {
        ethGas: 0,
        btcGas: 0
      },
      reserve: {
        eth: 0
      },
      withdrawManage: {}
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  mounted() {
    this.$store.dispatch('getFeeData').then((res) => {
      this.newFee.ethGas = res[0].gas
      this.newFee.btcGas = res[1].gas
    }).catch()
    this.$store.dispatch('getReserved').then((res) => {
      this.reserve.eth = res
    }).catch()
    this.$store.dispatch('getWithdrawManage', 'eth').then((res) => {
      this.withdrawManage = res
    }).catch()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
