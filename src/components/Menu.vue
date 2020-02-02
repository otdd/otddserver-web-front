<template>
<div class="menu-list">
	<ul class="menu">
    <li v-for="m in menu">
      <router-link class="link" :to="'' + m.url">
        {{ m.name }}
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Menu',
  props:['menu'],
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.menu-list{
  float: left;
  margin-left:20px;
}
.menu li{
  text-align: left;
  padding:0px 0px 6px 0px;
}
.link:hover{
  color:#2c3e50;
}
</style>