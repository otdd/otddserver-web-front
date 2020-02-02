<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-panel{
  margin-left:200px;
  padding-right: 10px;
  margin-right: 10px;
}

ul, li {
  list-style-type: none;
}

.list {
  line-height: 2;
}

.list li {
  border-bottom: 1px solid #ddd;
}

.clear{
  clear: both;
}

textarea.ivu-input{
  font-size:12px;
}

.ivu-card-head{
  background: #eee;
  padding: 4px 0px;
}

.hide{
  display:none
}

.ivu-btn-primary{
  background-color: #FFF !important;
  color: #2d8cf0 !important;
}

.ivu-btn-primary:hover{
  color: #2c3e50 !important;
}
</style>
