$(function(){
	var storeId = carcityutil.getUserId();
	var customerId = carcityutil.getValueFromURL("id");
	function  getData(){
		var userName = $("#userName").val();
		var phone = $("#phone").val();
		var mark = $("#mark").val();
		var sexValue = 0;
		var sex = document.getElementsByName("sex");
		for (var i = sex.length - 1; i >= 0; i--) {
			if(sex[i].checked){
				sex = $(sex[i]).val();
				break;
			}
		};
		return {
			Id: customerId,
			AccountId:storeId,
			Name:userName,
			Memo:mark,
			MobilePhone:phone,
		}
	}

	interfaceApi.getCustomerByStoreId(customerId, function(data){
     	carcityutil.getTemplate($("#edit_customer"),$("#template"), data);
	});
	
	$("body").on("click", "#edit", function(){
		interfaceApi.editCustomerByStoreId(getData(), function(data){
     		if(data.isSuccess){
     				carcityutil.showMessageDialog("修改用户成功");
     		}
     		else{
     				carcityutil.showMessageDialog(data.errorMessage);
     		}
		});
	});
	$("body").on("tap", "#delete-customer", function(){
		interfaceApi.deleteCustomerByStoreId(customerId, function(data){
     		if(data.isSuccess){
     			carcityutil.showMessageDialog("删除用户成功", function(){
     				location.href = "mycustomer.html";
     			});
     		}
     		else{
     			carcityutil.showMessageDialog(data.errorMessage);
     		}
		});
	});
});