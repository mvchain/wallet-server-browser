<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view :permission="permission" :manage="manage"></router-view>
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
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
