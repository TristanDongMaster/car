

$(function(){
	var storeId = carcityutil.getUserId();
	var queryData = {
		AccountId:carcityutil.getUserId(),
		OrderStatus:"0",
		MinPrice:0,
		MaxPrice:0,
		PageIndex:1,
		PageSize: interfaceApi.getSize(),
		SortType:0};
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);
	interfaceApi.getAllOrderByUserId(queryData, function(data){
		carcityutil.convertData(data);
	    carcityutil.getTemplated($("#merchant"),storeTemplate, data);
	});

	$(".filter-value-container").on("click", ".filter-value", function(){
		var id = $(this).attr("value-id");
		$(this).closest(".dialog-block").hide();
		queryData.OrderStatus = id;
		interfaceApi.getAllOrderByUserId(queryData, function(data){
			$("#merchant").empty();
			carcityutil.convertData(data);
		    carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
		$(".filter-value").removeClass("filter-selected");
	});

	$(".refresh-loading .icon_bg").on("click", function(){
		queryData.PageIndex = queryData.PageIndex + 1;
		interfaceApi.getAllOrderByUserId(queryData,function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
	});

	$("body").on("click", "  .filter-amount",function(){
		queryData.PageIndex = 1;
		if($(this).find(".arrow-down-css ").hasClass("arrow-up-css")){
			queryData.SortType = 3;
			interfaceApi.getAllOrderByUserId(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty();
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
		else{
			queryData.SortType = 4;
			interfaceApi.getAllOrderByUserId(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
	});

	$("body").on("click", "  .filter-time",function(){
		queryData.PageIndex = 1;
		if($(this).find(".arrow-down-css ").hasClass("arrow-up-css")){
			queryData.SortType = 1;
			interfaceApi.getAllOrderByUserId(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty();
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
		else{
			queryData.SortType = 2;
			interfaceApi.getAllOrderByUserId(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
	});

});