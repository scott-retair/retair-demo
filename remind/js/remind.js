
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
	} 
	else{
		var expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
};

var MABELLE_ROLE = '';
var CK_REGISTER="isRegister";
loadMemberInfo = function ( mid ){
			var urlMember = "http://www.retchat.com/agent/wechat/getRetclubMemberInfo?siteId=4" + "&accountName=";
			
			var isRegister = getCookie( CK_REGISTER );
			
			if( isRegister!="1" && (typeof(mid) == "undefined" || mid.length == 0) ){
				$('#member-slogan').text( "加入會員！" );
				$("#member-img")[0].src = "../roleChange/BecomeMember.gif";
				$('#member-btn')[0].href = '../register/_%20MaBelle.com.html';
				return;
			}
			
			$.ajax({
				url: urlMember + mid,
				async: false,
				success: function (resp) {
					var tmp = $( "." + mid + " .price" )[0];
					
					if( resp.data == null ){
						MABELLE_ROLE = "Non-members";
						return;
					}
					
					if( resp.data.headimgurl != null){
						if( $("#member-img")[0] != undefined )
							$("#member-img")[0].src = resp.data.headimgurl;
					}
					
					if( resp.data.customerValues == null )
						return;
						
					$.each( resp.data.customerValues, function( i, obj ) {
						if( obj.customAttributeId == 54 ){
							hasRoleAttribute = true;
							
							if( obj.valueOptionId == 34 ){	// "VIP-Loyal"
								MABELLE_ROLE = "VIP-Loyal";
							}
							else if( obj.valueOptionId == 33 ){	// "VIP-Risk"
								MABELLE_ROLE = "VIP-Risk";
							}
							else if( obj.valueOptionId == 32 ){	// "Member"
								MABELLE_ROLE = "Member";
							}
						}
					});
					
				}
			});
};


var getMember = function(){
	var member = getCookie( "mabelle-member" );
	return member;
}

var CK_VIEW_019= "view-019";
var loyalShow = function(){
	
//	$('#loyal-remind').show();
	
	
	var counter = getCookie( CK_VIEW_019 );
	if( counter == "" ){
		// do nothing
	}
	else{
		var count = parseInt(counter, 10);
		if( count >= 2)
			$('#loyal-remind').show();
	}
	
};

var loyalShowItem = function(){
	$('#loyal-remind-item').show();
	
};

var CK_GIFT_CLICK= 'gift-click';
var giftShow = function(){
	var tmp = getCookie(CK_GIFT_CLICK);
	if( tmp=='1' )
		return;
	

	$('#risk-gift').show();
	
	$('#risk-gift').click( function(){
		alert('結帳時免費禮品將跟商品一起運送喔！');
		
		setCookie(CK_GIFT_CLICK, '1', 365);
		$('#risk-gift').hide();
	});
};

var CK_MEMBER_VIEW_COUNT= "member-view-count";
var CK_COUPON_CLICK= 'coupon-click';
var couponShow = function(){
	
	var tmp = getCookie(CK_COUPON_CLICK);
	if( tmp=='1' )
		return;
		
	var counter = getCookie( CK_MEMBER_VIEW_COUNT );
	if( counter == "" ){
		// do nothing
	}
	else{
		var count = parseInt(counter, 10);
		if( count >= 2){
			$('#coupon').show();
		}
		
		$('#coupon').click(function(){
			alert('已領取優惠卷，結帳時總價錢會直接折扣！');
			
			setCookie(CK_COUPON_CLICK, '1', 365);
			$('#coupon').hide();
		});
	}
};


var CK_ANNOY_COUPON_CLICK= 'annoy-coupon-click';
var annoyCouponShow = function(){
	
		var tmp = getCookie(CK_ANNOY_COUPON_CLICK);
		if( tmp=='1' )
			return;

		$('#annoy-coupon').click(function(){
			alert('已領取優惠卷，結帳時總價錢會直接折扣！');
			
			setCookie(CK_ANNOY_COUPON_CLICK, '1', 365);
			$('#annoy-coupon').hide();
		});
};




var decideShow = function(){
	var member = getMember();
	var mid = getCookie( "mabelle-member" );
	loadMemberInfo( mid );
	
	if( MABELLE_ROLE == "VIP-Loyal" ){
		loyalShow();
		loyalShowItem();
	}
	else if( MABELLE_ROLE == "VIP-Risk" ){
		giftShow();
	}
	else if( MABELLE_ROLE == "Member" ){
		couponShow();
	}
	else{

	}
}

var showGiftInCart = function(){
	var member = getMember();
	var mid = getCookie( "mabelle-member" );
	loadMemberInfo( mid );
	
	if( MABELLE_ROLE == "VIP-Loyal" ){
		//var tmp = getCookie(CK_GIFT_CLICK);
		//if( tmp=='1' )
		$('#loyal-share').show();
	}
	else if( MABELLE_ROLE == "VIP-Risk" ){
		var tmp = getCookie(CK_GIFT_CLICK);
		if( tmp=='1' )
			$('#risk-gift').show();
	}
	else if( MABELLE_ROLE == "Member" ){
		var tmp = getCookie(CK_COUPON_CLICK);
		if( tmp=='1' )
			$('#coupon').show();
	}


};
