$(function(){
	var id = carcityutil.getValueFromURL("id");
	interfaceApi.getSellDetailById(id, function(data){
		carcityutil.convertData(data);
	    $("#merchant-detail").html(data.entity.description);
	});
});