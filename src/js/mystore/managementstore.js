$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);
	var brandTemplate = "<span class='filter-value' data-id=''>全部</span>{{#entity}}<span class='filter-value' key-value={{id}}>{{name}}</span>{{/entity}}";
	Mustache.parse(brandTemplate);
	window.storeTemplate = storeTemplate;
	var brands = {};
	var queryData = {
		StoreId:storeId,
		BrandId:"",
		FilterVCS:"-1",
		MinPrice:0,
		MaxPrice:10000000,
		PageIndex:1,
		SortType:0};

	
	interfaceApi.getCarsById(queryData, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		$("body").find("#merchant a").each(function(index, value){		
			$(this).attr("href", $(this).attr("href")+ "#" + storeId);
    	});
	});

	interfaceApi.getStoreInfoById(storeId, function(data){
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone;
	    $(".headerContainer_center span").html(data.entity.name);
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
	});

	$("body").on("click", "#alphabet li", function(){
		var word = $(this).attr("data-index");
		$("#filter-brand").empty();
	    carcityutil.getTemplated($("#filter-brand"),brandTemplate, brands.entity.filterByWord(word));
	});
	interfaceApi.getBrands(10000, function(data){
		carcityutil.convertData(data);
		brands = data;
		$("#filter-brand").empty();
	    carcityutil.getTemplated($("#filter-brand"),brandTemplate, brands.entity.filterByWord("A"));
	});
	
	interfaceApi.getLevels(function(data){
	    carcityutil.getTemplate($("#filter-level"),$("#level-template"), data);
	});

	$("body").on("click",".filter-value-container .filter-value",  function(){
		queryData.PageIndex = 1;
		$(this).closest(".dialog-block").hide();
		var $filter = $(this).closest(".filter-value-container");
		if($filter.hasClass("filter-price")){
			var max = $(this).attr("max-price");
			var min = $(this).attr("min-price");
			queryData.MaxPrice = max;
			queryData.MinPrice = min;
			interfaceApi.getCarsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
		if($filter.hasClass("filter-brand")){
			var id = $(this).attr("key-value");
			queryData.BrandId = id;
			interfaceApi.getCarsById(queryData, function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}

		if($filter.hasClass("filter-level")){
			var id = $(this).attr("key-value");
			queryData.FilterVCS = id;
			interfaceApi.getCarsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
	});

	var pageIndex =1;
	$(".refresh-loading .icon_bg").on("click", function(){
		pageIndex = pageIndex + 1;
		queryData.PageIndex = pageIndex;
		interfaceApi.getCarsById(queryData,function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
	});

});