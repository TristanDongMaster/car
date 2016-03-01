
$(function(){
	var storeId = carcityutil.getUserId();
	
	interfaceApi.getCardById({accountId:storeId}, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplate($("#merchant"),$('#template'), data);
	});

	interfaceApi.getBalance({accountId:storeId}, function(data){
		carcityutil.convertData(data);
		carcityutil.getTemplate($("#withdraw-money-ctn"),$("#withdraw-money-template"), data);
	});

	$("body").on("click", ".save-btn", function(){
		var bankName = $(".bankName").text();
		var amount = $("#amount").val();
		var password = $("#password").val();
		if(carcityutil.convertCurreny($("#amount").val()) == "0.00"){
			carcityutil.showMessageDialog("金额不正确！");
			return;
		}
		else if(password==""){
			carcityutil.showMessageDialog("密码不能为空");
			return;
		}
		interfaceApi.requestWithdraw(
		{tokenkey:storeId, 
		amount:$("#amount").val(), 
		password:password}, function(data){
			console.log(data);
			location.href = "../../html/mymoney/withdraw-detail.html?bankName=" + bankName + "&amount=" +　amount;
		});
	});
	$("body").on("click", "#ensure-withdraw", function(){
		$("#withdraw-dialog").show();
	});
});
	    	