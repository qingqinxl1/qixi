/**
 * 滑动.
 * @param container
 * @returns {{}}
 * @constructor
 */
function Swipe(container) {
    // 获取第一个子节点
    var element = container.find(":first");
    // li页面数量
    var slides = element.find("li");
    // 获取容器尺寸
    var width = container.width();
    var height = container.height();

    //创建滑动对象.
    var swipe = {};

    // 设置li页面总宽度
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });
    // 设置每一个页面li的宽度
    $.each(slides, function (index) {
        var slide = slides.eq(index); //获取到每一个li元素
        slide.css({'width': width + 'px', 'height': height + 'px'});
    });

    //点击切换页面.
    swipe.scrollTo = function (x, speed) {
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed + 'ms',
            'transform': 'translate3d(-' + x + 'px,0px,0px)' //设置页面X轴移动
        });
        return this;
    }

    return swipe;
}

