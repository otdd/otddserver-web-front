<template>
<div class="clear">
  <Header v-bind:moduleId="id" v-bind:menu="headerMenu"></Header>
	<Menu v-bind:menu="leftBarMenu"></Menu>
	<div class="main-panel">
		<TargetHost v-bind:module-id="id" v-on:run="run"></TargetHost>
		<div class="test-store">
  			<TestList v-bind:search-query="searchQuery" v-on:selectedTests="selectedTests"></TestList>
		</div>
	</div>
  <Footer></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Menu from '../components/Menu.vue'
import TargetHost from '../components/TargetHost.vue'
import TestList from '../components/TestList.vue'

export default {
  name: 'Module',
  components: { Header,Footer,Menu,TargetHost,TestList },
  data () {
    return {
      id:this.$route.params.id,
      searchQuery:{
        moduleId:parseInt(this.$route.params.id)
      },
      headerMenu:[],
      leftBarMenu:[],
      tests:{}
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
      this.$api.post('module/getModule', {id:this.id}, r => {
        this.headerMenu.push({name:r.data.name,url:'/module/'+this.id})
        document.title = r.data.name+' [otdd]'
      })

      this.leftBarMenu = [
        {name:'Task List',url:'/tasklist/'+this.id},
        /*{name:'Configure',url:'/task/54'},*/
      ]

    },
    getData(){
      
    },
    selectedTests(tests){
      this.tests = tests
    },
    run(data){
      if(this.tests.type==null||this.tests.type==0){
        if(this.tests.testIds==null||this.tests.testIds.length==0){
          this.$Message.warning('please select at least one test to run.');
          return
        }
      }
      this.$api.post('taskrun/newTask',{"moduleId":this.searchQuery.moduleId,"tests":this.tests,"target":data.target,"targetPort":data.targetPort,"config":data.config} , r => {
        var taskId = r.data
        window.open("#task/"+taskId)
      },r=>{
        this.$Message.warning('failed to run.');
      })
    }
  }
}
</script>

<style scoped>
.list li{
  text-align: left;
}
</style>
