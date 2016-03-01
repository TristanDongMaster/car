$(function(){
     var $accountName = $("#accountName");
         $accountName.text(carcityutil.getValueFromURL("accountname"));
      var main = new Main();
      main.init();
});


function Main(){};

Main.prototype.init = function(){
   var self = this;
    var $verificationDialog = $("#verificationDialog"),
        $varificationSpan = $("#varificationSpan");
    carcityutil.ajax({
        url:carcityutil.getServerHost()+"u/bc/" + carcityutil.getUserId(),
        type:"get",
        dataType:"jsonp"
    },function(data) {
        var result = data;
        if(result.isSuccess){
            var entity = result.entity;
            if(entity.length > 0){
                self.createHasContent(entity[0]);
                $("#bindCard").hide();
            }else{
                self.createContent();
                self.bindEvent();
            }
        }else{
            $verificationDialog.show();
            $varificationSpan.text(result.errorMessage);
        }
    });
};

Main.prototype.createHasContent = function(data){
    var $content = $("#content");
    var hasContentTemplate = $('#hasContentTemplate').html();
    Mustache.parse(hasContentTemplate);
    var hasContent = Mustache.render(hasContentTemplate, {
        "bankName" : data.bankName,
        "cardCode" : data.cardCode
    });
    $content.append(hasContent);
};

Main.prototype.createContent = function(){
    var $content = $("#content");
    var contentTemplate = $('#contentTemplate').html();
    $content.append(contentTemplate);
};

Main.prototype.bindEvent = function(){
    carcityutil.ajax({
        url:carcityutil.getServerHost()+"s/bnl",
        type:"get",
        dataType:"jsonp"
    },function(data){
        var result = data;
        var $verificationDialog = $("#verificationDialog"),
            $varificationSpan = $("#varificationSpan"),
            $bankList = $("#bankList");
        if(result.isSuccess){
            var list  = result.entity;
            $.each(list,function(){
                var option = "<option value="+this.Value+">"+this.Value+"</option>";
                $bankList.append(option);
            });
        }else{
            $verificationDialog.show();
            $varificationSpan.text("拿不到银行列表！");
        }
    });

    $("#bindCard").on("click",function(){
        var $card = $("#card"),
            $cardSure = $("#cardSure"),
            $bankList = $("#bankList"),
            cardValue = $card.val(),
            cardSureValue = $cardSure.val(),
            $verificationDialog = $("#verificationDialog"),
            $varificationSpan = $("#varificationSpan");
        var reg = /^\d{16}|\d{19}|\d{4}(?:\s\d{4}){3}$/;

        if(reg.test($card.val()) === false)
        {
            $verificationDialog.show();
            $varificationSpan.text("请输入正确的卡号！");
            return;
        }

        if(!((cardValue.replace(/[ ]/g,"")!= "") && (cardValue.replace(/[ ]/g,"") === cardSureValue.replace(/[ ]/g,"")))){
            $verificationDialog.show();
            $varificationSpan.text("请输入一致的卡号！");
            return;
        }

        carcityutil.ajax({
            url:carcityutil.getServerHost()+"m/bc",
            type:"post",
            dataType:"json",
            data:{
                BankName: $bankList.val(),
                CardCode: cardValue,
                AccountName:$("#accountName").text(),
                tokenKey:carcityutil.getUserId()
            }
        },function(data){
            var result = data;
            if(result.isSuccess){
                $verificationDialog.show();
                $varificationSpan.text("提交成功！");
                var setTime = setTimeout(function(){
                    window.location.href = "./index.html";
                },1000);
            }else{
                $verificationDialog.show();
                $varificationSpan.text(result.errorMessage);
            }
        });
    });
};