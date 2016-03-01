
 var carcityutil = (function(){
    /* var SERVER = 'http://v.diyichecheng.com';
     var SERVER_HOST = 'http://v.diyichecheng.com/api/';
     var region_list_id = "2128d640-8557-4d2d-b540-19912859f297"; */
      var SERVER = 'http://v.diyichecheng.com';
     var SERVER_HOST = 'http://v.diyichecheng.com/api/';
      var region_list_id = "B1A9E561-4E31-4752-89CE-6EF320BFE5FA"; 
   var realNameAuthStatus = {          //实名认证的状态
       0:"未认证",
       1:"认证处理中",
       2:"已认证",
       3:"认证失败"
     };

      var isBankCardBound = {          //银行绑定状态
       0:"未绑定",
       1:"已绑定"
     };

      Array.prototype.filterByWord = function(word){
        var data = {};
        var array = this.filter(function(item){
          return (item.startWith==word||!word);
        }); 
        data.entity = array
        return data;   
      };


      return {


         /**
         * 获取服务器域名信息
         * @returns {string}
         */
        getServerHost : function(){
            return SERVER_HOST;
        },
        getServer : function(){
            return SERVER;
        },
        getRegionListId : function(){
            return region_list_id;
        },
        getRealNameAuthStatus:function(flag){
          return realNameAuthStatus[flag];
        },
        getIsBankCardBound:function(flag){
          return isBankCardBound[flag];
        },
        getUserId : function(){
          var userId = this.getLocalStorage().getValue("userId");
          if(userId == null || userId == undefined || userId == ""){
               window.location.href="../login/login.html";
           }
          return userId;
        },
        checkUserType: function(){
          //true 分销商， false 客户
          var data = {entity:{type:false, id:""}};
          var id = location.hash;
          var userId = this.getLocalStorage().getValue("userId");
          if(id!=""){
            id = id.substring(1, id.length);
          }
          if(id==""&&(userId == null || userId == undefined || userId == "")){
             window.location.href="../login/login.html";
             return;
          }
          else if((userId != null && userId != undefined && userId != "" && userId == id) || (userId != null && userId != undefined && userId != "" && id =="")){
              data.entity.id = userId;
              data.entity.type = true;
              location.hash = userId;
          }
          else{
              data.entity.id = id;
              data.entity.type = false;
          }
          return data;
        },
        getUserIdNo : function(){
          var userId = this.getLocalStorage().getValue("userId");
          if(userId == null || userId == undefined || userId == ""){
              return {entity:false};;
           }
          return {entity:userId};
        },
        setStoreIdHTML: function(storeId){
            $("body").find("#navigation a").each(function(index, value){
              if($(this).attr("href").indexOf("tel")<0){
                $(this).attr("href", $(this).attr("href")+ "#" + storeId);
              }
            });
        },
        verificationPhoneNumber: function(tel){
          var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
          if (reg.test(tel)) {
             return true;
          }else{
            return false;
          }  
        },
      
         /**
         * ajax异步传输
         * @param option
         * @param callback
         */
        ajaxT : function(option,callback){
            $mask.start();
            $.ajax({
                url: carcityutil.getServerHost() + option.url,
                type: option.type ? option.type : 'get',
                dataType: option.dataType,
                async: false,
                data: option.data,
                success: function(data) {
                    $mask.end();
                    callback(data);
                },
                error: function() {
                  $mask.end();
                  alert("网络异常！");
                }
            });
        },

        ajaxNo : function(option,callback){
            $.ajax({
                url: carcityutil.getServerHost() + option.url,
                type: option.type ? option.type : 'get',
                dataType: option.dataType,
                async: false,
                data: option.data,
                success: function(data) {
                    callback(data);
                },
                error: function() {
                  alert("网络异常！");
                }
            });
        },

        ajax : function(option,callback){
            $mask.start();
            $.ajax({
                url: option.url,
                type: option.type ? option.type : 'get',
                dataType: option.dataType,
                async: false,
                data: option.data,
                success: function(data) {
                    $mask.end();
                    callback(data);
                },
                error: function() {
                  $mask.end();
                  alert("网络异常！");
                }
            });
        },
        /**
         * 从URL中获取指定的名称的value值
         * @param name
         * @returns {*}
         */
        getValueFromURL: function (name) {
            var url = decodeURI(location.search);
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var key = strs[i].split("=")[0];
                    theRequest[key] = strs[i].split("=")[1];
                }
            }
            return theRequest[name];
        },

        getTemplate : function($container,$template, viewData ){
            var template = $template.html();
            Mustache.parse(template); // optional, speeds up future uses
            var rendered = Mustache.render(template, viewData);
            $container.html(rendered);
        },

        getTemplated : function($container, template, viewData ){
            var rendered = Mustache.render(template, viewData);
            $container.append(rendered);
        },

        convertCurreny: function(money){
            money = money.toString().replace(/\$|\,/g,'');  
            if(isNaN(money))  
                money = "0";  
            var sign = (money == (money = Math.abs(money)));  
            money = Math.floor(money*100+0.50000000001);  
            var cents = money%100;  
            money = Math.floor(money/100).toString();  
            if(cents<10)  
            cents = "0" + cents;  
            for (var i = 0; i < Math.floor((money.length-(1+i))/3); i++)  
            money = money.substring(0,money.length-(4*i+3))+','+  
            money.substring(money.length-(4*i+3));  
            return (((sign)?'':'-') + money + '.' + cents); 
        },
        convertData : function(data){
            var convertPrice =  function(){
                return function(money, render){
                    money = render(money);
                    if(money<10000){
                          return (carcityutil.convertCurreny(money) + "元");
                    }
                    money = money/10000;
                    return (carcityutil.convertCurreny(money) + "万");
                };
            };

            var convertImg = function(){
                return  function(imgUrl, render){
                  imgUrl = render(imgUrl);
                  if(imgUrl == "" || imgUrl == undefined || imgUrl == null){
                    imgUrl = "../../images/loading_wait.png";
                  }
                  else{
                    imgUrl = carcityutil.getServer() +  imgUrl.split("\\").join("/");
                  }
                  return imgUrl;
              };
            } ;

            var convertBigImg = function(){
                return  function(imgUrl, render){
                  imgUrl = render(imgUrl);
                  if(imgUrl == "" || imgUrl == undefined || imgUrl == null){
                    imgUrl = "";
                  }
                  else{
                    imgUrl = carcityutil.getServer() +  imgUrl.split("\\").join("/");
                  }
                  return imgUrl;
              };
            } ;

            var convertImgs = function(){
                return  function(imgUrls, render){
                    imgUrls = render(imgUrls);
                    if(imgUrls == "" || imgUrls == undefined || imgUrls == null){
                      imgUrls = "";
                    }
                    else{
                      imgUrls = imgUrls.split(",");
                      imgUrls = carcityutil.getServer() +  imgUrls[0];
                    }
                    return imgUrls;
                };
            };

            var convertRate =  function(){
                  return  function(num, render){
                    num = parseInt(render(num));
                    var html = "<span class='icon padding-zero'><img src='../../images/love.png'></span>";
                    if(num > 0){
                        html = "";
                        while(num >0){
                            num --;
                            html += "<span class='icon padding-zero'><img src='../../images/love_active.png'></span>";
                        }
                    }
                    return html;
                };
            };
            data.convertPrice = convertPrice;
            data.convertImg = convertImg;
            data.convertImgs = convertImgs;
            data.convertBigImg = convertBigImg;
            data.convertRate = convertRate;
            return data;
        },
        unique: function(arr1, colorType) {
            var arr = arr1[colorType];
              var result = [];
              for (var i = 0, len = arr.length; i < len; i++) {
                var repeat = false;
                  for (var j = result.length - 1; j >= 0; j--) {
                    if(result[j].id == arr[i].id){
                      repeat = true;
                      break;  
                    }
                  };
                  if(!repeat){
                    result.push(arr[i]);
                  }
              }
              arr1[colorType] = result;
              return arr1;
        },

          // convert data to color array
        getColor: function(data, colorType){
            var arr = arr||{};
            arr[colorType] = arr[colorType] || [];
            for (var i = data.entity.vehiclePrices.length - 1; i >= 0; i--) {
              var current = data.entity.vehiclePrices[i];
              arr[colorType].push({id:current[colorType].id, rgbValue:current[colorType].rgbValue, name:current[colorType].name});
            };
            return arr;
        },

        showMessageDialog: function(message, callback){
          var text = '<div class="goodCommon" id="verificationDialog" >'+
                        '<div class="goodTableRow">'+
                           ' <div class="goodTableCell">'+
                                '<div class="goodTableContent car-confirm-colors-list-block">'+
                                   ' <i class="closeBtn" onclick="javascript:this.parentNode.parentNode.parentNode.parentNode.style.display=\'none\'"></i>'+
                                   ' <div class="goodmianContent">'+
                                        '<span class="varification-span" id="varificationSpan">'+
                                            message +
                                        '</span>'+
                                    '</div>'+
                              '</div>'+
                            '</div>'+
                        '</div>' +
                      '</div>';
          if($("body").find("#verificationDialog").length){
            $("#varificationSpan").text(message);
            $("#verificationDialog").show();
          }
          else{
            $("body").append(text);
            $("#verificationDialog").show();
          }
          $("body").on("click", "#verificationDialog .closeBtn", function(){
            if(callback!=null && callback!=undefined){
              callback();
            }
          });
        },
        shareDialog: function(){
          var html = "<div id='share-cover'><img src='../../images/share-cover.png'></div>";
           if($("body").find("#share-cover").length){
            $("#share-cover").show();
          }
          else{
            $("body").append(html);
            $("#share-cover").show();
          }
          $("body").on("click", "#share-cover", function(){
              $(this).hide();
          });
        },
                /**
         * 图片加载完全处理函数
         * @param cintainerId
         * @param callback
         */
        isImageLoadComplete: function (cintainerId, callback) {
            var res = true;
            var imgs = $('#' + cintainerId + ' img');
            var len = imgs.length;
            var id = setInterval(function () {
                res = true;
                for (var i = 0; i < len; i++) {
                    if (imgs[i].complete === false) {
                        res = false;
                        break;
                    }
                }
                if (res !== false) {
                    $('#' + cintainerId).show();
                    if (callback !== undefined) {
                        callback();
                    }
                    clearInterval(id);
                }
            }, 10);
        },

                /**
         * LocalStorage存储离线数据
         * @returns {{setValue: setValue, getValue: getValue, getAllValue: getAllValue, remove: remove, clear: clear, isKeyExist: isKeyExist}}
         */
        getLocalStorage : function(){
            return {
                //设置值
                setValue : function (key,value){
                    window.localStorage.setItem(key,value);
                },
                //如果不存在 返回null
                getValue : function (key){
                    return window.localStorage.getItem(key);
                },
                //获取所有的值
                getAllValue : function(){
                    return window.localStorage;
                },
                //删除一个键值
                remove : function (key){
                    window.localStorage.removeItem(key);
                },
                //清除所有的值
                clear : function (){
                    window.localStorage.clear();
                },
                //判断这个key是否存在
                isKeyExist : function (key){
                    var storage = window.localStorage,flag = false;
                    for(var i = 0;i < storage.length;i++){
                        if(storage.key(i) === key){
                            flag = true;
                            break;
                        }
                    }
                    return flag;
                }
            };
        },
        setStoreIdInHashNoless: function(id){
              if(id!=""){
               // var storeId =  location.hash.substring(1, location.hash.length);
                  $("nav a").each(function(index, value){
                    $(this).attr("href", $(this).attr("href")+ "#" + id);
                  });
              }
              else{
                  var storeId =  location.hash.substring(1, location.hash.length);
                  $("nav a").each(function(index, value){
                    $(this).attr("href", $(this).attr("href")+ "#" + storeId);
                  });
              }
          }



      };
 })();


      



