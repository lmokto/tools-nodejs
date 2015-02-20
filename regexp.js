var require;
var path = require('path');
var regexp = {
		
	id:function(){
		"use strict";
		var ret = '';
		for(var chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".split(''),i=0;i<15;i++){
			ret += chars[~~(Math.random() * chars.length)];
		}
		return ret;
	},
	
	resolveRelativeURL:function(p,url){
		"use strict";
		var proto = url.match(/^https?/)[0]; //extract the protocol out
		url = url.replace(/^https?:\/\//,''); //remove the protocol
		return proto+'://'+path.normalize(url+'/'+p) //find out the absolute URL
				.replace(path.sep,'/') //replace blackslash with forward slash in Windows
				.replace(/#(\w)+/,''); //remove URL fragment
	},
	
	isExternal:function(url){
		"use strict";
		return url.match(/^https?/) !== null;
	},

	email: new RegExp(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/), //email
	user: new RegExp(/(^|[^@\w])@(\w{0,15})\b/g), //user
	hashtag: new RegExp(/(^|[^#\w])#(\w{1,35})\b/g), //hashtag
	url: new RegExp("http"), //url
	http : new RegExp("^http"),
	www : new RegExp("^www"),
	mailto : new RegExp("^mailto:"),
	tel: new RegExp(""), //tel-number pic.twitter
	imageRegexp: new RegExp("("+['\\.png','\\.jpg','\\.gif','\\.bmp','\\.psd'].join('|')+")$","i")

};
var module;
module.exports = regexp;