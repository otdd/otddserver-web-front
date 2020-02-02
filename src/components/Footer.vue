<template>
<div id="footer" class="stiky-bottom">
	otdd. online test driven development.
</div>
</template>

<script>
export default {
  name: 'Footer',
  components: {},
  props:[],
  data () {
    return {
    }
  },
  created () {
	this.getData()
  },
  mounted(){
    this.intervalId1 = setInterval(() => {
        var app = document.getElementById('app')
	  	if(app.offsetHeight>window.innerHeight){
	  		document.getElementById('footer').classList.remove('stiky-bottom');
	  		clearInterval(this.intervalId1)
	  	}
    }, 200)
    this.intervalId2 = setInterval(() => {
		clearInterval(this.intervalId1)
		clearInterval(this.intervalId2)
    },5000)
  },
  methods: {
  	getData(){
  	},
  }
}
</script>

<style scoped>
#footer{
	background:#eee;
	width:100%;
	height:24px;
	line-height:24px;
	margin-top:40px;
}
.stiky-bottom{
	position: absolute;
	bottom:0;
}
</style>