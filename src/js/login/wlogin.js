$(function () {
    var china = new China();
    china.init();
    $("#loginBtn").on("click", function () {
        var $password = $("#password"),
            $phone = $("#phone"),
            $verificationDialog = $("#verificationDialog");

        if (!carcityutil.verificationPhoneNumber($phone.val())) {
            $verificationDialog.show();
            $("#varificationSpan").text("请输入正确的手机号！")
            return;
        }

        if ($password.val().replace(/[ ]/g, "") === "") {
            $verificationDialog.show();
            $("#varificationSpan").text("请重新输入密码！");
            return;
        }

        carcityutil.ajax({
            url: carcityutil.getServerHost() + "u/wlogin",
            type: "post",
            dataType: "json",
            data: {
                openId: openId,
                phone: $phone.val(),
                password: $password.val()
            }
        }, function (data) {
            var result = data;
            if (result.isSuccess) {
                carcityutil.getLocalStorage().setValue("userId", result.entity.id);

                window.location.href = "../home.html";
            } else {
                $verificationDialog.show();
                $("#varificationSpan").text("账户或密码不匹配，请重新输入！");
            }
        });
    });

    /*if (window.navigator.geolocation) {
          var options = {
             enableHighAccuracy: true,
           };
          // window.navigator.geolocation.getCurrentPosition(handleSuccess,handleError,options);
          handleSuccess({
           coords:{
             longitude: 31.231125216173815,
             latitude: 121.5162620859278
           }
          });
     } else {
           alert("浏览器不支持html5来获取地理位置信息");
     }
 
     function handleSuccess(position){
         // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
         var lng = position.coords.longitude;    //31.231125216173815
         var lat = position.coords.latitude;     //121.5162620859278
         // 调用百度地图api显示
         var map = new BMap.Map("map");
         var ggPoint = new BMap.Point(lng, lat);
         // 将google地图中的经纬度转化为百度地图的经纬度
         BMap.Convertor.translate(ggPoint, 2, function(point){
         var marker = new BMap.Marker(point);
         map.addOverlay(marker);
         map.centerAndZoom(point, 15);
         // 百度地图API功能
 var map = new BMap.Map("allmap");
 var point = new BMap.Point(lng,lat);
 var gc = new BMap.Geocoder();
 gc.getLocation(point, function(rs){
    var addComp = rs.addressComponents;
    alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
 });
      };
    
 
    function handleError(error){
       alert(error)
    }*/




});

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
            $("#cityLocation").text(value);
            //self.modifyLocation(value,regionId);
            $("#citySelect").hide();
            $("#citySelectStatus").val("0");
            $("#citySelectTag").html("");
            $("#province").val("");

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
            regionId: regionId

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