<template>
<div class="task-run-list">
  <!-- Table :columns="columns" :data="testRuns"></Table -->
  <table  class="run-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px;">
    <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
      <th style="width:60px;">Run Id</th>
      <th style="width:140px;">Start Time</th>
      <th style="width:140px;">End Time</th>
      <th style="width:100px;">Status</th>
      <th>Progress</th>
      <th style="width:160px;">complted/total</th>
      <!--
      <th style="width:160px;">actions</th>
      -->
    </tr>
    <tr v-for="taskRun in taskRuns" v-bind:class="{ selected: selectedRunId==taskRun.id }" class="task-run" v-on:click="onTaskRunClicked(taskRun.id)">
      <td>{{ taskRun.id }}</td>
      <td>{{ taskRun.startTime }}</td>
      <td>{{ taskRun.endTime }}</td>
      <td>{{ taskRun.status }}</td>
      <td>
        <Progress :percent="progress[taskRun.id]==null?0:progress[taskRun.id].percent"></Progress>
      </td>
      <td>
        <div style="color:#666;padding-bottom:4px;">{{ progress[taskRun.id]==null?"":(progress[taskRun.id].complted+"/"+progress[taskRun.id].total) }}</div>
      </td>
      <!--
      <td>
        <Button type="primary" style="font-size:12px;padding: 2px 16px;">Logs</Button>
        <Button type="primary" style="font-size:12px;padding: 2px 16px;">Report</Button>
      </td>
      -->
    </tr>
  </table>
  <Page v-bind='pageInfo' @on-change="onPageChange" simple></Page>
</div>
</template>

<script>
export default {
  name: 'TaskRunList',
  components: { },
  data () {
    return {
      id:this.$route.params.id,
      taskRuns:[],
      pageInfo:{
        "current":1,
        "pageSize":5,
        "total":0
      },
      maxRunId:0,
      progress:[],
      selectedRunId:0
    }
  },
  created () {
    this.getData()
    this.getRunProgress()
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    getData () {

      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        this.getData()
      }, 1500)

      this.$api.post('taskrun/getTaskRunList', {"taskId":this.id,"pageInfo":this.pageInfo}, r => {
        this.taskRuns = r.data.data
        this.pageInfo = r.data.pageInfo
        var hasNew = false
        if(this.taskRuns.length>0){
          if(this.maxRunId < this.taskRuns[0].id){
            this.maxRunId = this.taskRuns[0].id
            hasNew = true
          }
        }
        if(this.taskRuns.length>0&&(hasNew||this.selectedRunId==0)){
          this.selectedRunId = this.taskRuns[0].id
          this.$emit('runIdSelected',this.selectedRunId)
        }
      })
    },
    getRunProgress(){
      clearInterval(this.getRunProgressIntervalId)
      this.getRunProgressIntervalId = setInterval(() => {
        this.getRunProgress()
      }, 1500)

      var needToReGet = false
      for(var i in this.taskRuns){
          var tmp = this.progress[''+this.taskRuns[i].id]
          if(tmp==null || tmp.percent!=100){
            needToReGet = true
          }
      }
      if(!needToReGet){
        return
      }

      var tmp = []
      for(var i = 0; i < this.taskRuns.length; i++){
        tmp.push(this.taskRuns[i].id)
      }
      var tmpStr = JSON.stringify(tmp);
      this.$api.post('taskrun/getRunProgress', {"runIds":tmpStr.substring(1,tmpStr.length-1)}, r => {
        this.progress = r.data
      })

    },
    onPageChange(curPage){
      this.pageInfo.current = curPage
      this.getData()
    },
    onTaskRunClicked(id){
      this.selectedRunId = id
      this.$emit('runIdSelected',this.selectedRunId)
    }
  }
}
</script>

<style scoped>
.run-list-table{
  border:1px solid #eee;
  border-bottom:none;
}
.run-list-table th{
  padding: 6px 0px;
}
.run-list-table td{
  padding: 4px 0px;
}
.run-list-table td{
  border-bottom: 1px solid #eee;
}
.task-run{
  cursor: pointer;
}
.task-run:hover{
  background:#d5e8fc;
}
.selected{
  background:#d5e8fc;
}
</style>
