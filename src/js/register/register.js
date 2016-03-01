$(function(){
   var china = new China();
   china.init();
   $("#nextStep").on("click",function(){
   	  var $phoneNumber = $("#phoneNumber"),
   	      $agreement = $("#agreement"),
   	      $verificationDialog = $("#verificationDialog");

   	      if(!carcityutil.verificationPhoneNumber($phoneNumber.val())){
             $verificationDialog.show();
             $("#varificationSpan").text("请输入手机号！");
             return;
   	      }

   	      if(!$agreement.is(':checked')){
             $verificationDialog.show();
             $("#varificationSpan").text("请同意该协议！");
             return;
   	      }

          carcityutil.ajax({
          	url:carcityutil.getServerHost()+"u/vp/"+ $phoneNumber.val(),
          	dataType:"jsonp"
          },function(data){
             var result = data;
             if(result.isSuccess){
                window.location.href = "./verification.html?phone="+$phoneNumber.val();
             }else{
                 $verificationDialog.show();
                 $("#varificationSpan").text("手机已注册！");
             }
          });
   });


});


/**
 * 省市县/区面板
 * @param id
 * @constructor
 */
function China() {
    this.data = null;
};
China.prototype.parseDate = function(data){
   this.setData(data);
};

China.prototype.setData = function(data){
    this.data = data;
};

China.prototype.getData = function(){
    return this.data;
};


China.prototype.init = function(){
    var self = this;
    self.bindEvent();
  $("#address").on("click",function(){
     var $verificationDialog = $("#verificationDialog"),addressList = self.getData(),
          locationListString = carcityutil.getLocalStorage().getValue("address");
     var locationList = JSON.parse(locationListString);
    if(locationList === null){
    if(addressList === null){
       carcityutil.ajax({
         url:carcityutil.getServerHost()+"s/rl/"+carcityutil.getRegionListId(),
         type:"get",
         dataType:"jsonp"
         },function(data){
          var result = data;
          if(result.isSuccess){
              var list  = result.entity;
              self.parseDate(list);
              var locationList = JSON.stringify(list);
              carcityutil.getLocalStorage().setValue("address",locationList);
              $.each(list.children,function(){
                 self.createCityTag(this);
              });
              $("#citySelect").show();
           }else{
               $verificationDialog.show();
               $varificationSpan.text(result.errorMessage);
          }
       });
      }else{
        $.each(addressList.children,function(){
                 self.createCityTag(this);
              });
              $("#citySelect").show();
     }
   }else{
      $.each(locationList.children,function(){
                 self.createCityTag(this);
            });
       $("#citySelect").show();
        //self.bindEvent();
   }
  });

  $("#citySelectClose").on("click",function(){
          $("#citySelect").hide();
          $("#citySelectStatus").val("0");
          $("#citySelectTag").html("");
          $("#province").val("");
  });
 
};

China.prototype.createCityTag = function(data){
   var $citySelectTag = $("#citySelectTag");
    var citySelectTemplate = $('#citySelectTemplate').html();
    Mustache.parse(citySelectTemplate);
    var citySelectContent = Mustache.render(citySelectTemplate, {
        "id" : data.id,
        "name" : data.name,
        "children":JSON.stringify(data.children)
    });
    $citySelectTag.append(citySelectContent);
};

China.prototype.bindEvent = function(){
  var self = this;
    $("#citySelectTag").delegate("a","click",function(){
        var $a = this,citySelectStatus = $("#citySelectStatus"),province = $("#province");
        var step = parseInt(citySelectStatus.val());
        step++;
        citySelectStatus.val(step);

        var value = province.val();
        value +=  $a.text;
        province.val(value);
       
        var source = $a.dataset.source,list = JSON.parse(source);
        if(list.length !== 0){
          $("#citySelectTag").html("");
           $.each(list,function(){
                 self.createCityTag(this);
            });
        }

         if(step===3){

          var regionId = $a.dataset.index;
             $("#cityLocation").text(value);
          //self.modifyLocation(value,regionId);
             $("#citySelect").hide();
             $("#citySelectStatus").val("0");
             $("#citySelectTag").html("");
             $("#province").val("");

        }
    });
};