<template>
<div class="clear">
  <Header v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
  <div class="main-panel">
    <table class="list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px 100px 0px;">
      <tr>
        <td class="section" colspan=3>Basic Propertise</td>
      </tr>
      <tr>
        <td class="key">name:</td>
        <td><Input v-model="module.name" placeholder="the module name" style="width: 300px;margin-right:10px;"></Input></td>
        <td class="hint">the module name</td>
      </tr>
      <tr>
        <td class="key">protocol:</td>
        <td><Input v-model="module.protocol" placeholder="the module protocol,e.g. http" style="width: 300px;margin-right:10px;"></Input></td>
        <td class="hint">the module protocol, e.g. http, thrift, etc.</td>
      </tr>
      <tr>
        <td class="section" colspan=2 style="padding-top:10px;">Tests Recording Settings</td>
      </tr>
      <tr>
        <td class="key">listen port:</td>
        <td style="text-align:left;"><Input v-model="module.listenPorts" placeholder="they helps to parse the tests out. " style="width: 300px;margin-right:10px;"></Input></td>
        <td class="hint">they help to parse the tests out. if the module has multiple listen ports, seperate them with comma.</td>
      </tr>
      <tr>
        <td class="key">filter out local ports:</td>
        <td style="text-align:left;"><Input v-model="module.ignoreLocalPorts" placeholder="multiple ports can be specified, comma seperated." style="width: 300px;margin-right:10px;"></Input></td>
        <td class="hint">they help to remove some noises. connections with these local ports are ignored.</td>
      </tr>
      <tr>
        <td class="key">filter out remote ip/ports:</td>
        <td style="text-align:left;"><Input v-model="module.ignoreRemoteIpPorts" placeholder="ip:port/ip/port, comma seperated." style="width: 300px;margin-right:10px;"></Input></td>
        <td class="hint">they help to remove some noises. connections with these remote ip/ports are ignored.</td>
      </tr>
      <tr>
        <td class="section" colspan=2 style="padding-top:10px;">Custom Plugin Settings</td>
      </tr>
      <tr>
        <td colspan=3>
          <table class="plugin-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px 10px 0px;">
            <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
              <th style="width:200px;">Plugin</th>
              <th style="border-right:1px solid #eee;">Request Settings</th>
              <th style="border-right:1px solid #eee;">Response Settings</th>
            </tr>
            <tr v-for="plugin in module.pluginConf" class="plugin">
              <td style="border-right:1px solid #eee;">{{ plugin.name }}</td>
              <td style="border-right:1px solid #eee;">
                <div v-for="setting in plugin.request">
                  <div style="float:left;line-height:32px;margin-left:10px;" >{{ setting.name }}:</div>
                  <Select v-if="setting.type=='select'" v-model="setting.currentValue" style="width:auto;margin-left:10px;float:left;">
                    <Option v-for="value in setting.values" :value="value" :key="value">{{ value }}</Option>
                  </Select>
                </div>
                <div v-show="plugin.request.length == 0">
                  -
                </div>
                <div style="clear:both;"></div>
              </td>
              <td>
                <div v-for="setting in plugin.response">
                  <div style="float:left;line-height:32px;margin-left:10px;" >{{ setting.name }}:</div>
                  <Select v-if="setting.type=='select'" v-model="setting.currentValue" style="min-width:120px;width:auto;margin-left:10px;float:left;">
                    <Option v-for="value in setting.values" :value="value" :key="value">{{ value }}</Option>
                  </Select>
                </div>
                <div v-show="plugin.response.length == 0">
                  -
                </div>
                <div style="clear:both;"></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan=3 style="padding-top:10px;"> <Button type="primary" v-on:click="onCreateClicked">create</Button></td>
      </tr>
    </table>
   
  </div>
</div>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'NewModule',
  components: { Header,Footer,Menu },
  data () {
    return {
      headerMenu:[],
      leftBarMenu:[],
      id:this.$route.params.id,
      module:{
        pluginConf:[]
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
        {name:'new module',url:'/newmodule'},
      ]
      this.leftBarMenu = [
        {name:'New Module',url:'/newmodule'},
      ]
    },
    getData () {
      document.title = 'new module'
      this.$api.get('plugin/getAllPluginSettings', null, r => {
        this.module.pluginConf = r.data
      })
    },
    onCreateClicked(){
      if(!this.module.name){
        this.$Message.warning('please specify the name');
        return;
      }
      if(!this.module.protocol){
        this.$Message.warning('please specify the protocol');
        return;
      }
      if(!this.module.listenPorts){
        this.$Message.warning('please specify the listen ports');
        return;
      }
      this.$api.post('module/newModule', this.module, r => {
        this.$Message.info('module successfully created.');
        setInterval(() => {
          window.open("#otdd")
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
.list-table td{
  text-align:left;
}
.list-table .section{
  text-align:left;
  color:#2d8cf0;
  padding-bottom:20px;
}
.list-table .key{
  text-align:left;
  width:160px;
  padding-right:10px;
}
.list-table .hint{
  color:#888;
}
.list-table td{
  padding-bottom:10px;
}
.plugin-list-table{
  border:1px solid #eee;
  border-bottom:none;
}
.plugin-list-table th{
  padding: 6px 0px;
  text-align:center;
}
.plugin-list-table td{
  padding: 8px 0px;
  text-align:center;
}
.plugin-list-table td{
  border-bottom: 1px solid #eee;
}
.plugin:hover{
  background:#d5e8fc;
}
</style>