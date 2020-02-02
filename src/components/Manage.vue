<template>
<div>
  <Header v-bind:moduleId="id" v-bind:menu="headerMenu"></Header>
  <Menu v-bind:menu="leftBarMenu"></Menu>
  <div class="main-panel">
    <Tabs v-model="selectedTab" @on-click="tabClicked">
      <TabPane label="installed ddl-plugins" name="plugin">
        <table v-if="plugins.length>0" class="plugin-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px 100px 0px;">
          <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
            <th style="width:140px;">Plugin</th>
            <th style="width:140px;border-right:1px solid #eee;">Plugin Version</th>
            <th style="border-right:1px solid #eee;">Request Settings</th>
            <th style="border-right:1px solid #eee;">Response Settings</th>
          </tr>
          <tr v-for="plugin in plugins" class="plugin">
            <td style="border-right:1px solid #eee;">{{ plugin.pluginName }}</td>
            <td style="border-right:1px solid #eee;">{{ plugin.pluginVersion }}</td>
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
        <div style="padding:60px 20px 200px 20px;text-align:left;" v-if="plugins.length<=0">
            <span>no ddl plugins installed yet. please go to the tab "ddl-plugin store" to install them.</span>
            <Button type="primary" style="margin-left:40px" v-on:click="goToStore">ok</Button>
        </div>
        <Button type="primary" v-on:click="onSaveClicked" v-if="plugins.length>0">save</Button>
      </TabPane>
      <TabPane label="ddl-plugin store" name="store">
        <table class="plugin-list-table" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0px 100px 0px;">
          <tr style="background:#eee;padding:10px; width:100%;margin-bottom:10px;">
            <th style="width:140px;">Plugin</th>
            <th style="width:140px;">Protocol</th>
            <th style="border-right:1px solid #eee;">Description</th>
            <th style="width:140px;border-right:1px solid #eee;">Plugin Version</th>
            <th style="width:140px;border-right:1px solid #eee;">Installed Plugin</th>
            <th style="width:140px;border-right:1px solid #eee;">Installed Version</th>
            <th style="width:140px;border-right:1px solid #eee;">Install/Replace</th>
            <th style="width:140px;border-right:1px solid #eee;">Delete</th>
          </tr>
          <tr v-for="(plugin,index) in pluginsInStore.plugins" class="plugin">
            <td style="border-right:1px solid #eee;">{{ plugin.pluginName }}</td>
            <td style="border-right:1px solid #eee;">{{ plugin.protocol }}</td>
            <td style="border-right:1px solid #eee;">{{ plugin.description }}</td>
            <td style="border-right:1px solid #eee;">{{ plugin.pluginVersion }}</td>
            <td style="border-right:1px solid #eee;"><span v-if="plugin.installedPluginName">{{ plugin.installedPluginName }}</span><span v-if="!plugin.installedPluginName">-</span></td>
            <td style="border-right:1px solid #eee;"><span v-if="plugin.installedVersion ">{{ plugin.installedVersion }}</span><span v-if="!plugin.installedVersion">-</span></td>
            <td style="border-right:1px solid #eee;">
              <Button type="primary" v-if="plugin.operation==0" v-on:click="onAddClicked(index)" :loading="loading[index].loading">
                <span v-if="!loading[index].loading">add</span>
                <span v-else>downloading..</span>
              </Button>
              <Button type="primary" v-if="plugin.operation==1" v-on:click="onReplaceClicked(index)" :loading="loading[index].loading">
                <span v-if="!loading[index].loading">replace</span>
                <span v-else>downloading..</span>
              </Button>
              <span v-if="plugin.operation==2">-</span>
            </td>
            <td style="border-right:1px solid #eee;">
              <Button type="primary" v-if="plugin.installedPluginName" v-on:click="onDeleteClicked(index)" :loading="loading[index].deleteLoading">
                <span v-if="!loading[index].deleteLoading">delete</span>
                <span v-else>deleting..</span>
              </Button>
            </td>
          </tr>
        </table>
        <Page v-bind='pluginsInStore.pageInfo' @on-change="onPluginsInStorePageChange" simple style="margin-top:24px;"></Page>
      </TabPane>
    </Tabs>
  </div>
  <Footer></Footer>
</div>
</template>

<script>
import Menu from '../components/Menu.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'Manage',
  components: { Header,Footer,Menu },
  data () {
    return {
      headerMenu:[],
      leftBarMenu:[],
      selectedTab:'plugin',
      id:this.$route.params.id,
      plugins:[
      ],
      pluginsInStore:{
        pageInfo:{
          "current":1,
          "pageSize":10,
          "total":0
        },
        plugins:[
        ]
      },
      //need to declare loading first, or it won't bind.
      loading:[
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
          {
           loading: false,
           deleteLoading: false
          },
      ]
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
        {name:'manage',url:'/manage'},
      ]
      this.leftBarMenu = [
        {name:'Manage OTDD',url:'/manage'},
      ]
    },
    getData () {
      document.title = 'manage otdd'
      this.$api.get('plugin/getAllPluginSettings', null, r => {
        this.plugins = r.data
      })
    },
    goToStore(){
      this.selectedTab = 'store'
      this.tabClicked()
    },
    tabClicked(){
      if(this.selectedTab == 'store'){
        this.getPluginListInStore()
      }
    },
    getPluginListInStore(){
        this.$api.post('plugin/getPluginListInStore', {pageInfo:this.pluginsInStore.pageInfo}, r => {
          this.pluginsInStore.plugins = r.data.data
          this.pluginsInStore.pageInfo = r.data.pageInfo
        })
    },
    onPluginsInStorePageChange(curPage){
        this.pluginsInStore.pageInfo = {
          "current":curPage,
          "pageSize":this.pluginsInStore.pageInfo.pageSize
        }
        this.getPluginListInStore()
    },
    onSaveClicked(){
      this.$api.post('plugin/saveAllPluginSettings', this.plugins, r => {
        this.$Message.info('module successfully created.');
      })
    },
    onAddClicked(index){
      this.loading[index].loading = true
      this.$api.post('plugin/installPlugin', {downloadUrl:this.pluginsInStore.plugins[index].downloadUrl}, r => {
        setTimeout(function(){
          this.$Message.info('plugin successfully added.')
          this.loading[index].loading = false
          this.tabClicked();
        }.bind(this),3000)
      },e=>{
        this.$Message.warning({content:'failed to add plugin, please make sure the otddserver has internet access. ',duration:10000})
        this.$Message.warning({content:'you can also manually download it at: '+this.pluginsInStore.plugins[index].downloadUrl+' and put it into otddserver\'s plugins folder.',duration:10000})
        this.loading[index].loading = false
      })
    },
    onReplaceClicked(index){
      this.loading[index].loading = true
      this.$api.post('plugin/installPlugin', {existingPluginName:this.pluginsInStore.plugins[index].installedPluginName,downloadUrl:this.pluginsInStore.plugins[index].downloadUrl}, r => {
        setTimeout(function(){
          this.$Message.info('plugin successfully updated.')
          this.loading[index].loading = false
          this.tabClicked();
        }.bind(this),3000)
      },e=>{
        this.$Message.warning({content:'failed to replace plugin, please make sure the otddserver has internet access.',duration:10000})
        this.$Message.warning({content:'you can also manually download it at: '+this.pluginsInStore.plugins[index].downloadUrl+' and put it into otddserver\'s plugins folder.',duration:10000})
        this.loading[index].loading = false
      })
    },
    onDeleteClicked(index){
      this.loading[index].deleteLoading = true
      this.$api.post('plugin/deletePlugin', {pluginName:this.pluginsInStore.plugins[index].installedPluginName}, r => {
        setTimeout(function(){
          this.$Message.info('plugin successfully deleted.')
          this.loading[index].deleteLoading = false
          this.tabClicked();
        }.bind(this),3000)
      },e=>{
        this.$Message.warning('failed to delete plugin, please retry.',2000)
        this.loading[index].deleteLoading = false
      })
    }
  }
}
</script>

<style scoped>
.plugin-list-table{
  border:1px solid #eee;
  border-bottom:none;
}
.plugin-list-table th{
  padding: 6px 0px;
}
.plugin-list-table td{
  padding: 8px 0px;
}
.plugin-list-table td{
  border-bottom: 1px solid #eee;
}
.plugin:hover{
  background:#d5e8fc;
}
</style>
