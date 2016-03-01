$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	var id = carcityutil.getValueFromURL("id");
	interfaceApi.getSellDetailById(id, function(data){
		carcityutil.convertData(data);
	    $("#merchant-detail").html(data.entity.description);
	});
	interfaceApi.getStoreInfoById(storeId, function(data){
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone;
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
	});

	var id = carcityutil.getValueFromURL("id");
    $("#merchantShow").attr("href",  $("#merchantShow").attr("href") + "?id=" +id + "#" + storeId);

});