
$(function(){
	var storeId = carcityutil.getUserId();
	var pageIndex = 1;
	
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);
	
	interfaceApi.getMoneySum({accountId:storeId}, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplate($("#money-sum"),$('#sum-template'), data);
	});

	interfaceApi.getMoneyList({accountId:storeId, PageIndex:1}, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#merchant"),storeTemplate, data);
	});


	$(".refresh-loading .icon_bg").on("tap", function(){
		pageIndex = pageIndex + 1;
		interfaceApi.getMoneyList({accountId:storeId, PageIndex:pageIndex}, function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
	});



	
});
	    	