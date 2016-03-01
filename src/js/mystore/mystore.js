
$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	var pageIndex = 1;
	if(!storeInfo.entity.type){
		$(".headerContainer_right ").remove();
	}
	var storeTemplate = $('#store-body-template').html();
	Mustache.parse(storeTemplate);
	interfaceApi.getStoreInfoById(storeId, function(data){
	    carcityutil.convertData(data);
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone
    	carcityutil.getTemplate($("#store-header"),$('#store-header-template'), data);
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
		var elem = document.getElementById('swipe-img');
		   window.mySwipe = Swipe(elem, {
			auto: 5000,
			callback: function(pos) {
				var i = bullets.length;
				while (i--) {
					bullets[i].className = ' ';
				}
				if(pos>= bullets.length){
					pos = pos - bullets.length;
				}
				bullets[pos].className = 'on';
			}
		});
		var bullets = document.getElementById('swipe-position').getElementsByTagName('li');
		bullets[0].className = 'on';
	});
	interfaceApi.getStoreCarById(storeId, 1, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#store-body"),storeTemplate, data);
		$("body").find(".store-news a, #store-body  a").each(function(index, value){
        	$(this).attr("href", $(this).attr("href")+ "#" + storeId);
    	});
	});

	$(".refresh-loading .icon_bg").on("tap", function(){
		pageIndex = pageIndex + 1;
		interfaceApi.getStoreCarById(storeId, pageIndex, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#store-body"),storeTemplate, data);
		$("body").find(".store-news a, #store-body  a").each(function(index, value){
			if($(this).attr("href").indexOf("id") < 0){
				$(this).attr("href", $(this).attr("href")+ "#" + storeId);
			}
    	});
	});
	});



	
});
	    	