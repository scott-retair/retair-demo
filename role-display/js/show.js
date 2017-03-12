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

var CK_REGISTER="isRegister";
function loadMemberInfo( mid ){
			var urlMember = "http://www.retchat.com/agent/wechat/getRetclubMemberInfo?siteId=4" + "&accountName=";
			var isRegister = getCookie( CK_REGISTER );
			
			if( isRegister!="1" && (typeof(mid) == "undefined" || mid.length == 0) ){
				$('#member-slogan').text( "加入會員！" );
				$("#member-img")[0].src = "../roleChange/BecomeMember.gif";
				
				$('#member-btn')[0].href = '../register/_MaBelle.com.html';
				return;
			}
			
			$.ajax({
				url: urlMember + mid,
				async: false,
				success: function (resp) {
					var tmp = $( "." + mid + " .price" )[0];
					
					if( resp.data == null ){
						$('#member-slogan').text( "加入會員！" );
						$("#member-img")[0].src = "../roleChange/BecomeMember.gif";
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
								$("#member-slogan").text( "鑽石會員情人節推薦" );
							}
							else if( obj.valueOptionId == 33 ){	// "VIP-Risk"
								$("#member-slogan").text( "白金會員情人節推薦" );
							}
							else if( obj.valueOptionId == 32 ){	// "Member"
								$("#member-slogan").text( "會員情人節專屬推薦" );
							}
						}
					});
					
				}
			});
		};
		
var display = function(){
	var mid = getCookie( "mabelle-member" );
	loadMemberInfo( mid );
};
