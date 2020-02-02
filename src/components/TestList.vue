<template>
<div class="tests">
  
  <div class="search-box">
    <div class="search-item">
      <span class="search-label">Time:</span>
      <DatePicker type="datetimerange" v-model="timeRange" placeholder="select time range" style="width: 280px;margin-right:20px;"></DatePicker>
    </div>
    <Button type="primary" style="float:left;margin-left: 188px;" v-on:click="search">Search</Button>
    <div style="clear:both; margin-top:10px;"></div>
    <div class="search-item">
      <span class="search-label">TestId:</span>
      <Input v-model="query.testId" placeholder="the test id" style="width: 280px;margin-right:64px;"></Input>
    </div>
    <div style="clear:both; margin-top:10px;"></div>
    <div class="search-item">
      <span class="search-label">Inbound Request:</span>
      <Input v-model="query.inboundReq" placeholder="text in inbound request" style="width: 280px;margin-right:64px;"></Input>
    </div>
    <div class="search-item">
      <span class="search-label">Inbound Response:</span>
      <Input v-model="query.inboundResp" placeholder="text in inbound response" style="width: 280px;margin-right:20px;"></Input>
    </div>
    <div style="clear:both; margin-top:10px;"></div>
    <div class="search-item">
      <span class="search-label">Outbound Requests:</span>
      <Input v-model="query.outboundReq" placeholder="text in outbound request" style="width: 280px;margin-right:64px;"></Input>
    </div>
    <div class="search-item">
      <span class="search-label">Outbound Responses:</span>
      <Input v-model="query.outboundResp" placeholder="text in outbound response" style="width: 280px;margin-right:20px;"></Input>
    </div>
    <div style="clear:both;"></div>
  </div>

  <div style="clear:both;"></div>
  <div style="margin:10px 0px;">
    <Tabs v-model="selectedTab" style="float:left;width:480px;" @on-click="testsTabClicked">
      <TabPane label="online-recorded" name="test_store">
        <div class="test-list">
          <div style="text-align:left;">
            <Checkbox v-model="testStore.selectThisPage" @on-change="onSelectThisPageChange">Select This Page</Checkbox>
            <Checkbox v-model="testStore.selectAll" @on-change="onSelectAllChange">Select All</Checkbox>
          </div>
          <ul class="test-list-data" style="margin:10px 0px 20px 0px">
            <CheckboxGroup v-model="testStore.selectedTests" @on-change="onSelectedTestsChange">
              <li v-for="testLabel in testStore.tests.testLabels" class="test-label-li" v-bind:class="{ selected: testStore.testId==testLabel.id }">
                <Checkbox v-bind:label="testLabel.id" style="margin-right:0px;">&nbsp;</Checkbox>
                <span class="text-label" v-on:click="testLabelClicked(testLabel.id)">
                {{ testLabel.label.length>68?testLabel.label.substring(0, 68)+'..':testLabel.label }}
                </span>
              </li>
            </CheckboxGroup>
          </ul>
          <Page v-bind='testStore.pageInfo' @on-change="onPageChange" simple></Page>
        </div>
      </TabPane>
      <TabPane label="edited" name="edit_test">
        <div class="test-list">
          <div style="text-align:left;">
            <Checkbox v-model="edited.selectThisPage" @on-change="onSelectThisPageChange">Select This Page</Checkbox>
            <Checkbox v-model="edited.selectAll" @on-change="onSelectAllChange">Select All</Checkbox>
          </div>
          <ul class="test-list-data" style="margin:10px 0px 20px 0px">
            <CheckboxGroup v-model="edited.selectedTests" @on-change="onSelectedTestsChange">
              <li v-for="testLabel in edited.tests.testLabels" class="test-label-li" v-bind:class="{ selected: edited.testId==testLabel.id }">
                <Checkbox v-bind:label="testLabel.id" style="margin-right:0px;">&nbsp;</Checkbox>
                <span class="text-label" v-on:click="testLabelClicked(testLabel.id)">
                {{ testLabel.label.length>68?testLabel.label.substring(0, 68)+'..':testLabel.label }}
                </span>
              </li>
            </CheckboxGroup>
          </ul>
          <Page v-bind='edited.pageInfo' @on-change="onPageChange" simple></Page>
        </div>
      </TabPane>
    </Tabs>
    <div class="test-detail">
      <div style="margin:10px 0px;">
        test-id:<span style="margin:0px 10px">{{testData.id}}</span>
        <Button type="primary" style="float:right;" v-on:click="edit">Edit</Button>
      </div>
      <Modal v-model="showModal" width="1000">
        <p slot="header" style="color:#666;text-align:center">
          <span style="position: relative;top: 1px;">the details</span>
        </p>
        <div style="height:400px;word-break:break-all;overflow-y:scroll;padding-bottom:10px;">
          <Tabs v-model="selectedTestDetailTab" style="height: 390px;" @on-click="onDetailTabClicked">
            <TabPane label="raw content" name="content">
              <div style="height:400px;word-break:break-all;overflow-y:scroll;padding-bottom:10px;" v-html="rawContent">
              </div>
            </TabPane>
            <TabPane label="ddl" name="ddl">
              <div class="ddl-codec-select" style="margin-bottom:20px;border-radius:4px;padding: 10px;border: 1px solid #eee;">
                <span style="float:left;line-height:32px;">ddl decoder:</span>
                <Select v-model="parseToDDLResult.pluginName" style="width:200px;margin-left:10px;float:left;" @on-change="onDDLPluginChanged">
                  <Option v-for="pluginName in pluginNameList" :value="pluginName" :key="pluginName">{{ pluginName }}</Option>
                </Select>
                <div v-for="setting in pluginSettings.settings">
                  <div style="float:left;line-height:32px;margin-left:10px;" >{{ setting.name }}:</div>
                  <Select v-if="setting.type=='select'" v-model="setting.currentValue" style="min-width:120px;width:auto;margin-left:10px;float:left;">
                    <Option v-for="value in setting.values" :value="value" :key="value">{{ value }}</Option>
                  </Select>
                </div>
                <Button type="primary" v-on:click="reParseToDDL" style="float:left;margin-left:20px;">ok</Button>
                <div style="clear:both;"></div>
              </div>
              <div>
                <div style="height:400px;word-break:break-all;overflow-y:scroll;padding-bottom:10px;" v-html="parseToDDLResult.ddl">
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div slot="footer">
          <div @click="showModal = false" style="cursor:pointer;float:right;width:28px;">close</div>
          <div style="clear:both;"></div>
        </div>
      </Modal>
      <div class="test-data" v-bind:class="{ hide: testData.inbound.request=='' }">
        <div style="float:left">
          <div class="inbound-req">
            <div class="data-item" v-on:click="inboundReqClicked">{{limitLength(base64decode(testData.inbound.request))}}</div>
            <Icon type="arrow-right-a"></Icon>
            <div style="clear:both;"></div>
          </div>
          <div class="inbound-resp" v-bind:style="{top: inboundRespTop+'px'}" style="position: relative;">
            <div class="data-item" v-on:click="inboundRespClicked">{{limitLength(base64decode(testData.inbound.response))}}</div>
            <Icon type="arrow-left-a"></Icon>
            <div style="clear:both;"></div>
          </div>
        </div>
        <div v-bind:style="{height: splitLineHeight+'px'}" style="float:left;width:1px;background: #CCC; margin:0px 2px;"></div>
        <div style="float:left">
          <div v-for="(outbound,index) in testData.outbounds" class="outbound" v-bind:class="{first:index==0}">
            <div class="outbound-req">
              <Icon type="arrow-right-a"></Icon>
              <div class="data-item" v-on:click="outboundReqClicked({index})">{{limitLength(base64decode(outbound.request))}}</div>
              <div style="clear:both;"></div>
            </div>
            <div class="outbound-resp">
              <Icon type="arrow-left-a"></Icon>
              <div class="data-item" v-on:click="outboundRespClicked({index})">{{limitLength(base64decode(outbound.response))}}</div>
              <div style="clear:both;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
  </div>
</div>
</template>

<script>
let Base64 = require('js-base64').Base64;
export default {
  name: 'TestList',
  props:['searchQuery'],
  components: {},
  data () {
    return {
      query:this.searchQuery,
      timeRange:[
        new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 30),
        new Date()
      ],
      testData:{
        inbound:{
          request:''
        }
      },
      selectedTab:'test_store',
      testStore:{
        tests:{},
        pageInfo:{
          "current":1,
          "pageSize":40,
          "total":0
        },
        selectedTests:[],
        testId:'',
        selectThisPage: false,
        selectAll: false,
        tabLoaded:false
      },
      edited:{
        tests:{},
        pageInfo:{
          "current":1,
          "pageSize":40,
          "total":0
        },
        selectedTests:[],
        testId:'',
        selectThisPage: false,
        selectAll: false,
        tabLoaded:false
      },
      inboundRespTop:0,
      splitLineHeight:200,
      heightPerOutbound:130,
      showModal: false,
      selectedTestDetailTab:'content',
      rawContent:'',
      parseToDDLQuery:{
        testId:'',
        type:'',
        index:0,
        testStoreType:''
      },
      parseToDDLResult:{
        pluginName:'',
        protocol:'',
        ddl:''
      },
      pluginNameList:[
      ],
      pluginSettings:{
        settings:[]
      },
    }
  },
  created () {
    this.getTests()
  },
  methods: {
    getTests () {
      this.query.startTime = this.formatDate(this.timeRange[0])
      this.query.endTime = this.formatDate(this.timeRange[1])
      if(this.isTestStoreTabSelected()){
        this.query.testStoreType = 'ONLINE_RECORDED_TEST'
        this.$api.post('search/search', this.query , r => {
          this.testStore.tests = r.data
          if(this.testStore.tests.testLabels.length>0){
            this.testStore.testId = this.testStore.tests.testLabels[0].id
            this.getTestData()
          }
          this.testStore.pageInfo = this.testStore.tests.pageInfo
          this.testStore.tabLoaded = true
        })
      }
      else if(this.isEditTabSelected()){
        this.query.testStoreType = 'EDITED_TEST'
        this.$api.post('search/search', this.query , r => {
          this.edited.tests = r.data
          if(this.edited.tests.testLabels.length>0){
            this.edited.testId = this.edited.tests.testLabels[0].id
            this.getTestData()
          }
          this.edited.pageInfo = this.edited.tests.pageInfo
          this.edited.tabLoaded = true
        })
      }
    },
    onPageChange(curPage){
      if(this.isTestStoreTabSelected()){
        this.query.pageInfo = {
          "current":curPage,
          "pageSize":this.testStore.pageInfo.pageSize     
        }
        this.getTests()
      }
      else if(this.isEditTabSelected()){
        this.query.pageInfo = {
          "current":curPage,
          "pageSize":this.edited.pageInfo.pageSize     
        }
        this.getTests()
      }
    },
    search(){
      if(this.isTestStoreTabSelected()){
        this.testStore.selectedTests = []
        this.query.pageInfo = {
          "current":1,
          "pageSize":this.testStore.pageInfo.pageSize     
        }
      }
      else if(this.isEditTabSelected()){
        this.edited.selectedTests = []
        this.query.pageInfo = {
          "current":1,
          "pageSize":this.edited.pageInfo.pageSize     
        }
      }
      this.getTests()
    },
    testsTabClicked(name){
      if(name=='test_store'){
        if(!this.testStore.tabLoaded){
          this.getTests()
        }
        else{
          this.getTestData()
        }
      }
      if(name=='edit_test'){
        if(!this.edited.tabLoaded){
          this.getTests()
        }
        else{
          this.getTestData()
        }
      }
    },
    testLabelClicked(testId){
      if(this.isTestStoreTabSelected()){
        this.testStore.testId = testId
        this.getTestData()
      }
      else if(this.isEditTabSelected()){
        this.edited.testId = testId
        this.getTestData()
      }
    },
    onSelectThisPageChange(selected){
      if(this.isTestStoreTabSelected()){
        if(selected){
          this.testStore.selectAll = false
            var tmp = []
            for(var i = 0; i < this.testStore.tests.testLabels.length; i++){
              tmp.push(this.testStore.tests.testLabels[i].id)
            }
            this.testStore.selectedTests = tmp
        }
        else{
          this.testStore.selectedTests = []
        }
      }
      else if(this.isEditTabSelected()){
        if(selected){
          this.edited.selectAll = false
            var tmp = []
            for(var i = 0; i < this.edited.tests.testLabels.length; i++){
              tmp.push(this.edited.tests.testLabels[i].id)
            }
            this.edited.selectedTests = tmp
        }
        else{
          this.edited.selectedTests = []
        }
      }
      this.emitSelectedTests()
    },
    onSelectAllChange(data){
      if(this.isTestStoreTabSelected()){
        if(data){
          this.testStore.selectThisPage = false
          var tmp = []
          for(var i = 0; i < this.testStore.tests.testLabels.length; i++){
            tmp.push(this.testStore.tests.testLabels[i].id)
          }
          this.testStore.selectedTests = tmp
        }
        else{
          this.testStore.selectedTests = []
        }
      }
      else if(this.isEditTabSelected()){
        if(data){
          this.edited.selectThisPage = false
          var tmp = []
          for(var i = 0; i < this.edited.tests.testLabels.length; i++){
            tmp.push(this.edited.tests.testLabels[i].id)
          }
          this.edited.selectedTests = tmp
        }
        else{
          this.edited.selectedTests = []
        }
      }
      this.emitSelectedTests()
    },
    onSelectedTestsChange(data){
      this.emitSelectedTests()
    },
    emitSelectedTests(){
      if(this.isTestStoreTabSelected()){
        if(this.testStore.selectAll){
          this.$emit('selectedTests',{"type":1,"query":this.query,"testStoreType":"ONLINE_RECORDED_TEST"})
        }
        else{
          this.$emit('selectedTests',{"type":0,"testIds":this.testStore.selectedTests,"testStoreType":"ONLINE_RECORDED_TEST"})
        }
      }
      else if(this.isEditTabSelected()){
        if(this.edited.selectAll){
          this.$emit('selectedTests',{"type":1,"query":this.query,"testStoreType":"EDITED_TEST"})
        }
        else{
          this.$emit('selectedTests',{"type":0,"testIds":this.edited.selectedTests,"testStoreType":"EDITED_TEST"})
        }
      }
    },
    getTestData(){
      if(this.isTestStoreTabSelected()){
        this.$api.post('teststore/getTest', {id:this.testStore.testId,moduleId:this.query.moduleId} , r => {
          this.testData = r.data
          this.testData.testStoreType = 'ONLINE_RECORDED_TEST'
          var size = r.data.outbounds.length
          for (var i = 0; i < r.data.outbounds.length; i++) {
            if ( r.data.responseTimestamp < r.data.outbounds[i].responseTimestamp ) {
              size = i
              break
            }
          }
          this.inboundRespTop = size * this.heightPerOutbound
          if(size>0){
            this.inboundRespTop = this.inboundRespTop + 16
          }
          this.splitLineHeight = (r.data.outbounds.length)*this.heightPerOutbound+160
          if(this.splitLineHeight<280){
            this.splitLineHeight = 280
          }
        })
      }
      else if(this.isEditTabSelected()){
        this.$api.post('edit/getEditTest', {id:this.edited.testId} , r => {
          this.testData = r.data
          this.testData.testStoreType = 'EDITED_TEST'
          var size = r.data.outbounds.length
          for (var i = 0; i < r.data.outbounds.length; i++) {
            if ( r.data.responseTimestamp < r.data.outbounds[i].responseTimestamp ) {
              size = i
              break
            }
          }
          this.inboundRespTop = size * this.heightPerOutbound
          if(size>0){
            this.inboundRespTop = this.inboundRespTop + 16
          }
          this.splitLineHeight = (r.data.outbounds.length)*this.heightPerOutbound+160
          if(this.splitLineHeight<280){
            this.splitLineHeight = 280
          }
        })
      }
    },
    edit(){
      if(this.isTestStoreTabSelected()){
        this.$api.post('edit/newEdit',{"moduleId":this.query.moduleId,"testId":this.testStore.testId} , r => {
          var editTestId = r.data
          window.open("#edit/"+editTestId)
        },r=>{
          this.$Message.warning('failed to edit.');
        })
      }
      else if(this.isEditTabSelected()){
        window.open("#edit/"+this.edited.testId)
      }
    },
    isTestStoreTabSelected(){
      if(this.selectedTab == 'test_store'){
        return true
      }
      return false
    },
    isEditTabSelected(){
      if(this.selectedTab == 'edit_test'){
        return true
      }
      return false
    },
    inboundReqClicked(){
      this.rawContent = this.$util.toPrettyHtml(this.base64decode(this.testData.inbound.request))
      this.parseToDDLQuery.type = 'inboundReq'
      this.clearModalData()
      this.showModal = true
    },
    inboundRespClicked(){
      this.rawContent = this.$util.toPrettyHtml(this.base64decode(this.testData.inbound.response))
      this.parseToDDLQuery.type = 'inboundResp'
      this.clearModalData()
      this.showModal = true
    },
    outboundReqClicked(index){
      this.rawContent = this.$util.toPrettyHtml(this.base64decode(this.testData.outbounds[index.index].request))
      this.parseToDDLQuery.type = 'outboundReq'
      this.parseToDDLQuery.index = index.index
      this.clearModalData()
      this.showModal = true
    },
    outboundRespClicked(index){
      this.rawContent = this.$util.toPrettyHtml(this.base64decode(this.testData.outbounds[index.index].response))
      this.parseToDDLQuery.type = 'outboundResp'
      this.parseToDDLQuery.index = index.index
      this.clearModalData()
      this.showModal = true
    },
    clearModalData(){
      this.parseToDDLQuery.testId = this.testData.id
      this.parseToDDLQuery.testStoreType = this.testData.testStoreType
      this.selectedTestDetailTab = 'content'
      this.pluginSettings = {
        'settings':[]
      }
    },
    onDDLPluginChanged(value){
      if(value){
        this.pluginSettings.pluginName = value
        var url = 'plugin/getPluginSettings'
        this.$api.post(url, {moduleId:this.query.moduleId,pluginName:value} , r => {
          if(this.parseToDDLQuery.type == 'outboundResp' || this.parseToDDLQuery.type == 'inboundResp'){
            this.pluginSettings.settings = r.data.response
          }
          else{
            this.pluginSettings.settings = r.data.request
          }
        })
      }
    },
    onDetailTabClicked(name){
      if(name=='ddl'){
        this.$api.post('plugin/getPluginList', {} , r => {
          this.pluginNameList = r.data
        })
        this.parseToDDL(true)
      }
    },
    reParseToDDL(){
      this.parseToDDL(false)
    },
    parseToDDL(refreshPluginSetting){
      var url = ''
      var query = {moduleId:this.query.moduleId,id:this.parseToDDLQuery.testId,pluginSettings:this.pluginSettings,testStoreType:this.parseToDDLQuery.testStoreType}
      if(this.parseToDDLQuery.type=='inboundReq'){
        url = 'ddl/parseInboundReqToDDL'
      }
      else if(this.parseToDDLQuery.type=='inboundResp'){
        url = 'ddl/parseInboundRespToDDL'
      }
      else if(this.parseToDDLQuery.type=='outboundReq'){
        url = 'ddl/parseOutboundReqToDDL'
        query.index = this.parseToDDLQuery.index
      }
      else if(this.parseToDDLQuery.type=='outboundResp'){
        url = 'ddl/parseOutboundRespToDDL'
        query.index = this.parseToDDLQuery.index
      }
      this.$api.post(url, query , r => {
        if(r.data.ddl!=null&&r.data.ddl!=''){
          this.parseToDDLResult.ddl = this.$util.toPrettyHtml(r.data.ddl)
        }
        else{
          this.parseToDDLResult.ddl = 'failed to parse.'
        }
        this.parseToDDLResult.protocol = r.data.protocol
        this.parseToDDLResult.pluginName = r.data.pluginName
        if(refreshPluginSetting){
          this.onDDLPluginChanged(this.parseToDDLResult.pluginName)
        }
      }, e=>{
        this.$Message.warning('failed to parse.');
      })
    },
    base64decode(str){
      return Base64.decode(str)
    },
    limitLength(str){
      if(str.length>65){
        str = str.substring(0,65) + '..'
      }
      return str
    },
    formatDate(date){
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      var ret = year + '-' + month + '-' + day  + ' ' + hour + ':' + minute + ':' + second
      return ret
    }
  },

}
</script>

<style scoped>
.test-list li{
  text-align: left;
}
.test-list li:hover{
  background:#eee;
}
.test-list{
  float:left;
}
.test-detail{
  float: right;
  width: 568px;
  height: 880px;
  overflow: auto;
  border: 1px solid #CCC;
  padding: 0px 20px 20px 20px;
  margin-top: 34px;
}
.data-item{
  border:1px solid #bbb;
  border-radius:6px;
  float:left;
  margin:4px 1px;
  word-break: break-all;
  width:240px;
  height:44px;
  padding:2px 6px;
  text-align: left;
  cursor:pointer;
}
.data-item:hover{
  border-color:#2d8cf0;
}
.outbound{
  border:1px dashed #bbb;
  border-radius:6px;
  padding:4px 10px 4px 3px;
  margin:16px 2px;
}
.test-data .ivu-icon{
  float:left;
  top: 20px;
  position: relative;
}
.test-data .first{
  margin-top:68px;
}
.text-label{
  font-size:12px;
  position:relative;
  left: -6px;
  cursor:pointer;
}

.search-box{
  text-align: left;
  border:1px solid #CCC;
  padding:10px 10px;
  margin-top:20px;
  margin-bottom:20px;
}
.search-item{
  float:left;
  margin:2px 0px;
}
.search-label{
  width:140px;
  display:inline-block;
}
.selected{
  background: #eee;
}
</style>

<style>
.ivu-checkbox-inner{
  border-radius: 6px !important;
}
.ivu-checkbox{
  margin-right: 4px;
}
.ivu-modal-header p{
  height:28px;
  line-height:28px;
}
</style>
