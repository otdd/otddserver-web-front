<template>
<div class="target-host">
	<div class="host">
    <span class="host-label">Target:</span>
    <Select v-model="target" placeholder="your dev target" style="width: 400px;margin-right:30px;">
      <Option v-for="target in activeTargets" :value="target" :key="target">{{ target}}</Option>
    </Select>
    <span class="host-label">TargetPort:</span>
    <Input v-model="targetPort" placeholder="the target port." style="width: 100px;margin-right:20px"></Input>
    <Button type="primary" v-on:click="run">Run</Button>
  </div>
  <div class="conf">
    <div class="conf-item" style="margin-bottom:10px">
      <span style="margin-right:10px;">mock outbound responses?</span>
      <RadioGroup v-model="config.mockOutboundCalls" style="position:relative;top:-1px;" @on-change="mockOutboundChanged" >
          <Radio label="yes"></Radio>
          <Radio label="no"></Radio>
      </RadioGroup>
    </div>
    <div class="conf-item" v-if="!hidePassthoughConnections">
      <span style="margin-right:10px;">passthrough these connections:</span>
      <Input v-model="config.passthoughConnections" placeholder="specify the ip、port、ip:port, comma separated." style="width: 500px"></Input>
    </div>
  </div>
</div>
</template>

<script>
import Menu from '../components/Menu.vue'
export default {
  name: 'Module',
  components: { Menu },
  props:['moduleId'],
  data () {
    return {
      target:'',
      targetPort:'8080',
      hidePassthoughConnections:false,
      config:{
        mockOutboundCalls:'yes',
      },
      activeTargets:[
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$api.post('taskrun/getLastTaskConfig', {moduleId:parseInt(this.moduleId)} , r => {
        this.target = r.data.target
        this.targetPort = r.data.targetPort
        this.config = r.data.config
      })
      this.$api.post('taskrun/getActiveTargets', {} , r => {
        this.activeTargets = r.data
      })
    },
    mockOutboundChanged(status){
      if(status=='yes'){
          this.hidePassthoughConnections=false
      }
      else{
          this.hidePassthoughConnections=true
      }
    },
    run(){
      if(this.target==''){
        this.$Message.warning('please select the target');
        return
      }
      if(this.targetPort==''){
        this.$Message.warning('please specify the target port');
        return
      }

      this.$emit('run',{"target":this.target,"targetPort":this.targetPort,"config":this.config});
    }
  }
}
</script>

<style scoped>
.list li{
  text-align: left;
}
.conf-item,.host{
  text-align:left;
}
.host-label{
  padding-right:10px;
}
.host{
  padding-bottom:10px;
}
.target-host{
  padding:10px;
  border:1px solid #CCC;
  margin:10px 0px 10px 0px;
}
.conf-label{
  margin-right: 10px;
  width: 360px;
  display: inline-block;
}
.conf-item{
  margin-top:10px;
}
textarea.ivu-input{
  font-size:12px !important;
}
</style>
