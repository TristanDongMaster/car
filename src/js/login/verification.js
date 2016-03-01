$(function(){
	//./fillin_password.html

	var $sendPhone = $("#sendPhone"), phone = carcityutil.getValueFromURL("phone");
	$sendPhone.text(phone);

	 $("#nextStep").on("click",function(){
   	  var $verificationValue = $("#verificationValue"),
   	      $verificationDialog = $("#verificationDialog"),
          $sendPhone = $("#sendPhone");

   	      if($verificationValue.val().replace(/[ ]/g,"") === ""){
             $verificationDialog.show();
             return;
   	      }
   	    
          carcityutil.ajax({
          	url:carcityutil.getServerHost()+"u/smscode/"+$sendPhone.text()+"/c/"+$verificationValue.val(),
          	dataType:"jsonp"
          },function(data){
               var result = data;
             if(result.isSuccess){
                window.location.href = "./fillin_password.html?phone="+$sendPhone.text();
             }else{
                 $verificationDialog.show();
             }

          });
       
   });

   $("#verificationBtn").on("click",function(){
        var $verificationBtn = $("#verificationBtn"),
            $sendPhone = $("#sendPhone"),
            time = $verificationBtn.find("span.time")[0],
            Maxtime = 90;
            if($(time).data("send") === "false"){
              $verificationBtn.addClass("disabled");
              $(time).text(Maxtime);
              $(time).data("send","true");
              carcityutil.ajax({
                  url:carcityutil.getServerHost()+"u/smscode/"+$sendPhone.text()+"/reset",
                  dataType:"jsonp"
                 },function(data){
              });

            var intervalTime = window.setInterval(function(){
                Maxtime--;
                $(time).text(Maxtime);
                if(Maxtime === 0){
                window.clearInterval(intervalTime);
               $(time).data("send","false");
               $(time).text("重新发送验证码");
               $verificationBtn.removeClass("disabled");
              }
          }, 1000); 
       }
   });

  document.getElementById("verificationBtn").click();

});;