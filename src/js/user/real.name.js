$(function(){
    window.URL = window.URL || window.webkitURL;
    var fileElem = document.getElementById("imgInp");
    function handleFiles(obj,targetObj,showObj) {
        var files = obj.files;
        console.log(window.URL);
        targetObj.data("index","1");
        if(window.URL){
            //File API
           // alert(files[0].name + "," + files[0].size + " bytes");
            //img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
            //targetObj.attr('src', window.URL.createObjectURL(files[0]));
            showObj.css("background-image","url("+window.URL.createObjectURL(files[0])+")");
            targetObj.hide();
        }else if(window.FileReader){
            //opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(e){
                 //targetObj.attr('src', e.target.result);
                 showObj.css("background-image","url("+e.target.result+")");
                 targetObj.hide();
            }
        }else{
            //ie
            obj.select();
            obj.blur();
            var nfile = document.selection.createRange().text;
            document.selection.empty();
            showObj.css("background-image","url("+nfile+")");
            //targetObj.attr('src', nfile);
            targetObj.hide();
           
            //fileList.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src='"+nfile+"')";
        }
    };

    var realName = new RealName();
    realName.init();
});

/**
 * 认证信息面板
 * @param id
 * @constructor
 */
function RealName() {
};

RealName.prototype.init = function(){
    var self = this;
    carcityutil.ajax({
        url:carcityutil.getServerHost()+"realname/detail/"+carcityutil.getUserId(),
        type:"get",
        dataType:"jsonp"
    },function(data){
        var result = data;
		var nullEntity = {
                   "userImage" : null,
                   "idNumber" : "",
                   "realName" : "",
                   "idFrontImage" : null,
                   "idBackImage" : null,
                   "intStatus":0
               };
        if(result.isSuccess){
           var entity = result.entity;
           if(parseInt(entity.intStatus)===0 ||parseInt(entity.intStatus)===3){
               self.createContent(nullEntity);
               self.bindEvent();
           }else{
               self.createContent(entity);
           }
        }else{
			if(result.errorCode && result.errorCode == "RealNameAuthNotExists"){
				self.createContent(nullEntity);
				self.bindEvent();
			}else{
               $("#verificationDialog").show();
               $("#varificationSpan").text(result.errorMessage);
			}
        }
    });
};

RealName.prototype.createContent = function(data){
    var defaultAddImage = "../../images/add.png",defaultUserImage = "../../images/logo-no.png";

    var $content = $("#content");
    var realNameTemplate = $('#realNameTemplate').html();
    Mustache.parse(realNameTemplate);
    var btnText = carcityutil.getRealNameAuthStatus(parseInt(data.intStatus)),
        userImage = data.userImage == null ? defaultUserImage:data.userImage,
        idFrontImage = data.idFrontImage == null ? defaultAddImage:data.idFrontImage,
        idBackImage = data.idBackImage == null ? defaultAddImage:data.idBackImage;

    var realNameContent = Mustache.render(realNameTemplate, {
        "userImage" : userImage,
        "idNumber" : data.idNumber,
        "realName" : data.realName,
        "idFrontImage" : idFrontImage,
        "idBackImage" : idBackImage,
        "intStatus" : data.intStatus,
        "btnText" : btnText
    });
    $content.append(realNameContent);
};

RealName.prototype.bindEvent = function(){
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

    $("#imgInp").change(function(){
        //readURL(this);
        //handleFiles(this,$("#blah"),$("#imgInpDiv"));
        ajaxFileUpload('imgInp',"blah");
    });

    $("#imgInpBack").change(function(){
        //readURL(this);
        //handleFiles(this,$("#blahBack"),$("#imgInpBackDiv"));
        ajaxFileUpload('imgInpBack',"blahBack");
    });

    $("#userCentreImgInp").change(function(){
        //readURL(this);
        //handleFiles(this,$("#userCentreImgShow"));
        ajaxFileUpload('userCentreImgInp',"userCentreImgShow");
    });

    $("#submitData").on("click",function(){
        var $cardId = $("#cardId"),
            $tureName = $("#tureName"),
            $agreement = $("#agreement"),
            $varificationSpan = $("#varificationSpan"),
            $verificationDialog = $("#verificationDialog"),
            $userCentreImgShow = $("#userCentreImgShow"),
            $blah = $("#blah"),
            $blahBack = $("#blahBack");

        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test($cardId.val()) === false)
        {
            $verificationDialog.show();
            $varificationSpan.text("请输入正确的身份证号！");
            return;
        }

        if($tureName.val().replace(/[ ]/g,"") === ""){
            $verificationDialog.show();
            $varificationSpan.text("请输入真实姓名！");
            return;
        }


        if(parseInt($blah.data('index')) === 0 || parseInt($blahBack.data('index')) === 0){
            $verificationDialog.show();
            $varificationSpan.text("请上传身份证正反面！");
            return;
        }

        if(!$agreement.is(':checked')){
            $verificationDialog.show();
            $varificationSpan.text("请同意协议！");
            return;
        }

        var userImage = $userCentreImgShow.attr("src");
        if(parseInt($userCentreImgShow.data('index')) === 0){
            userImage = null;
        }

        carcityutil.ajax({
            url:carcityutil.getServerHost()+"realname/apply",
            type:"post",
            dataType:"json",
            data:{
                UserImage:userImage,
                RealName: $tureName.val(),
                IdNumber: $cardId.val(),
                IdFrontImage: $blah.attr("src"),
                IdBackImage: $blahBack.attr("src"),
                tokenKey:carcityutil.getUserId()
            }
        },function(data){
            var result = data;
            if(result.isSuccess){
                $verificationDialog.show();
                $varificationSpan.text("申请已提交！");
                setTimeout(function(){
                    window.location.href = "./index.html";
                },1000);
            }else{
                $verificationDialog.show();
                $varificationSpan.text("申请提交失败！");
            }
        });

    });
};



