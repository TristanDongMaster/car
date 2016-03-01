$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);
	window.storeTemplate = storeTemplate;
	var brands = {};
	var queryData = {
		accountId:storeId,
		key:"",
		PageIndex:1};
	var pageIndex =1;

	var search = function(){
		if(queryData.key == "" ){
			return;
		}
		interfaceApi.search(queryData, function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			$("body").find("#merchant a").each(function(index, value){	
				if($(this).attr("href").indexOf("#")<=0){
					$(this).attr("href", $(this).attr("href")+ "#" + storeId);
				}	
	    	});
		});
	}

	interfaceApi.getStoreInfoById(storeId, function(data){
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone;
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
	});

	
	$(".refresh-loading .icon_bg").on("click", function(){
		pageIndex = pageIndex + 1;
		queryData.PageIndex = pageIndex;
		search();
	});

	$("body").on("click", "#search-btn", function(){
		queryData.key = $("#search").val();
		queryData.PageIndex = 1;
		$("#merchant").empty();
		search();
	});

	$("body").on("click", ".filter-value", function(){
		$(".filter-value").removeClass("filter-selected");
		$(this).addClass("filter-selected");
		$("#search").val( $(this).text());
		queryData.key = $(this).text();
		queryData.PageIndex = 1;
		$("#merchant").empty();
		search();
	});

});