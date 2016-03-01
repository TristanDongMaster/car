
$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	var id = carcityutil.getValueFromURL("id");
	var pickpointTemplate = "{{#entity}}<option data-id='{{id}}'>{{address}}</option>{{/entity}}";
	
	interfaceApi.getSellDetailById(id, function(data){
		carcityutil.convertData(data);
		var innerColor = carcityutil.unique(carcityutil.getColor(data, "innerColor"), "innerColor");
	    var outColor = carcityutil.unique(carcityutil.getColor(data, "outColor"), "outColor");
	    data.entity.colors = {};
	    data.entity.colors.innerColor = innerColor.innerColor;
	    data.entity.colors.outColor = outColor.outColor;
	    carcityutil.getTemplate($("#merchant-info-car"),$('#merchant-info-car-template'), data);

	    interfaceApi.getPickpointByRegionId(function(data){				
			carcityutil.getTemplated($("#pick-point"),pickpointTemplate, data);			
		});
	    $("#merchantDetail").attr("href",  $("#merchantDetail").attr("href")  + "?id=" + data.entity.vehicleId+ "#" + storeId);
	   setRegionSelect(data);
	   // carcityutil.getTemplate($("nav"),$("#nav-template"), carcityutil.getUserIdNo());			
	});

	interfaceApi.getStoreInfoById(storeId, function(data){
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone;
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
	});

	function setRegionSelect(data){
		var regions = getRegionName(data);
		var html = "";
		for (var i = regions.length - 1; i >= 0; i--) {
			html += '<option data-id="'+regions[i].id+'">'+regions[i].name+'</option>'
		};
		$(".region").empty();
		$(".region").append(html);
	}

	function getRegionName(data){
		var arr = [];
		for (var i = data.entity.vehiclePrices.length - 1; i >= 0; i--) {
			var current = data.entity.vehiclePrices[i];
			if(deleteArray(arr, id)){
				arr.push({id:current.id, name:current.regionName})
			}
		};
		return arr;
	}

	function deleteArray(data, id){
		for (var i = data.length - 1; i >= 0; i--) {
			var current = data[i];
			if(current.id == id){
				return false;
			}
		};
		return true;
	}

});