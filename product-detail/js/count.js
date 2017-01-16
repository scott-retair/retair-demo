
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

var CK_VIEW_019= "view-019";

count = function( itemCode ){
	if( itemCode == "019" ){
		var counter = getCookie( CK_VIEW_019 );
		if( counter == "" ){
			setCookie( CK_VIEW_019, "1", 365 );
		}
		else{
			var now = parseInt(counter, 10);
			setCookie( CK_VIEW_019, now+1, 365 );
		}
			
	}
};

//////////////////////////////////////////////////////
var MABELLE_ROLE = '';
loadMemberInfo = function ( mid ){
			var urlMember = "http://www.retchat.com/agent/wechat/getRetclubMemberInfo?siteId=4" + "&accountName=";
			
			if( typeof(mid) == "undefined" || mid.length == 0 )
				return;
			
			$.ajax({
				url: urlMember + mid,
				async: false,
				success: function (resp) {
					var tmp = $( "." + mid + " .price" )[0];
					
					if( resp.data == null ){
						MABELLE_ROLE = "Non-members";
						return;
					}
					
					if( resp.data.headimgurl != null)
						$("#member-img")[0].src = resp.data.headimgurl;
					
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

var CK_MEMBER_VIEW_COUNT= "member-view-count";

memberViewCount = function(){
	loadMemberInfo();
	
	if( MABELLE_ROLE = "Member" ){
		var counter = getCookie( CK_MEMBER_VIEW_COUNT );
		if( counter == "" ){
			setCookie( CK_MEMBER_VIEW_COUNT, "1", 365 );
		}
		else{
			var now = parseInt(counter, 10);
			setCookie( CK_MEMBER_VIEW_COUNT, now+1, 365 );
		}
	}
};