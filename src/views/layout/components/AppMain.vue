<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view :permission="permission" :manage="manage" ></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      permission: 0,
      manage: {}
    }
  },
  mounted() {
    const un = window.localStorage.getItem('permission')
    const us = window.localStorage.getItem('user')
    if (un) {
      this.permission = Number(JSON.parse(un).adminType)
    }
    if (us) {
      this.manage = JSON.parse(us)
    }
    this.$store.dispatch('getCopyList', 'pageNum=1&pageSize=1000&orderBy=status desc,created_at desc').then((res) => {
      const a = {}
      Object.assign(a, res)
      a.list.unshift({ shopName: '全部商家', shopId: '' })
      this.$store.commit('SET_COPY_LIST', a)
    }).catch()
  }
}
</script>
