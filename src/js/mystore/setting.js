$(function(){
    var main = new Main();
    main.init();
});

/**
 * 微店信息面板
 * @param id
 * @constructor
 */
function Main() {

}

Main.prototype.init = function(callback){
    var self = this;
    carcityutil.ajax({
        url:carcityutil.getServerHost()+"store/d/"+carcityutil.getUserId(),
        type:"get",
        dataType:"jsonp"
    },function(data){
        var result = data;
        if(result.isSuccess){
            var entity = result.entity;
            self.creatMainTopContent(entity);
            if(entity.weChat !== null){
                self.creatWeixinContent();
            }
            self.creatMainBottomContent(entity);
            var level = entity.intLevel;
            if(level > 0){
                for(var i = 0;i<level;i++){
                    self.creatLevelContent();
                }
            }
            if(callback){
                callback&&callback();
            }

          self.bindEvent();
        }else{
            $("#verificationDialog").show();
            $("#varificationSpan").text(result.errorMessage);
        }
    });

};

Main.prototype.creatMainTopContent = function(data){
    var $mainContent = $("#mainContent");
    var settingInfoTopTemplate = $('#settingInfoTopTemplate').html();
    Mustache.parse(settingInfoTopTemplate);
    var imgUrl = data.storeImage===null ? "../../images/logo-no.png": carcityutil.getServer()+ data.storeImage;
    var value = data.storeImage===null ? 0 : 1 ;
    var settingInfoTopContent = Mustache.render(settingInfoTopTemplate, {
        "name" : data.name,
        "imgUrl" :imgUrl,
        "value" : value
    });
    $mainContent.append(settingInfoTopContent);
};

Main.prototype.creatWeixinContent = function(){
    var $mainContent = $("#mainContent");
    var weixinTemplate = $('#weixinTemplate').html();
    $mainContent.append(weixinTemplate);

};

Main.prototype.creatMainBottomContent = function(data){
    var $mainContent = $("#mainContent");
    var settingInfoBottomTemplate = $('#settingInfoBottomTemplate').html();
    Mustache.parse(settingInfoBottomTemplate);
    var settingInfoBottomContent = Mustache.render(settingInfoBottomTemplate, {
        //"subName" : data.subName,
        "mobilePhone" : data.mobilePhone
    });
    $mainContent.append(settingInfoBottomContent);
};

Main.prototype.creatLevelContent = function(){
    var $level = $("#level");
    var levelTemplate = $('#levelTemplate').html();
    $level.append(levelTemplate);
};

Main.prototype.updateAjax = function(name,subName,mobilePhone,storeImage){
    carcityutil.ajax({
        url:carcityutil.getServerHost()+"store/es",
        type:"post",
        dataType:"json",
        data:{
            Id:carcityutil.getUserId(),
            Name:name,
            SubName:subName,
            MobilePhone:mobilePhone,
            StoreImage:storeImage,
            tokenKey:carcityutil.getUserId()
        }
    },function(data){
        var result = data;
        if(result.isSuccess){

        }else{
            $("#verificationDialog").show();
            $("#varificationSpan").text(result.errorMessage);
        }
    });
};

Main.prototype.bindEvent = function(){
   var self = this;
   $("#nameBlock").on("click",function(){
       $("#nameShow").val($("#name").text());
       $("#changeNameContent").show();
   });

   $("#changeNameBtn").on("click",function(){
       var name = $("#nameShow").val(), 
           subName = $("#subName").text(),
           mobilePhone = $("#mobilePhone").text(),
           blah = $("#blah"),
           imageSrc = "";
       $("#name").text($("#nameShow").val());
       $("#changeNameContent").hide();
       if(parseInt(blah.data("index")) === 1){
          imageSrc = blah.attr("src");
       }
       self.updateAjax(name,subName,mobilePhone,imageSrc);
   });

    $("#subNameBlock").on("click",function(){
        //$("#subNameShow").val($("#subName").text());
        //$("#changeSubNameContent").show();
        window.location.href="./storeNews.html?id="+carcityutil.getUserId();
    });

    $("#changeSubNameBtn").on("click",function(){
        var subName = $("#subNameShow").val(), 
             name = $("#name").text(), 
             mobilePhone = $("#mobilePhone").text(),
             blah = $("#blah"),
             imageSrc = "";
        $("#subName").text($("#subNameShow").val());
        $("#changeSubNameContent").hide();
        if(parseInt(blah.data("index")) === 1){
          imageSrc = blah.attr("src");
       }
        self.updateAjax(name,subName,mobilePhone,imageSrc);
    });

    $("#mobilePhoneBlock").on("click",function(){
        $("#mobilePhoneShow").val($("#mobilePhone").text());
        $("#verificationText").hide();
        $("#changeMobilePhoneContent").show();
    });

    $("#changeMobilePhoneBtn").on("click",function(){
        var mobilePhone = $("#mobilePhoneShow").val(), subName = $("#subName").text(),
            name = $("#name").text(),$verificationText = $("#verificationText"),
            blah = $("#blah"),
             imageSrc = "";

        if(!carcityutil.verificationPhoneNumber(mobilePhone)){
            $verificationText.show();
            return;
        }

         if(parseInt(blah.data("index")) === 1){
          imageSrc = blah.attr("src");
       }

        $("#mobilePhone").text($("#mobilePhoneShow").val());
        $("#changeMobilePhoneContent").hide();
        self.updateAjax(name,subName,mobilePhone,imageSrc);
    });


     function ajaxFileUpload(selector,imgShow) {
        var img = "#"+imgShow;
        var filePath = $("#" + selector).val();

        if (filePath == "") {
            alert("请选择图片");
            return false;
        }

        var lastIndex = filePath.lastIndexOf('.');
        var exName = filePath.substring(lastIndex, filePath.length);
        if (exName.length >= 3) {
            if (exName.toLowerCase() != ".png" && exName.toLowerCase() != ".jpg" && exName.toLowerCase() != ".jpeg" && exName.toLowerCase() != ".gif" && exName.toLowerCase() != ".bmp") {
                alert("请选择图片");
                return false;
            }

        } else {
            alert("请选择图片");
            return false;
        }

        $.ajaxFileUpload
        (
            {
                url: carcityutil.getServer()+'/file/upload', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: selector, //文件上传域的ID
                dataType: 'text', //返回值类型 一般设置为json
                success: function (data, status)  //服务器成功响应处理函数
                {
                    if (data != "error") {
                        $(img).attr("src", "\\upload" + data).data("index",1);

                        var subName = $("#subName").val(), 
                            name = $("#name").text(), 
                            mobilePhone = $("#mobilePhone").text(),
                            blah = $("#blah");
             
                            self.updateAjax(name,subName,mobilePhone,blah.attr("src"));

                    } else {
                        alert("文件上传失败")
                    }

                },
                error: function (data, status, e)//服务器响应失败处理函数
                {
                    alert(e);
                }
            }
        );

        return false;
    };

    $("#userCentreImgInp").change(function(){
        ajaxFileUpload('userCentreImgInp',"blah");
    });

};
