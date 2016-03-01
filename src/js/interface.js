var interfaceApi = (function(){
	var size = 15;
	return {
	getSize: function(){
		return size;
	},

	getStoreInfoById: function(id, callback){
		carcityutil.ajaxNo({
		 	url: 'store/d/'  + id,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	getUserInfoById: function(id, callback){
		carcityutil.ajaxT({
		 	url: 'u/d/'+ id + '/info',
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	getStoreNoticeById: function(id, index,  callback){
		carcityutil.ajaxT({
		 	url: 'store/an/'+id+'/s/'+ interfaceApi.getSize() +'/p/' + index,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	getStoreNoticeDetailById: function(id,  callback){
		carcityutil.ajaxNo({
		 	url: 'store/nd/'+id,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	addStoreNotice: function(data,  callback){
		carcityutil.ajaxNo({
		 	url: 'store/ann/',
		  	type: 'post',
		  	dataType: "json",
		  	data:data
		}, function(data){
			callback(data);
		});
	},

	// sell store cars
	getStoreCarById: function(id, index, callback){
		carcityutil.ajaxT({
		 	url:'store/asv/' +id+ '/s/'+ interfaceApi.getSize() +'/p/' + index,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			if(data.entity.length<=0){
				//carcityutil.showMessageDialog("没有数据，请变更查询条件");
				//return;
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},

   // all sell goods 
	getSellById: function(id, index, callback){
		carcityutil.ajaxT({
		 	url:'vehicle/fv/' +id+ '/s/'+ interfaceApi.getSize() +'/p/' + index,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},
	
	//根据VehiclePriceID获取汽车详细信息  relative /api/vehicle/vd2/{vehiclePriceId}
	getSellByVehiclePriceID: function(id, callback){
		carcityutil.ajaxT({
		 	url:'vehicle/vd2/' +id,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	//all  goods
	//id, index, SortType, MinPrice, MaxPrice, BrandId, FilterVCS,
	getGoodsById: function(data, callback){
		var MinPrice = 0;
		var MaxPrice = 999999999999;
		if(data.MinPrice == null || data.MinPrice <= 0){
			MinPrice = 0;
		}
		else{
			MinPrice = data.MinPrice*10000;
		}
		if(data.MaxPrice == null ||data.MaxPrice <= 0){
			MaxPrice = 999999999999;
		}else{
			MaxPrice = data.MaxPrice*10000
		}
		carcityutil.ajaxT({
		 	url:'vehicle/fv/',
		  	type: 'post',
		  	dataType: "json",
		  	data:{
			  		StoreId:data.StoreId,
					BrandId:data.BrandId,
					FilterVCS:data.FilterVCS,
					MinPrice:MinPrice,
					MaxPrice:MaxPrice,
					PageSize:interfaceApi.getSize(),
					PageIndex:data.PageIndex,
					SortType:data.SortType
		  	}
		}, function(data){
			if(data.entity.length<=0){
				//carcityutil.showMessageDialog("没有数据，请变更查询条件");
				//return;
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},

	//Api:/api/store/fsv vehicle/vd/

	getSellDetailById: function(id,callback){
		carcityutil.ajaxT({
		 	url: 'vehicle/vd/'+ id ,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	getBrands: function(id,callback){
		carcityutil.ajaxT({
		 	url: 's/bl/'+ id ,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	getLevels: function(callback){
		carcityutil.ajaxT({
		 	url: 's/vcsl',
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	recommended: function(storeId, goodId, $r ,callback){
		carcityutil.ajaxNo({
		 	url: 'store/isr/'+ storeId + '/g/'+ goodId+'/'+ $r ,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

	//shang jia
	checked: function(storeId, goodId, $r ,callback){
		carcityutil.ajaxNo({
		 	url: 'store/iss/'+ storeId + '/g/'+ goodId+'/'+ $r ,
		  	type: 'get',
		  	dataType: "jsonp",
		}, function(data){
			callback(data);
		});
	},

		// all store cars
	getCarsById: function(data,callback){
		var MinPrice = 0;
		var MaxPrice = 999999999999;
		if(data.MinPrice == null || data.MinPrice <= 0){
			MinPrice = 0;
		}
		else{
			MinPrice = data.MinPrice*10000;
		}
		if(data.MaxPrice == null ||data.MaxPrice <= 0){
			MaxPrice = 999999999999;
		}else{
			MaxPrice = data.MaxPrice*10000
		}
		carcityutil.ajaxT({
		 	url: 'store/fsv',
		  	type: 'post',
		  	data: {
				  		StoreId:data.StoreId,
						BrandId:data.BrandId,
						FilterVCS:data.FilterVCS,
						MinPrice:MinPrice,
						MaxPrice:MaxPrice,
						PageSize:interfaceApi.getSize() ,
						PageIndex:data.PageIndex,
						SortType:data.SortType
		  			},
		  			dataType:"json"
		}, function(data){
			if(data.entity.length<=0){
				//carcityutil.showMessageDialog("没有数据，请变更查询条件");
				//return;
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},
	getGoodsInfoById: function(id, callback){
		carcityutil.ajaxT({
			url: 'vehicle/vd/'+id,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},
	
	getAllCustomerInfoByStoreId: function(id, callback){
		carcityutil.ajaxT({
			url: 'store/ac/'+id+'/s/1000/p/1',
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},

	addCustomerByStoreId: function(data, callback){
		carcityutil.ajaxT({
			url: 'store/anc/',
		  	type: 'post',
		  	dataType:"json",
		  	data:data
		}, function(data){
			callback(data);
		});
	},

	editCustomerByStoreId: function(data, callback){
		carcityutil.ajaxT({
			url: 'store/ec/',
		  	type: 'post',
		  	dataType:"json",
		  	data:data
		}, function(data){
			callback(data);
		});
	},

	deleteCustomerByStoreId: function(id, callback){
		carcityutil.ajaxT({
			url: 'store/dc/' + id,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},

	getCustomerByStoreId: function(id, callback){
		carcityutil.ajaxT({
			url: 'store/cd/' + id,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},

	//api/order/fo
	getAllOrderByUserId: function(data, callback){
		var MinPrice = 0;
		var MaxPrice = 999999999999;
		if(data.MinPrice == null || data.MinPrice <= 0){
			MinPrice = 0;
		}
		else{
			MinPrice = data.MinPrice*10000;
		}
		if(data.MaxPrice == null ||data.MaxPrice <= 0){
			MaxPrice = 999999999999;
		}else{
			MaxPrice = data.MaxPrice*10000
		}
		carcityutil.ajaxT({
			url: 'order/fo',
		  	type: 'post',
		  	data:data,
		  	dataType:"json"
		}, function(data){
			if(data.entity.length<=0){
				//carcityutil.showMessageDialog("没有数据，请变更查询条件");
				//return;
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},

	getOrderById: function(id, callback){
		carcityutil.ajaxT({
			url: 'order/od/' + id,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},
	///api/s/rl/{RegionId?}
	// 根据区域id获取提车点
	getPickpointByRegionId: function( callback){
		carcityutil.ajaxT({
			url: 's/apl',
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},

	saveOrder: function(data, callback){
		carcityutil.ajaxT({
			url: '/order/ano',
		  	type: 'post',
		  	dataType:"json",
		  	data:data
		}, function(data){
			callback(data);
		});
	},

	///api/u/commissions/{accountId}/s/{size}/p/{pageIndex}

	getMoneyList: function(data, callback){
		carcityutil.ajaxT({
			url: '/u/commissions/'+ data.accountId + "/s/" + interfaceApi.getSize() + "/p/" + data.PageIndex,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			if(data.isSuccess == "false" || data.isSuccess == false){
				carcityutil.showMessageDialog("用户为登录！");
				return;
			}
			if(data.entity.length<=0){
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},
	///u/commissions/{accountId}/sum
	getMoneySum: function(data, callback){
		carcityutil.ajaxT({
			url: '/u/commissions/'+ data.accountId + "/sum",
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},
	///api/m/wl/{accountId}/s/{pageSize}/p/{pageIndex}
	getWithdrawRecorde:function(data, callback){
		carcityutil.ajaxT({
			url: '/m/wl/'+ data.accountId + "/s/" + interfaceApi.getSize() + "/p/" + data.PageIndex,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			if(data.entity.length<=0){
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	},

	//获取可提现金额
	getBalance:function(data, callback){
		carcityutil.ajaxT({
			url: '/u/balance/' + data.accountId,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	},

	//取现申请
	requestWithdraw: function(data, callback){
		carcityutil.ajaxT({
			url: 'm/aw/',
		  	type: 'post',
		  	dataType:"json",
		  	data:data
		}, function(data){
			if(data.isSuccess =="true" || data.isSuccess ==true) {
				callback(data);
			}
			else{
				carcityutil.showMessageDialog(data.errorMessage);
				return;
			}
			
		});
	},

	//已提现金额
	getWithdrawed:function(data, callback){
		carcityutil.ajaxT({
			url: 'm/wlsum/',
		  	type: 'post',
		  	data:data,
		  	dataType:"json"
		}, function(data){
			callback(data);
		});
	},
	
	getCardById: function(data, callback){
	 	carcityutil.ajaxT({
			url: '/u/bc/'+ data.accountId ,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			callback(data);
		});
	 },

	 //svs/vehicle/avs/{storeId}/k/{key}/s/{size}/p/{pageIndex}
	 search: function(data, callback){
	 	carcityutil.ajaxT({
			url: '/vehicle/svs/'+ data.accountId + "/k/" + data.key + "/s/" + interfaceApi.getSize() + "/p/" + data.PageIndex,
		  	type: 'get',
		  	dataType:"jsonp"
		}, function(data){
			if(data.entity.length<=0){
				$(".refresh-loading").hide();
			}
			else{
				$(".refresh-loading").show();
			}
			callback(data);
		});
	 }


	};
})();