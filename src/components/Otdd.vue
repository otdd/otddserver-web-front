<template>
<div class="clear">
	<Header v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
	<div class="main-panel">
    <table class="module-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px;">
      <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
        <th style="width:400px;">Name</th>
        <th style="width:100px;">Details</th>
        <th style="width:100px;">Delete</th>
      </tr>
      <tr v-for="module in modules" class="module" >
        <td style="cursor:pointer;" v-on:click="viewDetails(module.id)">{{ module.name }}</td>
        <td><Button type="primary" v-on:click="viewDetails(module.id)" size="small">details</Button></td>
        <td><Button type="primary" v-on:click="deleteModule(module.id)" size="small">delete</Button></td>
      </tr>
    </table>
    <Page v-bind='pageInfo' @on-change="onPageChange" simple style="margin-top:24px;"></Page>
    <Modal v-model="showModal" width="400">
      <p slot="header" style="color:#666;text-align:center;">
        <span style="position: relative;top: 1px;">please confirm</span>
      </p>
      <div style="text-align:center;line-height:100px;">
        are you sure to delete the module?
      </div>
      <div slot="footer">
        <div @click="deleteModuleConfimed" style="cursor:pointer;float:right;width:48px;">delete</div>
        <div @click="showModal = false" style="cursor:pointer;float:right;width:48px;">cancel</div>
        <div style="clear:both;"></div>
      </div>
    </Modal>
	</div>
  <Footer></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Menu from '../components/Menu.vue'
export default {
  name: 'Otdd',
  components: { Header,Footer,Menu },
  data () {
    return {
      headerMenu:[],
      leftBarMenu:[],
      modules: [],
      pageInfo:{
        "current":1,
        "pageSize":10,
        "total":0
      },
      showModal:false,
      moduleIdToDelete:0
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
      ]
    },
    getData () {
      this.$api.post('module/getModuleList', {"pageInfo":this.pageInfo}, r => {
        this.modules = r.data.data
        this.pageInfo = r.data.pageInfo
      })

      document.title = 'otdd'
    },
    viewDetails(moduleId){
      window.open("#module/"+moduleId)
    },
    deleteModule(moduleId){
      this.moduleIdToDelete = moduleId
      this.showModal = true
    },
    deleteModuleConfimed(){
      this.$api.post('module/deleteModule', {"id":this.moduleIdToDelete}, r => {
        this.showModal = false
        this.$Message.info('successfully deleted.');
        setInterval(() => {
          location.reload()
        }, 1000)
      })
    },
    onPageChange(curPage){
      this.pageInfo.current = curPage
      this.getData()
    },
  }
}
</script>

<style scoped>
.module-list-table{
  border:1px solid #eee;
  border-bottom:none;
}
.module-list-table th{
  padding: 6px 0px;
}
.module-list-table td{
  padding: 8px 0px;
}
.module-list-table td{
  border-bottom: 1px solid #eee;
}
.module:hover{
  background:#d5e8fc;
}
</style>
