

$(function(){
	var  select = function(arr,colorI,colorO,region){
		var result = {entity:{vehiclePrices:{}}};
		var arr1 = arr.entity.vehiclePrices;
		result.entity.vehiclePrices = arr1.filter(function(item){
			return (item.outColorId==colorO||!colorO)
					&&(item.innerColorId==colorI||!colorI)
					&&(item.regionId==region||!region);
		}); 
		return result;   
	}
	var dataOrder = {};

	var storeId = carcityutil.getUserId();
	var id = carcityutil.getValueFromURL("id");
	var customer ="{{#entity}}<option data-id='{{id}}'>{{name}}</option>{{/entity}} ";
    Mustache.parse(customer); 
    var pickpointTemplate = "{{#entity}}<option data-id='{{id}}'>{{address}}</option>{{/entity}}";

	var outColorTemplate =  "{{#outColor}}<span class='questionLine fontSize16'><span class='left'>"+
	             	" <span class='inner-out-color' style='background:{{rgbValue}};' color-id={{id}}>"+
					"</span>"+
					"</span>"+
					"<span class='right'>"+
					"{{name}}"+
					"</span></span>{{/outColor}}";
	var innerColorTemplate ="{{#innerColor}}<span class='questionLine fontSize16'>"+
					"<span class='left'>"+
	             	"<span color-id={{id}} class='inner-out-color' style='background:{{rgbValue}};'>"+
					"</span>"+
					"</span>"+
					"<span class='right'>"+
					"{{name}}"+
					"</span></span>{{/innerColor}}";
	var innerColorId = "",
		outColorId = "";
	Mustache.parse(innerColorTemplate); 
	Mustache.parse(outColorTemplate); 
	interfaceApi.getGoodsInfoById(id, function(data){
		carcityutil.convertData(data);
		dataOrder = data;
	    carcityutil.getTemplate($("#merchant"),$('#template'), data);
	    setRegionSelect();
	    interfaceApi.getAllCustomerInfoByStoreId(storeId, function(data){
	     	carcityutil.getTemplated($("#customer"),customer, data);
		});

		interfaceApi.getPickpointByRegionId(function(data){				
			carcityutil.getTemplated($("#pick-point"),pickpointTemplate, data);			
		});
	});
    $("body").on("click", " #inner-select", function(){
		if($(".select-out .show-color")){
			 outColorId= $(".select-out .show-color").attr("color-id");
		}
		innerColorId= "";
		var dataColor = select(dataOrder,innerColorId,outColorId,"");
		var innerColors = carcityutil.unique(carcityutil.getColor(dataColor, "innerColor"), "innerColor");
		$("#inner-out-clor").empty();
		carcityutil.getTemplated($("#inner-out-clor"), innerColorTemplate, innerColors);
		$("#carColors").addClass("inner-flag");
	});
	$("body").on("click", " #out-select", function(){
		outColorId= "";
		if($(".select-inner .show-color")){
			 innerColorId= $(".select-inner .show-color").attr("color-id");
		}
		var dataColor = select(dataOrder,innerColorId,outColorId,"");
		var outColors = carcityutil.unique(carcityutil.getColor(dataColor, "outColor"), "outColor");
		$("#inner-out-clor").empty();
		carcityutil.getTemplated($("#inner-out-clor"), outColorTemplate, outColors);
		$("#carColors").removeClass("inner-flag");
	});

	$("body").on("click", " #carColors .questionLine ", function(){
		var $color = $(this).find(".inner-out-color");
		var style = $color.attr("style");
		var id = $color.attr("color-id");
		if($("#carColors").hasClass("inner-flag")){
			$(".select-inner").html("<span class='show-color' style='"+style+"' color-id='"+ id +"'></span>");
		}else{
			$(".select-out").html("<span class='show-color'  style='"+style+"'  color-id='"+ id +"'></span>");
		}
		$(this).closest("#carColors").hide();
		setRegionSelect();
	});
	function setRegionSelect(){
		var dataRegion = select(dataOrder,innerColorId,outColorId,"");
		var regions = getRegionName(dataRegion);
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

	$("body").on("tap", ".save-btn", function(){
		var obj = getData();
		interfaceApi.saveOrder( obj, function(data){
			if(data.isSuccess){
     			carcityutil.showMessageDialog("保存订单成功", function(){
     				location.href = "./myorder.html";
     			});
     		}
     		else{
     			carcityutil.showMessageDialog(data.errorMessage);
     		}
		});
	});

	$("body").on("click", ".saveTo-btn", function(){
		var obj = getData();
		interfaceApi.saveOrder( obj, function(data){
			if(data.isSuccess){
				carcityutil.showMessageDialog("保存订单成功", function(){
					var id = data.entity.orderId;
					location.href = "./order_status.html?id=" + id;
				});
     		}
     		else{
     			carcityutil.showMessageDialog(data.errorMessage);
     		}
			
		});
	});


	//get data before save order
	function getData(){
		var orderData = {};
		var customer =  document.getElementById("customer");
		var customerId = $(customer.options[customer.selectedIndex]).attr("data-id");
		var pick =  document.getElementById("pick-point");
		var pickId = $(pick.options[pick.selectedIndex]).attr("data-id");
		var colorInner = $(".select-inner").find(".show-color").attr("color-id");
		var colorOut = $(".select-out").find(".show-color").attr("color-id");
		var VehiclePrice = select(dataOrder, colorInner,colorOut, "");
		orderData.AccountId = carcityutil.getUserId();
		orderData.VehiclePriceId = VehiclePrice.entity.vehiclePrices[0].id;
		orderData.CustomerId = customerId
		orderData.PickupPointId = pickId;
		return orderData;
	}	

});