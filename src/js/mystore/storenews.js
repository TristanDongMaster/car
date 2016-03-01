
$(function(){
	var storeInfo = carcityutil.checkUserType();
	var storeId = storeInfo.entity.id;
	if(!storeInfo.entity.type){
		$(".headerContainer_right ").remove();
	}
	var templateNews = $('#template').html();
	Mustache.parse(templateNews);
	var template = $('#template-detail').html();
	Mustache.parse(template);
	var id = storeId;
	interfaceApi.getStoreNoticeById(id, 1, function(data){
	    carcityutil.getTemplated($("#store_new"),templateNews, data);
	});
	
	$("body").on("tap", " .merchant-content", function(){
		console.log($(this).attr("data-id"));
		interfaceApi.getStoreNoticeDetailById($(this).attr("data-id"), function(data){
	        var rendered = Mustache.render(template, data);
	        $(".goodCommon .userCentreColor").html(Mustache.render(rendered));
		});
	});

	$("body").on("tap", " .add-news", function(){
		$("#changeStatusContent").show();
	});
	
	$("#changeStatusBtn").on("click", function(){
		var data = {
					StoreId: storeId,
					SubTitle:"",
					Title: $("#nicknameShow").val(),
					Content: $("#whatsupShow").val()
					};
			if(data.Title == ""|| data.Content == ""){
				carcityutil.showMessageDialog("请输入正确内容");
				return;
			}
		interfaceApi.addStoreNotice(data, function(data){
			if(data.isSuccess){
				$("#changeStatusContent").hide();
			}
			else{
					carcityutil.showMessageDialog(data.errorMessage);
			}
	       
		});
	});

	interfaceApi.getStoreInfoById(storeId, function(data){
	    storeInfo.entity.mobilePhone = data.entity.mobilePhone;
    	carcityutil.getTemplate($("#navigation"),$('#navigation-template'), storeInfo);
    	carcityutil.setStoreIdHTML(storeId);
	});

});