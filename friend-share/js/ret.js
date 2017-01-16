//**************************************************************************************************

//
// Notes:
// The following JS code will be attached to client's ui.
// NEVER use alerts, or anything that may affect existing website's behaviour.
//
//**************************************************************************************************

//***************************
// Define cookie name the will be used
//***************************
var RETUID_COOKIE = "__retuid";
var RETFSESS_COOKIE = "__retfs";
var WECHAT_OPENID_COOKIE = "__wopenid";
var FB_OPENID_COOKIE = "__fbopenid";
var MEMBER_SYNC_COOKIE = "__syncMember";

var PARAM_RET_CLICK_LABEL = "clkLabel";
var PARAM_RET_TYPE = "retType";
var PARAM_RET_CERT = "retCrt";
var PARAM_REC_ITEM_ID = "recItemId";	// ONLY used in RET.clk.addRecClkListener.setRecBinder()
var PARAM_REC_DOM_ID = "recDomId";	// ONLY used in retType=retImpr
var PARAM_REC_RULE_ID = "recommendId";
//var PARAM_REC_ITEM_IMPR = "itemImpr";
var PARAM_ITEM_ID = "vItemId";
var PARAM_WECHAT_ID = "wechatId";
var PARAM_SESSION_ID = "sessionId";
var PARAM_OUTSIDE_SRC = "fromOutLink";
var PARAM_SHOPPING_DETAIL = "shopDetail";
var PARAM_CART_DETAIL = "cartDetail";

// The following type are used when submit log
var RET_TYPE_TRACK = "track";
var RET_TYPE_RET_IMPRESSION = "retImpr";
var RET_TYPE_RET_CLICK = "retClk";
var RET_TYPE_SITE_CLICK = "siteClk";
var RET_TYPE_BUY = "buy";
var RET_TYPE_CART = "cart";

// MARK
var MARK_CLICK_FROM_SITE = "recMark=1";
var MARK_CLICK_FROM_RET = "recMark=2";

// RETCLUB
var IN_RET_CLUB = false;

var RET={};
RET.loadJS = new function(){
	var me = this;
	var _retUid = '';
	
	return {
		init : function(){
			
		},
		loadScripts : function(scripts, successCallBack){
			
			var loadSingleScript = function(src){
				var xmlHttp, nextScript;
				
				if( window.XMLHttpRequest ){
					xmlHttp = new XMLHttpRequest();
				}else{
					try{
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					}catch(e){
						return;
					}
				}
				
				xmlHttp.onreadystatechange = function(){
					if ( xmlHttp.readyState === 4 && xmlHttp.status === 200){
						eval(xmlHttp.responseText);
						nextScript = scripts.shift();

						if(nextScript){
							loadSingleScript(nextScript);
						}else if( typeof successCallBack === 'function'){
							successCallBack();
						}
					}
				};
				xmlHttp.open("GET", retUrlPrefix+src, true);
				xmlHttp.send();
			};
			
			loadSingleScript( scripts.shift() );
		},
		
		// after loading js, the callback starts from mainProcess
		mainProcess : function(){
			/********************* _retCrxDomain.js start ************************/
			var cookieStorageLife = 365;
			MAIN_PROCESS = this;
			this._retUid = RET.cookieObj.getLocalCookie( RETUID_COOKIE );
			this.m_extra_param = {};
			this.m_extra_param_q = {};
			console.log("ret.js: mainProcess: get local cookie " + this._retUid);
			
			var decideRetType = function(){
				var currentUrl = window.location.href;
				if( currentUrl.indexOf( MARK_CLICK_FROM_SITE ) > 0 )
					return RET_TYPE_SITE_CLICK;
				else if( currentUrl.indexOf( MARK_CLICK_FROM_RET ) > 0 )
					return RET_TYPE_RET_CLICK;
				else if( typeof retOrderList != "undefined")
					return RET_TYPE_BUY;
				else if( typeof retCartList != "undefined")
					return RET_TYPE_CART;
				else
					return RET_TYPE_TRACK;
			};
			
			// load settings from Ret Server
			var siteResponse = {
								'fetchCookieList' : {"_retDynamical":"MEMBER_ID","_retDynamical2":"GOOGLE_ID"},
								"domClickList" : {"_btn_id2":"label2","_btn_id1":"label1"},
								"domRecList" : ["_rec_id2","_rec_id1"],
								"urlFetchMap" : {"URL_PARAM":["zz","yy"],"URL_LAST_PATH":"ON"}
							};
			
			var triggerRet = function( _retUid_ ){
				//*** sync wechat openId if in retclub ***
				if( IN_RET_CLUB ){
					RET.wechat.init( retchatAccount, clubId, appid, _retUid_, mid );
					RET.Fb.init( retchatAccount, clubId, appid, _retUid_, mid );
				}
				
				//*** submit user log, get cookies defined by backend ***
				if( siteResponse.tagTrackStatus == "ON" || IN_RET_CLUB ){
					RET.cookieObj.getExtraCookieByRet( siteResponse.fetchCookieList, MAIN_PROCESS.m_extra_param );
					RET.eventObj.init( retUrlPrefix, window.location.href, _retUid_ );
					MAIN_PROCESS.m_extra_param['siteId'] = retSiteId;
					MAIN_PROCESS.m_extra_param[ PARAM_RET_TYPE ] = decideRetType();
					
					if( decideRetType() == RET_TYPE_BUY ){
						MAIN_PROCESS.m_extra_param[ PARAM_SHOPPING_DETAIL ] = RET.utils.prepareShoppingList( retOrderList );
					}
					else if( decideRetType() == RET_TYPE_CART ){
						MAIN_PROCESS.m_extra_param[ PARAM_CART_DETAIL ] = RET.utils.prepareShoppingList( retCartList );
					}
					else{ 
						// For displaying vItemId in the log, used in RET_TYPE_TRACK, RET_TYPE_RET_CLICK, RET_TYPE_SITE_CLICK
						RET.utils.getUrlParamOrPath( siteResponse.urlFetchMap, window.location.href, MAIN_PROCESS.m_extra_param );
					}
					RET.fSess.update( MAIN_PROCESS.m_extra_param, siteResponse.outlinkFilter );
					RET.eventObj.submit( MAIN_PROCESS.m_extra_param );
				}
				//*** query ***
				RET.utils.getUrlParamOrPath( siteResponse.urlFetchMap, window.location.href, MAIN_PROCESS.m_extra_param_q );
				if( !IN_RET_CLUB && (siteResponse.tagRecommendStatus == "ON" || siteResponse.domRecList.length > 0) ){
					RET.queryObj.init( RET.utils.extractRootUrl(retUrlPrefix), _retUid_ );
					RET.cookieObj.getExtraCookieByRet( siteResponse.fetchCookieList, MAIN_PROCESS.m_extra_param_q );
					MAIN_PROCESS.m_extra_param_q['siteId'] = retSiteId;
					MAIN_PROCESS.m_extra_param_q['domIdListStr'] = RET.utils.getExistDomIdStr( siteResponse.domRecList );	// siteResponse.domRecList.toString();
					MAIN_PROCESS.m_extra_param_q['tagRecId'] = siteResponse.tagRecId;
					RET.queryObj.query( MAIN_PROCESS.m_extra_param_q );
				}
				else if( IN_RET_CLUB && typeof retClubRecommendID != "undefined" ){		// query for retclub
					RET.queryObj.init( RET.utils.extractRootUrl(retUrlPrefix), _retUid_ );
					RET.cookieObj.getExtraCookieByRet( siteResponse.fetchCookieList, MAIN_PROCESS.m_extra_param_q );
					MAIN_PROCESS.m_extra_param_q['siteId'] = retSiteId;
					MAIN_PROCESS.m_extra_param_q['recommendId'] = retClubRecommendID;
					
					RET.queryObj.query( MAIN_PROCESS.m_extra_param_q );
				}
				
				// execute pixel tag which is set from backend
				if( siteResponse.resTagPixelList.length > 0 ){
					RET.tagPixel.init( siteResponse.resTagPixelList, siteResponse.outlinkFilter, _retUid_, MAIN_PROCESS.m_extra_param[ PARAM_SESSION_ID ] );
					RET.tagPixel.exec();
				}
				
				// sync site-member with retUid
				var localCookieMap = {};
				RET.cookieObj.getExtraCookieByRet( siteResponse.fetchCookieList, localCookieMap );
				RET.sync.siteMember( _retUid_, retSiteId, localCookieMap, retUrlPrefix );
			};
			
			// function that going to use later
			var tryCrxCookie = function(){
				var remoteStorage = CrxDomainStorage;
				var bInitRet = remoteStorage.init(retUrlPrefix, "srv.html?"+ (new Date().getDate()) );

				if( bInitRet ){
					console.log( "ret.js: Going to use crxDomain" );
					remoteStorage.requestValue(RETUID_COOKIE, function(key, value)
						{	
							var _retUid_ = value; 
							console.log("ret.js: get _retUid_ from crxDomain: " + _retUid_ );
							
							RET.cookieObj.setLocalCookie(RETUID_COOKIE, _retUid_, cookieStorageLife );
							triggerRet( _retUid_ );
						});
				}else{
					// Browser does not support localStorage, create erUid on local domain
					console.log( "Browser does not support localStorage, create erUid on local domain" );
					var _retUid_ = RET.cookieObj.generateLocalRetUid();
					RET.cookieObj.setLocalCookie( RETUID_COOKIE, _retUid_, cookieStorageLife );
					triggerRet( _retUid_ );
				}
			};
			
			var entry = function(){
				var trackingUrl = RET.utils.extractRootUrl(retUrlPrefix) + 'tracking/action.js';
				if ( this._retUid == null || this._retUid.trim() == ""){
					RET.utils.httpClient( trackingUrl, true, tryCrxCookie);
				}else{
					// document.cookie has __retuid
					var eventSubmit = function(){
						triggerRet( MAIN_PROCESS._retUid );
					}
					RET.utils.httpClient( trackingUrl, true, eventSubmit);
				}
			
				// bind click event
				if( siteResponse.tagClickStatus == "ON" ){
					RET.clk.init( MAIN_PROCESS.m_extra_param, siteResponse.domClickList );
					//RET.clk.addClkListener();
					RET.clk.addSiteClickMark();
				}
				
				// execute external tag which is set from backend
				if( siteResponse.tagExternalList.length > 0 ){
					RET.tagExternal.init( siteResponse.tagExternalList );
					RET.tagExternal.exec();
				}
			};
			
			var tagInfoUrl = RET.utils.extractRootUrl(retUrlPrefix) + 'agent/tagManager/getTagInfo/' + retSiteId;
			tagInfoUrl = RET.utils.extractRootUrl(retUrlPrefix) + 'agent/tagManager/getTagInfo/' + retSiteId;
			RET.utils.httpClient( tagInfoUrl, true,
				function(responseText){ 
					console.log(responseText); 
					siteResponse = JSON.parse(responseText).data;
					entry();
				}
			);
			
		}
		
	};
};


/**************************************************************************************************/
//
//	Take ret.js as a "entry point" of tracking process.
//
//	Executing anything should NEVER pop-up any error on UI. should do something else here.
/**************************************************************************************************/
(function(){
	
	//*** The way to assure in retclub page: If defined well in club page index.html, variables account, clubId, appid are defined in club page ***
	if( typeof retchatAccount != "undefined" && typeof clubId != "undefined" && typeof appid != "undefined" )
		IN_RET_CLUB = true;
	
	RET.loadJS.init();
	var scriptList = ['json2.js', '_retObj.js', '_retUtils.js' + '?' + (new Date().getTime()) , '_retCrxDomain.js', '_retClk.js', '_retTagExt.js', '_retWechat.js', '_retTagPix.js' + '?' + (new Date().getTime()), '_retSync.js', '_retFb.js' ];
	RET.loadJS.loadScripts( scriptList, RET.loadJS.mainProcess);
		
})();
