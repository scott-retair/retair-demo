
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

var CK_REGISTER="isRegister";

var reg = function(){
	$("#imgBtn1").click(function () {
		window.location = "../role-display/products.html";
		setCookie( CK_REGISTER, "1", 365 );
	});             
};
