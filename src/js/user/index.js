$(function () {
    var occupation = new Occupation(), main = new Main(), china = new China();
    main.init(function () {
        occupation.init();
        china.init();
    });
});


/**
 * 个人信息面板
 * @param id
 * @constructor
 */
function Main() {

}

Main.prototype.init = function (callback) {
    var self = this;
    carcityutil.ajax({
        url: carcityutil.getServerHost() + "u/d/" + carcityutil.getUserId() + "/summary",
        type: "get",
        dataType: "json"
    }, function (data) {
        var result = data;
        if (result.isSuccess) {
            var entity = result.entity;
            self.creatMainTopContent(entity);
            if (entity.isWechatBound) {
                self.creatWeixinContent(entity);
            }
            self.creatMainBottomContent(entity);
            var level = entity.level
            if (level > 0) {
                for (var i = 0; i < level; i++) {
                    self.creatLevelContent();
                }
            }
            self.bindEvent();

            if (callback) {
                callback && callback();
            }

        } else {
            $("#verificationDialog").show();
            $("#varificationSpan").text(result.errorMessage);
        }
    });

};

Main.prototype.creatMainTopContent = function (data) {
    var $mainContent = $("#mainContent"), whatsupShow = $("#whatsupShow"),
        nicknameShow = $("#nicknameShow"),
        userImageShow = $("#userImageShow"),
        realnameShow = $("#realnameShow");
    var mainContentTopTemplate = $('#mainContentTopTemplate').html();
    whatsupShow.val(data.whatsup);
    nicknameShow.val(data.nickName);
    realnameShow.val(data.realName);
    var userImage = (data.userImage == ""||data.userImage == null)? "../../images/logo-no.png":data.userImage;
        userImageShow.attr("src",userImage);
    Mustache.parse(mainContentTopTemplate);
    var mainContentTopContent = Mustache.render(mainContentTopTemplate, {
        "userImage":userImage,
        "nickName": data.nickName,
        "whatsup": data.whatsup,
        "realName":data.realName
    });
    $mainContent.append(mainContentTopContent);
};

Main.prototype.creatWeixinContent = function (data) {
    var $mainContent = $("#mainContent");
    var weixinTemplate = $('#weixinTemplate').html();
    Mustache.parse(weixinTemplate);
    var weixinContent = Mustache.render(weixinTemplate, {
        "nickName": data.nickName,
        "realName": data.realName
    });
    $mainContent.append(weixinContent);
};

Main.prototype.creatMainBottomContent = function (data) {
    var $mainContent = $("#mainContent");
    var mainContentBottomTemplate = $('#mainContentBottomTemplate').html();
    Mustache.parse(mainContentBottomTemplate);
    var realStatusText = carcityutil.getRealNameAuthStatus(parseInt(data.realNameAuthStatus)),
        cardStatusStatusText = carcityutil.getIsBankCardBound(data.isBankCardBound ? 1 : 0);
    var mainContentBottomContent = Mustache.render(mainContentBottomTemplate, {
        "realNameAuthStatus": data.realNameAuthStatus,
        "address": data.address,
        "industry": data.industry,
        "realStatusText": realStatusText,
        "cardStatusStatusText": cardStatusStatusText
    });
    $mainContent.append(mainContentBottomContent);

};

Main.prototype.creatLevelContent = function () {
    var $level = $("#level");
    var levelTemplate = $('#levelTemplate').html();
    $level.append(levelTemplate);
};

Main.prototype.bindEvent = function () {
    $("#changeStatus").on("click", function () {
        $("#changeStatusContent").show();
    });

    $("#changeStatusBtn").on("click", function () {
        var whatsupShow = $("#whatsupShow"), nickNameShow = $("#nicknameShow"),
            whatsup = $("#whatsup"), nickName = $("#nickName");
        whatsup.text(whatsupShow.val());
        nickName.text(nickNameShow.val());

        carcityutil.ajax({
            url: carcityutil.getServerHost() + "u/uNW",
            type: "post",
            dataType: "json",
            data: {
                accountId: carcityutil.getUserId(),
                nickName: nickNameShow.val(),
                whatsup: whatsupShow.val(),
                tokenKey: carcityutil.getUserId()
            }
        }, function (data) {
            var result = data;
            if (result.isSuccess) {

            } else {
                $("#verificationDialog").show();
                $("#varificationSpan").text(result.errorMessage);
            }
        });
        $("#changeStatusContent").hide();
    });

    $("#loginOut").on("click", function () {
        carcityutil.ajax({
            url: carcityutil.getServerHost() + "u/signout/" + carcityutil.getUserId(),
            type: "get",
            dataType: "jsonp"
        }, function (data) {
            var result = data;
            if (result.isSuccess) {
                carcityutil.getLocalStorage().remove("userId");
                window.location.href = "../login/login.html";
            } else {
                $("#verificationDialog").show();
                $("#varificationSpan").text(result.errorMessage);
            }
        });

    });

    $("#bindCard").on("click", function () {
        var $realNameHref = $("#realNameHref");

        if (parseInt($realNameHref.data("index")) != 2) {
            $("#verificationDialog").show();
            $("#varificationSpan").text("实名认证通过后，才能绑定！");
            return;
        }
        window.location.href = './bind_card.html?accountname=' + $("#realnameShow").val();
    });
    function updateImage(userImage){
        carcityutil.ajax({
            url:carcityutil.getServerHost()+"u/uui",
            type:"post",
            dataType:"json",
            data:{
                userImage:userImage,
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

    function ajaxFileUpload(selector,imgShow,changeImage) {
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
                        $(img).attr("src", "\\upload" + data);
                        $("#"+changeImage).attr("src", "\\upload" + data);
                        updateImage("\\upload" + data);
          /*              var subName = $("#subName").val(),
                            name = $("#name").text(),
                            mobilePhone = $("#mobilePhone").text(),
                            blah = $("#blah");

                        self.updateAjax(name,subName,mobilePhone,blah.attr("src"));*/


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
        ajaxFileUpload('userCentreImgInp',"userImageShow","userImage");
    });
};



/**
 * 行业面板
 * @param id
 * @constructor
 */
function Occupation() {
    this.data = null;
}

Occupation.prototype.parseDate = function (data) {
    this.setData(data);
};

Occupation.prototype.setData = function (data) {
    this.data = data;
};

Occupation.prototype.getData = function () {
    return this.data;
};

Occupation.prototype.init = function () {
    var self = this;

    $("#occupation").on("click", function () {
        var $verificationDialog = $("#verificationDialog"), occupationList = self.getData();
        if (occupationList === null) {
            carcityutil.ajax({
                url: carcityutil.getServerHost() + "s/vl",
                type: "get",
                dataType: "jsonp"
            }, function (data) {
                var result = data;
                if (result.isSuccess) {
                    var list = result.entity;
                    self.parseDate(list);
                    $.each(list, function () {
                        self.createList(this);
                    });
                    $("#occupationList").show();
                    self.bindEvent();
                } else {
                    $verificationDialog.show();
                    $varificationSpan.text("拿不到行业列表！");
                }
            });
        } else {
            $("#occupationList").show();
        }
    });

};

Occupation.prototype.createList = function (data) {
    var $occupationListBlock = $("#occupationListBlock");
    var occupationListTemplate = $('#occupationListTemplate').html();
    Mustache.parse(occupationListTemplate);
    var occupationListContent = Mustache.render(occupationListTemplate, {
        "Key": data.Key,
        "Value": data.Value
    });
    $occupationListBlock.append(occupationListContent);
};

Occupation.prototype.bindEvent = function () {
    var self = this;
    $("#occupationListBlock").delegate("a", "click", function () {
        var that = this, $occupationText = $("#occupationText");
        $occupationText.text(that.dataset.text);

        $("#occupationList").hide();

        carcityutil.ajax({
            url: carcityutil.getServerHost() + "u/uIndustry",
            type: "post",
            dataType: "json",
            data: {
                accountId: carcityutil.getUserId(),
                industry: $occupationText.text(),
                tokenKey: carcityutil.getUserId()
            }
        }, function (data) {
            var result = data;
            if (result.isSuccess) {

            } else {
                $("#verificationDialog").show();
                $("#varificationSpan").text(result.errorMessage);
            }
        });

    });
};


/**
 * 省市县/区面板
 * @param id
 * @constructor
 */
function China() {
    this.data = null;
};
China.prototype.parseDate = function (data) {
    this.setData(data);
};

China.prototype.setData = function (data) {
    this.data = data;
};

China.prototype.getData = function () {
    return this.data;
};


China.prototype.init = function () {
    var self = this;
    self.bindEvent();
    $("#address").on("click", function () {
        var $verificationDialog = $("#verificationDialog"), addressList = self.getData(),
             locationListString = carcityutil.getLocalStorage().getValue("address");
        var locationList = JSON.parse(locationListString);
        if (locationList === null) {
            if (addressList === null) {
                carcityutil.ajax({
                    url: carcityutil.getServerHost() + "s/rl/" + carcityutil.getRegionListId(),
                    type: "get",
                    dataType: "jsonp"
                }, function (data) {
                    var result = data;
                    if (result.isSuccess) {
                        var list = result.entity;
                        self.parseDate(list);
                        var locationList = JSON.stringify(list);
                        carcityutil.getLocalStorage().setValue("address", locationList);
                        $.each(list.children, function () {
                            self.createCityTag(this);
                        });
                        $("#citySelect").show();
                    } else {
                        $verificationDialog.show();
                        $varificationSpan.text(result.errorMessage);
                    }
                });
            } else {
                $.each(addressList.children, function () {
                    self.createCityTag(this);
                });
                $("#citySelect").show();
            }
        } else {
            $.each(locationList.children, function () {
                self.createCityTag(this);
            });
            $("#citySelect").show();
            //self.bindEvent();
        }
    });

    $("#citySelectClose").on("click", function () {
        $("#citySelect").hide();
        $("#citySelectStatus").val("0");
        $("#citySelectTag").html("");
        $("#province").val("");
    });

};

China.prototype.createCityTag = function (data) {
    var $citySelectTag = $("#citySelectTag");
    var citySelectTemplate = $('#citySelectTemplate').html();
    Mustache.parse(citySelectTemplate);
    var citySelectContent = Mustache.render(citySelectTemplate, {
        "id": data.id,
        "name": data.name,
        "children": JSON.stringify(data.children)
    });
    $citySelectTag.append(citySelectContent);
};

China.prototype.bindEvent = function () {
    var self = this;
    $("#citySelectTag").delegate("a", "click", function () {
        var $a = this, citySelectStatus = $("#citySelectStatus"), province = $("#province");
        var step = parseInt(citySelectStatus.val());
        step++;
        citySelectStatus.val(step);

        var value = province.val();
        value += $a.text;
        province.val(value);

        var source = $a.dataset.source, list = JSON.parse(source);
        if (list.length !== 0) {
            $("#citySelectTag").html("");
            $.each(list, function () {
                self.createCityTag(this);
            });
        }

        if (step === 3) {

            var regionId = $a.dataset.index;
            self.modifyLocation(value, regionId);
            $("#addressText").text(value);
        }
    });
};

China.prototype.modifyLocation = function (address, regionId) {
    carcityutil.ajax({
        url: carcityutil.getServerHost() + "u/uAddress",
        type: "post",
        dataType: "json",
        data: {
            accountId: carcityutil.getUserId(),
            address: address,
            regionId: regionId,
            tokenKey: carcityutil.getUserId()
        }
    }, function (data) {
        var result = data;
        if (result.isSuccess) {
            $("#citySelect").hide();
            $("#citySelectStatus").val("0");
            $("#citySelectTag").html("");
            $("#province").val("");
        } else {
            $("#citySelect").hide();
            $("#citySelectStatus").val("0");
            $("#citySelectTag").html("");
            $("#province").val("");
            $("#verificationDialog").show();
            $("#varificationSpan").text(result.errorMessage);
        }
    });
};


