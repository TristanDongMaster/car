
$(function(){
	var storeId = carcityutil.getUserId();
	var pageIndex = 1;
	
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);

	interfaceApi.getWithdrawRecorde({accountId:storeId, PageIndex:1}, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#merchant"),storeTemplate, data);
	});
	interfaceApi.getWithdrawed({tokenKey:storeId}, function(data){
		var amount = "0.00";
		if(data.entity!="0"){
			if(data.entity<10000){
	            amount = carcityutil.convertCurreny(data.entity) + "元";
	        }
	        else{
	            amount = data.entity/10000;
	            amount = carcityutil.convertCurreny(amount) + "万";
	        }
			$(".withdrawed").text(amount);
		}
	});

	$(".refresh-loading .icon_bg").on("tap", function(){
		pageIndex = pageIndex + 1;
		interfaceApi.getWithdrawRecorde({accountId:storeId, PageIndex:pageIndex}, function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
	});



	
});
	    	