
export default {
	toPrettyHtml: function (text) {
		return text.replace(/\r\n/g , "\r").replace(/</g , "&lt;").replace(/>/g , "&gt;").replace(/\n/g,"\r").replace(/\r/g , "<br>").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
	},
}