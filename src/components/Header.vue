<template>
<div style="margin-bottom:20px;">
	<div class="header" style="background:#2D8CF0;width:100%;height:40px;" v-on:click="onHeaderClicked()">
		<img src="../assets/logo.png" width=135 height=40 style="float:left;margin-left:0px;"/>
		<div style="float:right;margin-right:20px;line-height:40px;color:white;">{{moduleName}}</div>
		<div style="clear:both;"></div>
	</div>
	<div class="nav">
		<div class="menu-item" v-for="m in menu">
			<router-link class="link" :to="'' + m.url">
				{{m.name}} 
			</router-link>
			<Icon type="arrow-right-b" style="padding-left:20px;position: relative;top:1px;" color="#aaa"/> </div>
		<div style="clear:both;"></div>
	</div>
</div>
</template>

<script>
export default {
  name: 'Header',
  components: {},
  props:['moduleId','menu'],
  data () {
    return {
    	moduleName:'',
    }
  },
  watch: {
  	moduleId:function (newId) {
  		this.$api.post('module/getModule', {id:newId}, r => {
        	this.moduleName = r.data.name
		})
  	}
  },
  created () {
		this.getData()
  },
  methods: {
  	getData(){
  		if(this.moduleId){
  			this.$api.post('module/getModule', {id:this.moduleId}, r => {
        		this.moduleName = r.data.name
			})
		}
  	},
  	onHeaderClicked(){
		window.open('http://otdd.io')
  	},

  }
}
</script>

<style scoped>
.nav{
	padding:4px 0px 4px 10px;
	border-bottom:1px solid #ddd;
}
.menu-item{
	float:left;
	cursor:pointer;
	text-decoration: underline;
	margin-right:10px;
	padding-left:10px;
	color:#2D8CF0;
}
.link:hover{
	color:#2c3e50;
}
</style>
