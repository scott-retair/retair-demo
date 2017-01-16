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

var CK_VIEW_019= "view-019";
var CK_GIFT_CLICK= 'gift-click';
var CK_MEMBER_VIEW_COUNT= "member-view-count";
var CK_COUPON_CLICK= 'coupon-click';
var CK_REGISTER="isRegister";

var memberChange = function( mid ){
	if( mid == "Ralph" ){
		setCookie( "mabelle_account", 'Ralph', 3600 );
		setCookie( "mabelle-member", 'Ralph', 3600 );
		setCookie( "__retuid", 'Ralph-23485edc-6e0c-4bb1-9696-d82f1df51db3', 3600 );
		setCookie( CK_VIEW_019, '', 3600 );
		setCookie( CK_GIFT_CLICK, '', 3600 );
		setCookie( CK_MEMBER_VIEW_COUNT, '', 3600 );
		setCookie( CK_COUPON_CLICK, '', 3600 );
		setCookie( CK_REGISTER, '', 3600 );
	}
	else if( mid == "Joseph" ){
		setCookie( "mabelle_account", 'Joseph', 3600 );
		setCookie( "mabelle-member", 'Joseph', 3600 );
		setCookie( "__retuid", 'Joseph-23485edc-6e0c-4bb1-9696-d82f1df51db3', 3600 );
		setCookie( CK_VIEW_019, '', 3600 );
		setCookie( CK_GIFT_CLICK, '', 3600 );
		setCookie( CK_MEMBER_VIEW_COUNT, '', 3600 );
		setCookie( CK_COUPON_CLICK, '', 3600 );
		setCookie( CK_REGISTER, '', 3600 );
	}
	else if( mid == "Eason" ){
		setCookie( "mabelle_account", 'Eason', 3600 );
		setCookie( "mabelle-member", 'Eason', 3600 );
		setCookie( "__retuid", 'Eason-23485edc-6e0c-4bb1-9696-d82f1df51db3', 3600 );
		setCookie( CK_VIEW_019, '', 3600 );
		setCookie( CK_GIFT_CLICK, '', 3600 );
		setCookie( CK_MEMBER_VIEW_COUNT, '', 3600 );
		setCookie( CK_COUPON_CLICK, '', 3600 );
		setCookie( CK_REGISTER, '', 3600 );
	}
	else{
		setCookie( "mabelle_account", '', 3600 );
		setCookie( "mabelle-member", '', 3600 );
		setCookie( "__retuid", 'Anonymous-23485edc-6e0c-4bb1-9696-d82f1df51db3', 3600 );
		setCookie( CK_VIEW_019, '', 3600 );
		setCookie( CK_GIFT_CLICK, '', 3600 );
		setCookie( CK_MEMBER_VIEW_COUNT, '', 3600 );
		setCookie( CK_COUPON_CLICK, '', 3600 );
		setCookie( CK_REGISTER, '', 3600 );
	}
	
}