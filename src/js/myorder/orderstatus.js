

$(function(){
	var id = carcityutil.getValueFromURL("id");
	interfaceApi.getOrderById(id, function(data){
		carcityutil.convertData(data);
		var statusName = data.statusName;
		if( data.statusName == ""){}
	    carcityutil.getTemplate($("#merchant"),$('#template'), data);
		var relativeId = $(".content-arrow a").attr("data-relative");
		interfaceApi.getSellByVehiclePriceID(relativeId, function(data){
			$(".content-arrow a").attr("href", $(".content-arrow a").attr("href") + "?id=" + data.entity.vehicleId);
		});
	});
	$("body").on("click", ".Unpay", function(){
		location.href= $(this).attr("data-href");
	});
});