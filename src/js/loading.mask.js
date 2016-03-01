/**
 * Created by chloe on 2015/12/01.
 */
var $mask = (function(){
    var loadingHandel = null;
    return {
        start : function(){
            this.createMaskContent();
            this.loadingAnimate();
        },
        end : function(callback){
            this.destroyMaskContent(callback);
        },
        createMaskContent : function(){
            //主面板遮罩层容器
            var mainMaskContent = '<div class="loading-screen-mask"></div>';
            $(document.body).append(mainMaskContent);
            //显示容器
            var showMaskContent =
                "<div class='loading-screen'>" +
                "<img src='../../images/loading_wait.png' class='vip-image' />" +
                "<canvas class='vip-cvs' width='120' height='120'></canvas>" +
                "</div>";
            $(document.body).append(showMaskContent);
        },
        destroyMaskContent : function(callback){
            clearInterval(loadingHandel);
            var loadingScreen = $(".loading-screen").remove();
            loadingScreen = null;
            var loadingScreenMask = $(".loading-screen-mask").remove();
            loadingScreenMask = null;
            if(callback !== undefined && callback !== null){
                callback();
            }
        },
        loadingAnimate: function () {
            var step = 0;
            var bg = $('.vip-cvs')[0];
            var ctx = bg.getContext('2d');
            var imd = null;
            var circ = Math.PI * 2;
            var quart = Math.PI / 2;
            var lineColor = '#A1A1A1';
            var backforward = false;
            ctx.clearRect(0, 0, 120, 120);
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineCap = 'square';
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2.8;
            imd = ctx.getImageData(0, 0, 120, 120);
            var draw = function (current) {
                ctx.putImageData(imd, 0, 0);
                ctx.beginPath();
                ctx.arc(60, 60, 49, -(quart), ((circ) * current) - quart, backforward);
                ctx.stroke();
            };
            function stepDraw() {
                step += 0.01;
                draw(step);
                if (step >= 0.99) {
                    step = 0;
                    if (!backforward) {
                        backforward = true;
                    } else {
                        backforward = false;
                    }
                }
            }
            loadingHandel = setInterval(stepDraw, 10);
        }
    };
})();