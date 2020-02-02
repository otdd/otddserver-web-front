<template>
<div class="clear">
	<Header v-bind:moduleId="moduleId" v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
	<div class="main-panel">
    	<TaskDetails v-bind:taskId="id" v-on:pullTaskRun="pullTaskRun"></TaskDetails>
    	<TaskRun v-bind:taskId="id" ref="TaskRun"></TaskRun>
	</div>
  <Footer></Footer>
</div>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import TaskDetails from '../components/TaskDetails.vue'
import TaskRun from '../components/TaskRun.vue'

export default {
  name: 'Task',
  components: { Header,Footer,Menu,TaskDetails,TaskRun },
  data () {
    return {
    	id:parseInt(this.$route.params.id),
      moduleId:0,
      headerMenu:[],
      leftBarMenu:[],
    }
  },
  created () {
    document.title = 'task details ['+this.id+']'
    this.prepareMenu()
		this.getData()
  },
  methods: {
    prepareMenu(){
      this.headerMenu = [
        {name:'otdd',url:'/otdd'},
      ]
      this.leftBarMenu = [
        {name:'Task Details',url:'/task/'+this.id},
      ]
    },
    getData () {
      this.$api.post('taskrun/getTask', {id:this.id}, r => {
        this.moduleId = r.data.moduleId
        this.$api.post('module/getModule', {id:this.moduleId}, r => {
          this.headerMenu.push({name:r.data.name,url:'/module/'+this.moduleId})
          this.headerMenu.push({name:'task details',url:'/task/'+this.id})
        })
        
      })
    },
    pullTaskRun () {
    	this.$refs.TaskRun.pullTaskRun()
    }
  }
}
</script>

<style scoped>
.hidden{
	display:none;
}
.label, .value{
	font-size:12px;
}
.label{
	color:#888;
}
.item{
	float:left;
	margin-right:20px;
	min-width:200px;
	text-align:left;
}
.range-item{
	float:left;
	margin-right:20px;
}
</style>