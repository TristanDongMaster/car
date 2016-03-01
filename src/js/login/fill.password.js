$(function(){
    var $phone = $("#phone"), phoneNumber = carcityutil.getValueFromURL("phone");
        $phone.val(phoneNumber);

   $("#finish").on("click",function(){
   	  var password = $("#password").val(),
          passwordAgain = $("#passwordAgain").val(),
          $verificationDialog = $("#verificationDialog"),
          $phone = $("#phone");
          
   	     if(password.replace(/[ ]/g,"") === ""){
            $verificationDialog.show();
            $("#varificationSpan").text("请设置密码！");
            return
          }

          if(!((password.replace(/[ ]/g,"") != "") && (password.replace(/[ ]/g,"") === passwordAgain.replace(/[ ]/g,"")))){
             $verificationDialog.show();
             $("#varificationSpan").text("请输入一致的密码！");
             return;
          }


          carcityutil.ajax({
          	url:carcityutil.getServerHost()+"u/resetPwd",
            type:"post",
          	dataType:"json",
            data:{
                 phone:$phone.val(),
                 password:password
              }
          },function(data){
             var result = data;
             if(result.isSuccess){
                 window.location.href = "../login/login.html";
             }else{
                 $verificationDialog.show();
             }
          });

 });
});

