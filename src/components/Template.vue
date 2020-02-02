<template>
<div>
  <Header v-bind:moduleId="id" v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
  <div class="main-panel">
    
  </div>
  <Footer></Footer>
</div>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'Module',
  components: { Header,Footer,Menu },
  data () {
    return {
      headerMenu:[],
      leftBarMenu:[],
      id:this.$route.params.id
    }
  },
  created () {
    this.prepareMenu()
    this.getData()
  },
  methods: {
    prepareMenu(){
      this.headerMenu = [
        {name:'otdd',url:'/otdd'},
      ]
      this.leftBarMenu = [
        {name:'Manage OTDD',url:'/manage'},
        {name:'New Module',url:'/task/54'},
      ]
    },
    getData () {
      this.$api.get('module/list', null, r => {
        this.list = r.data
      })
      document.title = 'otdd'
    }
  }
}
</script>

<style scoped>
.list li{
  text-align: left;
}
</style>