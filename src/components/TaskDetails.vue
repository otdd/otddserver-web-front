<template>
<div>
    	<Card dis-hover>
			<p slot="title" style="font-weight:normal">task-details</p>
			<div style="float:left;">
				<div class="item">
					<span class="label">Task Id:</span>
					<span class="value">{{id}}</span>
				</div>
				<div class="item">
					<span class="label">Module Id:</span>
					<span class="value">{{task.moduleId}}</span>
				</div>
				<div class="item">
					<span class="label">Create Time:</span>
					<span class="value">{{task.createTime}}</span>
				</div>
				<div style="clear:both;"></div>
				<div class="item">
					<span class="label">Target:</span>
					<span class="value">{{task.target}}</span>
				</div>
				<div style="clear:both;"></div>
				<div class="item">
					<span class="label">Mock Outbound Responses:</span>
					<span class="value">{{task.config.mockOutboundCalls}}</span>
				</div class="item">
				<div class="item" v-bind:class="{hidden:hidePassthoughConnections}">
					<span class="label">Passthrough Connections:</span>
					<span class="value">{{task.config.passthoughConnections}}</span>
				</div>
				<div style="clear:both;"></div>
			</div>
			<div>
				<Button type="primary" v-on:click="rerun" style="position:relative;top:22px;">Rerun</Button>
			</div>
			<div style="clear:both;"></div>

			<div style="float:left;margin-top:20px;border-top:1px dashed #CCC;width:100%;padding-top:12px;">
				<div v-if="task.tests.type==0">
					<span class="label" style="float:left;margin-right:10px">Tests To Run:</span>
					<span class="value" style="margin-right:20px;float:left;color:#666;" v-for="id in task.tests.testIds">{{id}}</span>
				</div>
				<div v-else>
					<div class="range-item">
						<span class="label">Test Range:</span>
					</div>
					<div v-if="task.tests.query.startTime" class="range-item">
						<span class="label">Start Time:</span>
						<span class="value" >{{task.tests.query.startTime}}</span>
					</div>
					<div v-if="task.tests.query.endTime" class="range-item">
						<span class="label">End Time:</span>
						<span class="value" >{{task.tests.query.startTime}}</span>
					</div>
					<div v-if="task.tests.query.testId" class="range-item">
						<span class="label">testId:</span>
						<span class="value" >{{task.tests.query.testId}}</span>
					</div>
					<div v-if="task.tests.query.inboundReq" class="range-item">
						<span class="label">Inbound Request:</span>
						<span class="value" >{{task.tests.query.inboundReq}}</span>
					</div>
					<div v-if="task.tests.query.inboundResp" class="range-item">
						<span class="label">Inbound Response:</span>
						<span class="value" >{{task.tests.query.inboundResp}}</span>
					</div>
					<div v-if="task.tests.query.outboundReq" class="range-item">
						<span class="label">Outbound Requests:</span>
						<span class="value" >{{task.tests.query.outboundReq}}</span>
					</div>
					<div v-if="task.tests.query.outboundResp" class="range-item">
						<span class="label">Outbound Responses:</span>
						<span class="value" >{{task.tests.query.outboundResp}}</span>
					</div>
					<div style="clear:both;"></div>
				</div>
				<div style="clear:both;"></div>
			</div>
			<div style="clear:both;"></div>
		</Card>
</div>
</template>

<script>
export default {
  name: 'TaskDetails',
  components: {},
  props:['taskId'],
  data () {
    return {
    	id:this.taskId,
    	hidePassthoughConnections:true,
    	task:{
    		target:'',
    		config:{},
    		tests:{
    			query:{}
    		}
    	}
    }
  },
  created () {
		this.getData()
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    getData () {
	/*
    	clearInterval(this.intervalId)
    	this.intervalId = setInterval(() => {
        	this.getData()	
        }, 1000)

        if('fetched'==this.task.status){
        	return
        }
	*/

	this.$api.post('taskrun/getTask', {id:this.id}, r => {
        	this.task = r.data
        	if(this.task.config.passthoughConnections!=null&&this.task.config.passthoughConnections!=''){
        		this.hidePassthoughConnections = false
        	}
      	})
    },
    rerun(){
    	this.$api.post('taskrun/rerun',{id:this.id}, r => {
    		this.$Message.info('task succesfully resubmitted.');
    		this.task.status = 'rerun'
    	},
    	e =>{
    		this.$Message.warning('failed to rerun.');
    	}
    	)
    }
  }
}
</script>

<style scoped>
.ivu-card{
	border-radius:0px;
}
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
