<template>
<div class="clear">
  <Header v-bind:moduleId="id" v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
  <div class="main-panel">
    <table class="task-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px;">
      <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
        <th style="width:60px;">Task Id</th>
        <th>Target</th>
        <th style="width:200px;">Create Time</th>
        <th style="width:100px;">Details</th>
      </tr>
      <tr v-for="task in tasks" class="task" >
        <td>{{ task.id }}</td>
        <td>{{ task.target }}</td>
        <td>{{ task.createTime }}</td>
        <td><Button type="primary" v-on:click="viewDetails(task.id)" size="small">details</Button></td>
      </tr>
    </table>
    <Page v-bind='pageInfo' @on-change="onPageChange" simple></Page>
  </div>
  <Footer></Footer>
</div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Menu from '../components/Menu.vue'
export default {
  name: 'TaskList',
  components: { Header,Footer,Menu},
  data () {
    return {
      headerMenu:[],
      leftBarMenu:[],
      id:this.$route.params.id,
      tasks:[],
      pageInfo:{
        "current":1,
        "pageSize":10,
        "total":0
      },
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
        this.headerMenu.push({name:'task list',url:'/tasklist/'+this.id})
      })

      this.leftBarMenu = [
        {name:'Task List',url:'/tasklist/'+this.id},
      ]
      document.title = 'task list'
    },
    getData () {
      this.$api.post('taskrun/getTaskList', {"moduleId":this.id,"pageInfo":this.pageInfo}, r => {
        this.tasks = r.data.tasks
        this.pageInfo = r.data.pageInfo
      })
    },
    onPageChange(curPage){
      this.pageInfo.current = curPage
      this.getData()
    },
    viewDetails(taskId){
      window.open("#task/"+taskId)
    }
  },
}
</script>

<style scoped>
.task-list-table{
  border:1px solid #eee;
  border-bottom:none;
}
.task-list-table th{
  padding: 6px 0px;
}
.task-list-table td{
  padding: 8px 0px;
}
.task-list-table td{
  border-bottom: 1px solid #eee;
}
.task:hover{
  background:#d5e8fc;
}
</style>
