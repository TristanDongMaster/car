$(function(){
	var storeId = carcityutil.getUserId();
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);
	var brandTemplate = "<span class='filter-value' data-id=''>全部</span>{{#entity}}<span class='filter-value'key-value={{id}}>{{name}}</span>{{/entity}}";
	Mustache.parse(brandTemplate);
	window.storeTemplate = storeTemplate;
	var brands = {};
	var queryData = {
		StoreId:storeId,
		BrandId:"",
		FilterVCS:"-1",
		MinPrice:0,
		MaxPrice:0,
		PageIndex:1,
		SortType:0};

	interfaceApi.getBrands(10000, function(data){
		carcityutil.convertData(data);
		brands = data;
		$("#filter-brand").empty();
	    carcityutil.getTemplated($("#filter-brand"),brandTemplate, brands.entity.filterByWord("A"));
	});
	interfaceApi.getLevels(function(data){
	    carcityutil.getTemplate($("#filter-level"),$("#level-template"), data);
	});
	

	interfaceApi.getGoodsById(queryData,function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#merchant"),storeTemplate, data);
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
			interfaceApi.getGoodsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
		if($filter.hasClass("filter-brand")){
			var id = $(this).attr("key-value");
			queryData.BrandId = id;
			interfaceApi.getGoodsById(queryData, function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}

		if($filter.hasClass("filter-level")){
			var id = $(this).attr("key-value");
			queryData.FilterVCS = id;
			interfaceApi.getGoodsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
	});

	$("body").on("click", "  .filter-money",function(){
		if($(this).find(".arrow-down-css ").hasClass("arrow-up-css")){
			queryData.SortType = 1;
			interfaceApi.getGoodsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty();
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
		else{
			queryData.SortType = 2;
			interfaceApi.getGoodsById(queryData,function(data){
				carcityutil.convertData(data);
				$("#merchant").empty(); 
				carcityutil.getTemplated($("#merchant"),storeTemplate, data);
			});
		}
	});

	$("body").on("click", " .bottom-icon", function(){
		if($(this).find(".checkedIcon").length){
			var goodId = $(this).closest(".merchant-content-bottom").attr("data-id");
			if($(this).find(".checkedIcon").hasClass("uncheckedIcon")){
				interfaceApi.recommended(storeId, goodId, "F", function(data){
				});
			}
			else{
				interfaceApi.recommended(storeId, goodId, "T", function(data){
				});
			}			
		}
		if($(this).find(".uploadIcon").length){
			var goodId = $(this).closest(".merchant-content-bottom").attr("data-id");
			if($(this).find(".uploadIcon").hasClass("updownIcon")){
				interfaceApi.checked(storeId, goodId, "T", function(data){
				});
				$(this).find(".uploadIcon").next(".icon-des").text("下架");
			}
			else{
				interfaceApi.checked(storeId, goodId, "F", function(data){
				});
				$(this).find(".uploadIcon").next(".icon-des").text("上架");
			}
		};
	});


	$("body").on("click", "#alphabet li", function(){
		var word = $(this).attr("data-index");
		$("#filter-brand").empty();
	    carcityutil.getTemplated($("#filter-brand"),brandTemplate, brands.entity.filterByWord(word));
	});

	self.setInterval(function(){
		var brandH = $("#filter-brand").height();
		var bodyH = $("body").height();
		var alphabetH = $("#alphabet").height();
		if(bodyH < brandH){
			$("#alphabet").height(brandH + "px");
		}
		else if(alphabetH < bodyH){
			$("#alphabet").height(bodyH + "px");
		}
		else{
		}
	}, 1000);
	var pageIndex =1;
	$(".refresh-loading .icon_bg").on("click", function(){
		pageIndex = pageIndex + 1;
		queryData.PageIndex = pageIndex;
		interfaceApi.getGoodsById(queryData,function(data){
			carcityutil.convertData(data);
			carcityutil.getTemplated($("#merchant"),storeTemplate, data);
		});
	});

});