$(function(){
	$("body").on("click", " .share-btn, .share-btn-code", function(){
		carcityutil.shareDialog();
		return;
			$(".dialog-custom").show();
			$("#withdraw-dialog").show();
	});
	$("#ensure-withdraw").on("click", function(){
		$("#withdraw-dialog").show();
	});

	$("body").on("click", " .share-btn-copy", function(){
			$(".dialog-store").show();
	});


	$("body").on("click", " .dialog-block", function(event){
		var target = $(event.target);
		if(!target.closest(".dialog-custom-container").length){
			$(this).closest(".dialog-block").hide();
		}
	});

	$("body").on("click", " .share-closed", function(){
		$(this).closest(".dialog-block").hide();
	})
	$("body").on("tap", " .share-code-btn", function(){
		$(this).closest(".dialog-custom").hide();
		$(".dialog-custom-code").show();
	});

	$("body").on("tap", " .store-setting", function(){
		$(".dialog-custom").show();
	});
	$("body").on("tap", " #store_new .merchant-content", function(){
		$("#carColors").show();
	});


	$("body").on("tap", " .filter-btn", function(){
		var top = $(".filter-block").offset().top +  $(".filter-block").offset().height + 2 - window.scrollY;
		$(".dialog-filter").css({top: top+ "px"});
		$(".filter-value-container").hide();
		$(".dialog-filter").toggle();
		if($(this).hasClass("filter-brand")){
			$(".filter-dialog .filter-brand").show();
		}
		else if($(this).hasClass("filter-money")){
			$(".filter-dialog .filter-money").show();

		}
		else if($(this).hasClass("filter-price")){
			$(".filter-dialog .filter-price").show();
		}
		else if($(this).hasClass("filter-level")){
			$(".filter-dialog .filter-level").show();
		}
	});

	$('.dialog-filter').bind("touchmove",function(e){  
		return;
         e.preventDefault();  
    }); 

    $("body").on("click", ".filter-value", function(){
    	$(this).closest(".filter-value-container").find(".filter-value").removeClass("filter-selected");
    	$(this).addClass("filter-selected");
    })



	$("body ").on("tap", " .filter-icon", function(){
			$(".myorder-status").toggleClass("hide");
	});

	$("body").on("click", function(event){
		var target = $(event.target);
		if(!target.closest(".filter-icon").length){
			$(".myorder-status").addClass("hide");
		}
	});

	$("body").on("click", ".save-filter-price", function(){
		$(this).closest(".dialog-block").hide();
	});

	$("body").on("click", " .bottom-icon", function(){
		$(this).find(".checkedIcon").toggleClass("uncheckedIcon");
		$(this).find(".uploadIcon").toggleClass("updownIcon");
	});
	

	$("body").on("tap", "  .filter-money",function(){
		$(this).find(".arrow-down-css ").toggleClass("arrow-up-css");
	});

	$("body").on("click", "#alphabet li", function(){
		$(this).closest("#alphabet").find("li span").removeClass("filter-selected");
		$(this).find("span").addClass("filter-selected");
	});


	 
})