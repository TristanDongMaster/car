$(function(){
    var name = carcityutil.getValueFromURL("name");
    $("#nickName").text(name);
	$("#removeBindBtn").on("click",function(){
		 carcityutil.ajax({
           url:carcityutil.getServerHost()+"u/unWechat",
           type:"post",
           dataType:"json",
           data:{
           	accountId:carcityutil.getUserId(),
            tokenKey:carcityutil.getUserId()
           }
         },function(data){
          var result = data;
          if(result.isSuccess){
          	$("#verificationDialog").show();
            $("#varificationSpan").text("解绑成功");
          	var skip = setTimeout(function(){
                window.location.href = "./index.html";
          	},3000);

           }else{
               $("#verificationDialog").show();
               $("#varificationSpan").text(result.errorMessage);
          }
       });
	});
});