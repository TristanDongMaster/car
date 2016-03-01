$(function(){
	var storeId = carcityutil.getUserId();
	interfaceApi.getAllCustomerInfoByStoreId(storeId, function(data){
     	carcityutil.getTemplate($("#customer"),$("#template"), data);
	});
});