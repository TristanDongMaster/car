$(function(){
	var storeId =  location.hash.substring(1, location.hash.length);
	var storeTemplate = $('#template').html();
	Mustache.parse(storeTemplate);

	interfaceApi.getBrands(10000, function(data){
		carcityutil.convertData(data);
	    carcityutil.getTemplate($("#filter-brand"),$('#brand-template'), data);
	});

	interfaceApi.getStoreCarById(storeId, 1, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplated($("#merchant"),storeTemplate, data);
	});


	carcityutil.setStoreIdInHash("");
	
});