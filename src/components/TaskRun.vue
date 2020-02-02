<template>
<div class="task-run">
	<TaskRunList ref="TaskRunList" v-on:runIdSelected="runIdSelected">
	</TaskRunList>
	<TaskRunTestList ref="TaskRunTestList">
	</TaskRunTestList>   
</div>
</template>

<script>
import TaskRunList from '../components/TaskRunList.vue'
import TaskRunTestList from '../components/TaskRunTestList.vue'

export default {
  name: 'TaskRun',
  components: {TaskRunList,TaskRunTestList},
  props:['runId'],
  data () {
    return {
    	id:this.taskId,
    	selectedRunId:0
    }
  },
  created () {
        this.getData()
  },
  methods: {
    getData () {
      
    },
    pullTaskRun(){
    	this.$refs.TaskRunList.getData()
    },
    runIdSelected(id){
    	this.$refs.TaskRunTestList.runIdSelected(id)
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
