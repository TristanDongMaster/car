$(function(){
	var storeId = carcityutil.getUserId();
	/*var $verificationDialog = $("#verificationDialog"),
         $varificationSpan = $("#varificationSpan");*/
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
			AccountId:storeId,
			Name:userName,
			Gender:sexValue,
			Memo:mark,
			MobilePhone:phone
		}
	}
	$("body").on("click", "#add-customer", function(){
		var userData = getData();
		if(userData.Name=="" ||userData.MobilePhone==""){
			carcityutil.showMessageDialog("请输入正确数据");
			return;
		}
		interfaceApi.addCustomerByStoreId(userData, function(data){
     			console.log(data);
     			if(data.isSuccess){
     				carcityutil.showMessageDialog("添加用户成功");
     			}
     			else{
     				carcityutil.showMessageDialog(data.errorMessage);
     			}
			});
	});
});