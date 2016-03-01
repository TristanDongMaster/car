
$(function(){
	var storeId =  location.hash.substring(1, location.hash.length) ;
	//|| "b0658b0d-da0b-4132-ba16-1ec251306785";
	var storeTemplate = $('#store-body-template').html();
	Mustache.parse(storeTemplate);

	interfaceApi.getStoreInfoById(storeId, function(data){
		    carcityutil.convertData(data);
	    	carcityutil.getTemplate($("#store-header"),$('#store-header-template'), data);
	    	$(".headerContainer_center span").html(data.entity.name);
	});
	
	interfaceApi.getStoreCarById(storeId, 1, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#store-body"),storeTemplate, data);
	});

	$("body").on("tap", ".refresh-loading", function(){

	});

	carcityutil.setStoreIdInHash("");
	
});