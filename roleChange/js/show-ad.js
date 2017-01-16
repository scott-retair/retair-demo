
CrxDomainStorages = new function(){

	var me = this;
	var m_origin = '';
	var m_path = '';
	var m_iframe = null;;
	var m_iframeReady = false;
	var m_queue = [];
	var m_requests = {};
	var m_id = 0;

	var m_iframeLoaded = function(){
		m_iframeReady = true;

		if (m_queue.length){
			for (var i=0, len=m_queue.length; i < len; i++){
				m_sendRequest(m_queue[i]);
			}
			m_queue = [];
		}
	};

	var m_handleMessage = function(event){
		// Extract domain and Remove '/' in URL if exists
		var _origin_domain = event.origin.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0].replace(/(\/*$)/g, "");
		var _m_origin_domain = m_origin.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0].replace(/(\/*$)/g, "");

		if (_origin_domain == _m_origin_domain){
			var data = JSON.parse(event.data);
			// Execute call-back function with parsed data
			m_requests[data.id].callback( data.key, data.value );
			delete m_requests[data.id];
		}
	};

	var m_sendRequest = function(data){
		m_requests[data.request.id] = data;
		m_iframe.contentWindow.postMessage(JSON.stringify(data.request), m_origin);
	};

	
	this.init = function( origin, path ){
		m_origin = origin;
		m_path = path;

		if ( !m_iframe ){
			if ( window.postMessage && window.localStorage && typeof JSON != "undefined" && typeof JSON.parse == "function" && typeof JSON.stringify == "function"){

				m_iframe = document.createElement("iframe");
				m_iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
				m_iframe.src = m_origin + m_path;
				//document.body.appendChild(this._iframe);
				var currentJs = document.getElementById('ret-js-template');
				currentJs.parentNode.insertBefore(m_iframe, currentJs);

				if (window.addEventListener){
					m_iframe.addEventListener("load", function() {	m_iframeLoaded();	}, false );
					window.addEventListener("message", function(event){	m_handleMessage(event);	}, false);
				}else if (m_iframe.attachEvent){
					m_iframe.attachEvent("onload", function(){	m_iframeLoaded();	}, false);
					window.attachEvent("onmessage", function(event){	m_handleMessage(event);	});
				}
			} else {
				// Browser does not support local-storage & postMessage, create local doamin ErUid
				// throw new Error("Unsupported browser.");
				return false;
			}
		}

		return true;
	},
	this.requestValue = function(key, callback){
		var request = {	key: key,
					id: ++m_id};

		var data = {request: request,
				callback: callback};

		if (m_iframeReady){
			m_sendRequest(data);
		} else {
			m_queue.push(data);
		}
	}
};

var getCookie = function(name){
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0, limit = ca.length; i < limit; i++) {
		var c = ca[i];
		c = c.trim();
		if (c.indexOf(nameEQ) == 0){
			return c.substring(nameEQ.length);
		}
	}
	return '';
};

var setCookie = function(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else{
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
};
		
var extractRootUrl = function (url) {
	var rootUrl
	var domain;
	var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);		
	rootUrl = matches && matches[0];
	domain = matches && matches[1];
	return rootUrl;
};

var urlMember = "http://www.retchat.com/agent/wechat/getRetclubMemberInfo?siteId=2&accountName=";
var mid = "pge_account: waiting for crxDomain";

function loadMemberInfo(){
	if( typeof(mid) == "undefined" || mid.length == 0 )
		return;
			
	jQuery.ajax({
		url: urlMember + (mid),
		async: false,
		success: function (resp) {
			if( resp.data == null )
				return;
			
			memberVO = resp.data;
			userId = resp.data.memberId;
			$("#phone").val( resp.data.phoneNumber );
			$("#name").val( resp.data.name );
			$("#email").val( resp.data.email );
			$("#account").val( resp.data.accountName );
				
			if( resp.data.customerValues == null )
				return;
				
			$.each( resp.data.customerValues, function( i, obj ) {
				if( obj.customAttributeId == 43 && obj.valueOptionId != null ){	// attribute ROLE
					if( obj.valueOptionId == 20 ){
						console.log("ROLE: SOCIAL");
						$('#ad-slogan').text( '呼朋引伴，最新产品试用！' );
						$('#olay-ad')[0].src='./olay1.jpg';
						$('#olay-ad').show();
						$('#ad-slogan').show();
						return false;
					}
					if( obj.valueOptionId == 19 ){
						console.log("ROLE: KOL");
						$('#ad-slogan').text( '感谢长久来的支持与分享使用心得，为您提供专属样品！' );
						$('#olay-ad')[0].src='./olay2.jpg';
						$('#olay-ad').show();
						$('#ad-slogan').show();
						return false;
					}
					if( obj.valueOptionId == 18 ){
						console.log("ROLE: NORMAL");
						$('#ad-slogan').text( '欢迎试用新产品！' );
						$('#olay-ad')[0].src='./olay.jpg';
						$('#olay-ad').show();
						$('#ad-slogan').show();
						return false;
					}
					if( obj.valueOptionId == 30 ){
						console.log("ROLE: workingMom");
						$('#ad-slogan').text( '工作再忙，家事再多，也要维持当初的你' );
						$('#olay-ad')[0].src='./olay3.jpg';
						$('#olay-ad').show();
						$('#ad-slogan').show();
						return false;
					}
					if( obj.valueOptionId == 31 ){
						console.log("ROLE: BuyForGift");
						$('#ad-slogan').text( '一次买两件，八折优惠！' );
						$('#olay-ad')[0].src='./olay4.jpg';
						$('#olay-ad').show();
						$('#ad-slogan').show();
						return false;
					}
				}
			});
		}
	});
}

function displayAdByCookie(){
	var role = getCookie( "icem-role" );
	if( role == "SOCIAL"){
		console.log("ROLE: SOCIAL");
		$('#ad-slogan').text( '呼朋引伴，最新产品试用！' );
		$('#olay-ad')[0].src='./olay1.jpg'
	}
	if( role == "KOL"){
		console.log("ROLE: KOL");
		$('#ad-slogan').text( '感谢长久来的支持与分享使用心得，为您提供专属样品！' );
		$('#olay-ad')[0].src='./olay2.jpg'
	}
	if( role == "NORMAL"){
		console.log("ROLE: NORMAL");
		$('#ad-slogan').text( '欢迎试用新产品！' );
		$('#olay-ad')[0].src='./olay.jpg'
	}
	if( role == "workingMom"){
		console.log("ROLE: workingMom");
		$('#ad-slogan').text( '工作再忙，家事再多，也要维持当初的你' );
		$('#olay-ad')[0].src='./olay3.jpg'
	}
	if( role == "BuyForGift"){
		console.log("ROLE: BuyForGift");
		$('#ad-slogan').text( '一次买两件，八折优惠！' );
		$('#olay-ad')[0].src='./olay4.jpg'
	}
}

//displayAdByCookie();

var PGE_ACCOUNT = "pge_account";
var crxQueryUrl = "http://www.retchat.com/retclub/2/0/24/index.html";
var remoteStorage = CrxDomainStorages;
var bInitRet = remoteStorage.init( crxQueryUrl + "?" + (new Date().getDate()) );

$('#olay-ad').hide();
$('#ad-slogan').hide();

remoteStorage.requestValue(PGE_ACCOUNT, function(key, value){	
	var pge_account = value; 
	console.log("show-ad.js: get pge_account from crxDomain: " + pge_account );
	mid = pge_account;
							
	//RET.cookieObj.setLocalCookie(RETUID_COOKIE, _retUid_, cookieStorageLife );
	loadMemberInfo();
});


var urlMemberAttribute = "http://icemdev.retchat.com/agent/wechat/site/getCustomAttributes?siteId=25";

