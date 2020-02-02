<template>
<div class="task-run-test-list" v-bind:class="{ hide: runId==0 }">
  <div style="background:#eee;width:100%;padding:10px;margin:30px 0px 0px 0px;">
    the test results for runId: {{runId}}
  </div>
  <table cellspacing="0" cellpadding="0" style="margin-top:10px;">
  <tr>
  <td style="width:120px;" valign="top">
    <ul class="test-list-data">
      <li v-for="reportedTest in reportedTests" class="test-label-li" v-bind:class="{ selected: selectedTestId==reportedTest.testId }" v-on:click="testIdClicked(reportedTest.testId)">
        {{ reportedTest.testId.length>14?reportedTest.testId.substring(0, 14)+'...':reportedTest.testId }}
      </li>
    </ul>
    <Page class="test-page" v-bind='pageInfo' @on-change="onPageChange" simple></Page>
  </td>
  <td style="width:100%;">
    <div style="position: relative;top: 1px;z-index: 10;">
      <div class="test-btn" v-bind:class="{ btnSelected: !hideReport }" v-on:click="reportTabClicked()">report</div>
      <div class="test-btn" v-bind:class="{ btnSelected: !hideLogs }" v-on:click="logsTabClicked()">runner logs</div>
      <div style="float:right;top: 1px;position: relative;">runId:{{pulledReportRunId}}&nbsp;&nbsp;&nbsp;&nbsp;testId:{{pulledReportTestId}}</div>
      <div style="clear:both;"></div>
    </div>
    <div id="report" v-bind:class="{ hide: hideReport }">
      <Modal v-model="showModal" width="1000">
        <p slot="header" style="color:#666;text-align:center">
          the diff details
        </p>
        <div style="height:400px;word-break:break-all;overflow-y:scroll;padding-bottom:10px;">
          <div class="test-diff-content" style="float:left;width:460px;">
            <div style="text-align: center;">original</div>
            <div v-html="testDiffContent" style="border: 1px dashed #ccc; min-height: 340px;padding: 10px;margin-top: 20px;color: #666;"></div>
          </div>
          <div class="result-diff-content" style="float:right;width:460px;">
            <div style="text-align: center;">actual</div>
            <div v-html="resultDiffContent" style="border: 1px dashed #ccc; min-height: 340px;padding: 10px;margin-top: 20px;color: #666;"></div>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div slot="footer">
          <div @click="showModal = false" style="cursor:pointer;float:right;width:28px;">close</div>
          <div style="clear:both;"></div>
        </div>
      </Modal>
      <div class="run-report-detail svg-container">
        <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id='arrow' orient='auto' markerWidth='6' markerHeight='4'
                    refX='0.1' refY='2'>
              <path d='M0,0 V4 L6,2 Z' style="fill: #C8E3F9;"/>
            </marker>
          </defs>
        </svg>
        <div class="online-test">
          <div class="test-data" v-bind:class="{ hide: testReport.test.inbound.request=='' }">
            <div style="float:left">
              <div class="inbound-request">
                <div class="data-item" v-on:click="testInboundReqClicked">{{limitLength(base64decode(testReport.test.inbound.request))}}</div>
                <Icon type="arrow-right-a"></Icon>
                <div style="clear:both;"></div>
              </div>
              <div class="inbound-response" v-bind:style="{top: testInboundRespTop+'px'}" style="position: relative;">
                <div class="data-item" v-on:click="testInboundRespClicked">{{limitLength(base64decode(testReport.test.inbound.response))}}</div>
                <Icon type="arrow-left-a"></Icon>
                <div style="clear:both;"></div>
              </div>
            </div>
            <div v-bind:style="{height: testSplitLineHeight+'px'}" style="float:left;width:1px;background: #CCC; margin:0px 2px;"></div>
            <div style="float:left">
              <div v-for="(outbound,index) in testReport.test.outbounds" class="outbound" v-bind:class="{first:index==0}" :index="index" >
                <div class="outbound-request">
                  <Icon type="arrow-right-a"></Icon>
                  <div class="data-item" v-on:click="testOutboundReqClicked(index)">{{limitLength(base64decode(outbound.request))}}</div>
                  <div style="clear:both;"></div>
                </div>
                <div class="outbound-response">
                  <Icon type="arrow-left-a"></Icon>
                  <div class="data-item" v-on:click="testOutboundRespClicked(index)">{{limitLength(base64decode(outbound.response))}}</div>
                  <div style="clear:both;"></div>
                </div>
              </div>
            </div>
            <div style="clear:both;"></div>
          </div>
        </div>
        <div class="test-result">
          <div class="test-data" v-bind:class="{ hide: testReport.result.inboundResult.request=='' }">
            <div style="float:left">
              <div class="inbound-request" v-bind:class="{hasDiff:testReport.result.inboundResult.requestError}">
                <div class="data-item" v-on:click="resultInboundReqClicked">
                  <span v-if="!testReport.result.inboundResult.requestError">{{limitLength(base64decode(testReport.result.inboundResult.request))}}</span>
                  <span v-if="testReport.result.inboundResult.requestError">{{limitLength(testReport.result.inboundResult.requestError)}}</span>
                </div>
                <Icon type="arrow-right-a"></Icon>
                <div style="clear:both;"></div>
              </div>
              <div class="inbound-response" v-bind:style="{top: resultInboundRespTop+'px'}" style="position: relative;" v-bind:class="{hasDiff:testReport.result.inboundResult.respDiff.theSame==false}">
                <div class="data-item" v-on:click="resultInboundRespClicked">
                  <span v-if="!testReport.result.inboundResult.responseError">{{limitLength(base64decode(testReport.result.inboundResult.response))}}</span>
                  <span v-if="testReport.result.inboundResult.responseError">{{limitLength(testReport.result.inboundResult.responseError)}}</span>
                </div>
                <Icon type="arrow-left-a"></Icon>
                <div style="clear:both;"></div>
              </div>
            </div>
            <div v-bind:style="{height: resultSplitLineHeight+'px'}" style="float:left;width:1px;background: #CCC; margin:0px 2px;"></div>
            <div style="float:left">
              <div v-for="(outbound,index) in testReport.result.outboundResults" class="outbound" v-bind:class="{first:index==0,noMatch:outbound.matchedPeerIndex<0&&!outbound.passthrough,passthrough:outbound.passthrough}" :index="index" :matched-peer-index="outbound.matchedPeerIndex">
              <Poptip trigger="hover" :content="popText[index]" placement="left">
                <div class="outbound-request" v-bind:class="{hasDiff:outbound.reqDiff.theSame==false}">
                  <Icon type="arrow-right-a"></Icon>
                  <div class="data-item" v-on:click="resultOutboundReqClicked(index)">{{limitLength(base64decode(outbound.request))}}</div>
                  <div style="clear:both;"></div>
                </div>
                <div class="outbound-response" v-bind:class="{hasDiff:outbound.respDiff.theSame==false}">
                  <Icon type="arrow-left-a"></Icon>
                  <div class="data-item" v-on:click="resultOutboundRespClicked(index)">
                    <span v-if="!outbound.responseError">{{limitLength(base64decode(outbound.response))}}</span>
                    <span v-if="outbound.responseError">{{limitLength(outbound.responseError)}}</span>
                  </div>
                  <div style="clear:both;"></div>
                </div>
              </Poptip>
              </div>
            </div>
            <div style="clear:both;"></div>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div style="clear:both;"></div>
      </div>
    </div>
    <div id="logs" v-html="logs" v-bind:class="{ hide: hideLogs }" style="background:#242424;color:#FFF;border:none">
    </div>
  </td>
  </tr>
  </table>
</div>
</template>

<script>
let Base64 = require('js-base64').Base64;
export default {
  name: 'TaskRunTestList',
  components: { },
  data () {
    return {
      runId:0,
      runIdCompleted:false,
      pageInfo:{
        "current":1,
        "pageSize":20,
        "total":0
      },
      reportedTests:[],
      selectedTestId:'',
      selectedTestStatus:'',
      pulledTimestamp:0,
      stopPullLog:0,
      clickedTestId:0,
      logs:'',
      hideReport:false,
      hideLogs:true,
      testInboundRespTop:0,
      testSplitLineHeight:200,
      resultInboundRespTop:0,
      resultSplitLineHeight:200,
      heightPerOutbound:130,
      testReportDefault:{
        "test":{
          "inbound":{request:''},
          "outbounds":[]
        },
        "result":{
          "inboundResult":{
            request:'',
            reqDiff:{},
            respDiff:{}
          },
          "outboundResults":[]
        }
      },
      testReport:{},
      showModal:false,
      testDiffContent:'',
      resultDiffContent:'',
      pulledReportRunId:0,
      pulledReportTestId:'',
      pulledLogRunId:0,
      pulledLogTestId:'',
      popText:{}
    }
  },
  created () {
    this.testReport = this.testReportDefault
    this.getData()
    this.pullLog()
    this.getTestReport()
  },
  methods: {
    getData () {

      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
          this.getData()
        }, 1500)

      if( this.runId == 0 ){
        return
      }
      if(this.runIdCompleted){
        return
      }
      this.getReportedTestList()
    },
    getReportedTestList(){
      this.$api.post('taskrun/getReportedTestList', {runId:this.runId,pageInfo:this.pageInfo}, r => {
        this.reportedTests = r.data.reportedTests
        if(r.data.completed){
          this.runIdCompleted = true
        }
        this.pageInfo = r.data.pageInfo
        if(this.reportedTests.length>0){
          if(this.clickedTestId==0&&this.selectedTestId!=this.reportedTests[0].testId){
            this.testIdSelected(this.reportedTests[0].testId)
          }
        }

        for(var i=0;i<this.reportedTests.length;i++){
          if(this.selectedTestId==this.reportedTests[i].testId){
            this.selectedTestStatus = this.reportedTests[i].status
          }
        }

      })
    },
    clearLog(){
      this.logs = ''
      this.stopPullLog = 0
      this.pulledTimestamp = 0
    },
    clearReport(){
      this.pulledReportRunId = 0
      this.pulledReportTestId = ''
      this.testReport = this.testReportDefault
    },
    clearTests(){
      this.reportedTests = []
      this.pageInfo = {
        "current":1,
        "pageSize":20,
        "total":0
      }
    },
    runIdSelected(runId){
      if(this.runId!=runId){
        this.clearLog()
        this.clearReport()
        this.clearTests()
	this.runIdCompleted = false
      }
      this.runId = runId
    },
    testIdSelected(id){
      this.selectedTestId = id
      this.clearLog()
    },
    testIdClicked(id){
      this.clickedTestId = id
      this.testIdSelected(id)
    },
    onPageChange(curPage){
      this.pageInfo = {
        "current":curPage,
        "pageSize":this.pageInfo.pageSize     
      }
      this.getReportedTestList()
    },
    pullLog(){

      clearInterval(this.pullLogIntervalId)
      this.pullLogIntervalId = setInterval(() => {
          this.pullLog()
      }, 2000)

      if(this.runId==this.pulledLogRunId&&this.selectedTestId==this.pulledLogTestId&&this.stopPullLog==1){
        return
      }

      if(this.runId==0 || this.selectedTestId==''){
        return
      }
      this.$api.post('taskrun/pullTestLog', {runId:this.runId,testId:this.selectedTestId,pulledTimestamp:this.pulledTimestamp}, r => {
        if (this.pulledTimestamp > 0 && r.data.pulledTimestamp == 0){
          this.stopPullLog=1
        }
        this.pulledTimestamp = r.data.pulledTimestamp

        for (var i = 0; i < r.data.logs.length; i++) {
          this.logs = this.logs + '<span class="log-'+r.data.logs[i].level+'">'+r.data.logs[i].log.replace(/\r\n/g , "\r").replace(/\n/g , "\r").replace(/\r/g , "<br>") + '</span>'+'<br>'
          this.pulledLogRunId = r.data.logs[i].runId
          this.pulledLogTestId = r.data.logs[i].testId
        }
      })
    },
    getTestReport(){

      clearInterval(this.getTestReportIntervalId)
      this.getTestReportIntervalId = setInterval(() => {
        this.getTestReport()
      }, 500)

      if(this.runId==this.pulledReportRunId&&this.selectedTestId==this.pulledReportTestId){
        return
      }

      this.clearReportMatchLine()
      if(this.runId==0 || this.selectedTestId==''){
        return
      }
      this.$api.post('taskrun/getTestReport', {runId:this.runId,testId:this.selectedTestId}, r => {
        this.testReport = r.data
        this.pulledReportRunId = this.testReport.runId
        this.pulledReportTestId = this.testReport.testId

        var size = r.data.test.outbounds.length
        for (var i = 0; i < r.data.test.outbounds.length; i++) {
          if ( r.data.test.inbound.responseTimestamp < r.data.test.outbounds[i].responseTimestamp ) {
            size = i
            break
          }
        }
        this.testInboundRespTop = size * this.heightPerOutbound
        if(size>0){
          this.testInboundRespTop = this.testInboundRespTop + 16
        }
        this.testSplitLineHeight = (r.data.test.outbounds.length)*this.heightPerOutbound+160
        if(this.testSplitLineHeight<280){
          this.testSplitLineHeight = 280
        }

        size = r.data.result.outboundResults.length
        for (var i = 0; i < r.data.result.outboundResults.length; i++) {
          if ( r.data.result.inboundResult.responseTimestamp < r.data.result.outboundResults[i].responseTimestamp ) {
            size = i
            break
          }
        }
        this.resultInboundRespTop = size * this.heightPerOutbound
        if(size>0){
          this.resultInboundRespTop = this.resultInboundRespTop + 16
        }
        this.resultSplitLineHeight = (r.data.result.outboundResults.length)*this.heightPerOutbound+160
        if(this.resultSplitLineHeight<280){
          this.resultSplitLineHeight = 280
        }

        for (var i = 0; i < r.data.result.outboundResults.length; i++) {
          var outbound = r.data.result.outboundResults[i]
          if(outbound.passthrough){
            this.popText[i]='passthrough outbound'
          }
          else if(outbound.handshake){
            this.popText[i]='adapted protocol handshake'
          }
          else if(outbound.matchedPeerIndex<0){
            this.popText[i]='failed to mock'
          }
          else{
            this.popText[i]='mocked outbound'
          }
        }

        //delay the drawing as the doms may not be created by vue right now.
        this.drawReportMatchLineIntervalId = setInterval(() => {
          this.drawReportMatchLine()
        }, 100)

      })
    },
    clearReportMatchLine(){
      var svg = document.getElementById('svg')
      var nodes = svg.childNodes;

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName === 'line') {
          svg.removeChild(nodes[i])
          i--;
        }
      }
    },
    drawReportMatchLine(){
      clearInterval(this.drawReportMatchLineIntervalId)
      this.clearReportMatchLine()
      var testsIndexMap = {}
      var tests = document.querySelectorAll('.online-test .outbound')
      for(var i=0;i<tests.length;i++){
        var index = tests[i].getAttribute('index')
        if (typeof index != undefined) {
          testsIndexMap[index] = tests[i]
        }
      }

      var testResults = document.querySelectorAll('.test-result .outbound')
      for(var i=0;i<testResults.length;i++){
        var index = testResults[i].getAttribute('index')
        var matchedPeerIndex = testResults[i].getAttribute('matched-peer-index')
        if (parseInt(matchedPeerIndex) >=0 ) {
          var width = 100;
          var resultNode = testResults[i]
          var testNode = testsIndexMap[matchedPeerIndex]
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('stroke', '#C8E3F9');
          line.setAttribute('stroke-width', '3');
          line.setAttribute('x1', resultNode.offsetLeft);
          line.setAttribute('y1', resultNode.offsetTop+resultNode.offsetHeight/2);
          line.setAttribute('x2', testNode.offsetLeft+testNode.offsetWidth+16);
          line.setAttribute('y2', testNode.offsetTop+testNode.offsetHeight/2);
          line.setAttribute('marker-end', 'url(#arrow)');
          svg.appendChild(line);
        }
      }

    },
    reportTabClicked(){
      this.hideReport = false
      this.hideLogs = true
    },
    logsTabClicked(){
      this.hideReport = true
      this.hideLogs = false
    },
    base64decode(str){
      if(!str || str == '' ){
        return ''
      }
      return Base64.decode(str)
    },
    limitLength(str){
      if(str.length>60){
        str = str.substring(0,60) + '..'
      }
      return str
    },
    clearModal(){
      this.testDiffContent=''
      this.resultDiffContent=''
    },
    base64byteToHtmlString(bytes){
      return this.base64decode(bytes).replace(/\r\n/g , "\r").replace(/\n/g , "\r").replace(/\r/g , "<br>")
    },
    strToHtmlString(str){
      return str.replace(/\r\n/g , "\r").replace(/\n/g , "\r").replace(/\r/g , "<br>")
    },
    testInboundReqClicked(){
      this.clearModal()
      var testContent = this.testReport.test.inbound.request
      this.testDiffContent = this.base64byteToHtmlString(testContent)

      if(this.testReport.result.inboundResult.requestError){
        var resultContent = this.testReport.result.inboundResult.requestError
        this.resultDiffContent = this.strToHtmlString('<span class="diff">'+resultContent+'</span>')
      }
      else{
        var resultContent = this.testReport.result.inboundResult.request
        this.resultDiffContent = this.base64byteToHtmlString(resultContent)
      }

      this.showModal = true
    },
    testInboundRespClicked(){
      this.clearModal()
      var testContent = ''
      var resultContent = ''
      if(!this.testReport.result.inboundResult.respDiff.theSame){
        testContent = this.testReport.result.inboundResult.respDiff.originContent
        resultContent = this.testReport.result.inboundResult.respDiff.matchContent
      }
      else{
        testContent = this.testReport.test.inbound.response
        resultContent = this.testReport.result.inboundResult.response
      }
      this.testDiffContent = this.base64byteToHtmlString(testContent)
      this.resultDiffContent = this.base64byteToHtmlString(resultContent)

      if(this.testReport.result.inboundResult.responseError){
        var resultContent = this.testReport.result.inboundResult.responseError
        this.resultDiffContent = this.strToHtmlString('<span class="diff">'+resultContent+'</span>')
      }

      this.showModal = true
    },
    testOutboundReqClicked(index){
      this.clearModal()
      var testContent = this.testReport.test.outbounds[index].request
      var resultContent = ''
      for(var i=0;i<this.testReport.result.outboundResults.length;i++){
        if(index==this.testReport.result.outboundResults[i].matchedPeerIndex){
          var result = this.testReport.result.outboundResults[i]
          if(!result.reqDiff.theSame){
            testContent = result.reqDiff.originContent
            resultContent = result.reqDiff.matchContent
          }
          else{
            resultContent = result.request
          }
        }
      }
      this.testDiffContent = this.base64byteToHtmlString(testContent)
      if(resultContent!=''){
        this.resultDiffContent = this.base64byteToHtmlString(resultContent)
      }
      else{
        this.resultDiffContent = 'no corresponding content'
      }
      this.showModal = true
    },
    testOutboundRespClicked(index){
      this.clearModal()
      var testContent = this.testReport.test.outbounds[index].response
      var resultContent = ''
      for(var i=0;i<this.testReport.result.outboundResults.length;i++){
        if(index==this.testReport.result.outboundResults[i].matchedPeerIndex){
          var result = this.testReport.result.outboundResults[i]
          if(!result.respDiff.theSame){
            testContent = result.respDiff.originContent
            resultContent = result.respDiff.matchContent
          }
          else{
            resultContent = result.response
          }
        }
      }
      this.testDiffContent = this.base64byteToHtmlString(testContent)
      if(resultContent!=''){
        this.resultDiffContent = this.base64byteToHtmlString(resultContent)
      }
      else{
        this.resultDiffContent='no corresponding content'
      }
      this.showModal = true
    },
    resultInboundReqClicked(){
      this.testInboundReqClicked()
    },
    resultInboundRespClicked(){
      this.testInboundRespClicked()
    },
    resultOutboundReqClicked(index){
      this.clearModal()
      var testContent = ''
      var resultContent = this.testReport.result.outboundResults[index].request
      var matchedPeerIndex = this.testReport.result.outboundResults[index].matchedPeerIndex
      if(matchedPeerIndex>=0){
        if(!this.testReport.result.outboundResults[index].reqDiff.theSame){
          testContent = this.testReport.result.outboundResults[index].reqDiff.originContent
          resultContent = this.testReport.result.outboundResults[index].reqDiff.matchContent
        }
        else{
          testContent = this.testReport.test.outbounds[matchedPeerIndex].request
        }
      }

      if(testContent!=''){
        this.testDiffContent = this.base64byteToHtmlString(testContent)
      }
      else{
        this.testDiffContent = 'no corresponding content'
      }
      this.resultDiffContent = this.base64byteToHtmlString(resultContent)
      this.showModal = true
    },
    resultOutboundRespClicked(index){
      this.clearModal()
      var testContent = ''
      if(this.testReport.result.outboundResults[index].responseError){
        var resultContent = this.testReport.result.outboundResults[index].responseError
        this.resultDiffContent = this.strToHtmlString('<span class="diff">'+resultContent+'</span>')
      }
      else{
        var resultContent = this.testReport.result.outboundResults[index].response
        this.resultDiffContent = this.base64byteToHtmlString(resultContent)
      }
      var matchedPeerIndex = this.testReport.result.outboundResults[index].matchedPeerIndex
      if(matchedPeerIndex>=0){
        if(!this.testReport.result.outboundResults[index].respDiff.theSame){
          testContent = this.testReport.result.outboundResults[index].respDiff.originContent
          resultContent = this.testReport.result.outboundResults[index].respDiff.matchContent
          this.resultDiffContent = this.base64byteToHtmlString(resultContent)
        }
        else{
          testContent = this.testReport.test.outbounds[matchedPeerIndex].response
        }
      }
      if(testContent!=''){
        this.testDiffContent = this.base64byteToHtmlString(testContent)
      }
      else{
        this.testDiffContent = 'no corresponding content'
      }
      this.showModal = true
    }
  }
}
</script>

<style scoped>
.hide{
  display:none;
}
.test-list-data{
    width: 106px;
    text-align: center;
    margin-top: 23px;
}
.test-label-li{
  background:#eee;
  cursor:pointer;
  padding-left:2px;
  margin-bottom:1px;
}
.test-label-li:hover{
  background:#2d8cf0;
  color:white;
}
.run-report-detail,#logs{
  border:1px solid #CCC;
  min-height: 600px;
  /*overflow-y:auto;*/
  position: relative;
}
#logs{
  text-align:left;
  padding: 2px 6px 20px 6px;
}
.selected{
  background: #2d8cf0;
  color: white;
}
.test-btn{
  float:left;
  margin-right:0px;
  padding:2px 10px;
  cursor:pointer;
  background:#ccc;
}
.test-btn:hover{
  background:#56a3f3;
  color:white;
}

.btnSelected{
  background:#2d8cf0;
  color:white;
}



.run-report-detail{
  padding-top:16px;
}
.online-test{
  float:left;
  margin-left:16px;
}
.test-result{
  float:right;
  margin-right:16px;
}
.test-detail{
  float: right;
  width: 568px;
  height: 862px;
  overflow: auto;
  border: 1px solid #CCC;
  padding: 0px 20px 20px 20px;
}
.data-item{
  border:1px solid #bbb;
  border-radius:6px;
  float:left;
  margin:4px 1px;
  word-break: break-all;
  width:200px;
  height:44px;
  padding:2px 6px;
  text-align: left;
  cursor:pointer;
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
.test-data{
  width: 446px;
}
.online-test, .test-result{
  width:444px;
}
.hasDiff .data-item{
  border-color:red;
}
.noMatch{
  border-color: red;
}

.passthrough{
  border-color: #2d8cf0;
}

.svg-container svg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    left: 0;
    top: 0;
}
</style>

<style>
  .test-page{
    margin-top: 20px;
  }
  .test-page li{
    min-width:14px;
  }
  .test-page .ivu-page-simple-pager input{
    margin:0px 4px;
    width: 24px;
  }
  .test-page .ivu-page-simple-pager{
    margin-right:2px;
  }
  .diff{
    color:red;
  }
  #logs span{
    word-break:break-all;
  }
  .log-info{
  }
  .log-warn{
    color:#70EF51;
  }
  .log-error{
    color:red;
  }
</style>
