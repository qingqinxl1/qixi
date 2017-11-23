//公共变量.
var $container = $('#content'),
    visualWidth = $container.width(),
    visualHeight = $container.height(),
    instanceX;

var container = new Swipe($container);

//获取线路坐标.
function getValue(classname) {
    var $ele = $('' + classname);

    return {
        top: $ele.offset().top,
        height: $ele.height()
    }
}

//获取路的Y轴值，即路中心距离页面顶部的距离.
function getRoadY() {
    var roadValue = getValue('.a_background_middle');
    return roadValue.top + roadValue.height / 2;
}

// 动画结束事件(浏览器兼容写法)
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();

/**
 * 走路动作.
 */
var BoyWalk = function () {

    //设置小男孩的位置.
    var $boy = $('#boy'),
        boyH = $boy.height();
    $boy.css('top', getRoadY() - boyH + 25 + 'px');

    /**
     * 动画处理.
     */
    //开始走路.
    function startMove() {
        $boy.addClass('slowWalk');
    }

    //暂停走路.
    function stopMove() {
        $boy.addClass('pauseWalk');
    }

    //恢复走路.
    function restoreMove() {
        $boy.removeClass('pauseWalk');
    }

    //计算移动距离.
    function calculateDist(deraction, propation) {
        return (deraction === 'x' ? visualWidth : visualHeight) * propation;
    }

    //走路动画.
    function startRun(options, runTime) {
        var dfd = $.Deferred();
        restoreMove(); //恢复脚动作.
        $boy.transition(options, runTime, 'linear', function () {
            dfd.resolve(); //动画完成.
        });
        return dfd;
    }

    //开始走路.
    function walkRun(time, distX, distY) {
        time = time || 5000;

        startMove(); //脚动作.

        var d1 = startRun({
            'left': distX,
            'top': distY ? distY : undefined
        }, time);

        return d1;
    }

    //走进商店.
    function walkToShop(runtime){
        runtime = runtime || 3000;
        var $door = $('.door'),
            doorLeft = $door.offset().left - $door.width()/ 2,
            boyLeft = $boy.offset().left - $boy.width()/ 2,
            dfd = $.Deferred();

        instanceX = doorLeft - boyLeft;

        var walkPlay = startRun({
            transform: 'translateX('+instanceX+'),scale(0.3, 0.3)',
            opacity: '0.1'
        }, runtime)

        walkPlay.done(function(){
            $boy.css('opacity', 0);
            dfd.resolve();
        });

        return dfd;
    }

    //走出商店.
    function walkOutShop(runtime){
        runtime = runtime || 3000;
        var dfd = $.Deferred();

        var walkPlay = startRun({
            transform: 'translateX('+instanceX+'),scale(1, 1)',
            opacity: '1'
        }, runtime)

        walkPlay.done(function(){
            dfd.resolve();
        });

        return dfd;
    }

    //取花动作
    function takeFlower(){
        var dfd = $.Deferred();

        setTimeout(function(){
            $boy.addClass('slowFlolerWalk');
            dfd.resolve();
        }, 2000);

        return dfd;
    }

    return {
        walkTo: function (time, propationX, propationY) {
            //方法调用.
            var distX = calculateDist('x', propationX)
            var distY = calculateDist('y', propationY)
            return walkRun(time, distX, distY);
        },

        stopWalk: function () {
            stopMove();
        },

        setColor: function (color) {
            $boy.css('backgroundColor', color);
        },

        //滑动到第几屏.
        scrollTo: function (time, propation) {
            container.scrollTo(visualWidth * propation, time);
        },

        //走进商店.
        toShop: function(runTime){
            return walkToShop(runTime);
        },

        //走出商店.
        outShop: function(runTime){
            return walkOutShop(runTime);
        },

        //取花.
        takeFlower: function(){
            return takeFlower();
        },

        //获取男孩子身宽.
        getWidth: function(){
            return $boy.width();
        },

        //男孩子拿花粘在女孩儿面前.
        setOrignalBoy: function(){
            $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
        },

        //男孩儿转身动作
        rotate: function(callback){
            restoreMove();

            $boy.addClass('boy-rotate');
            if(callback){
                $boy.on(animationEnd, function(){
                    callback();
                    $(this).off();
                });
            }
        }
    }
}

//商店门的动作.
function doorAction(left, right, time){
    var $door = $('.door'),
        $leftD = $door.find('.door-left'),
        $rightD = $door.find('.door-right'),
        $dfd = $.Deferred(),
        count = 2;
    var complete = function(){
        if(count === 1){
            $dfd.resolve();
            return;
        }
        count --;
    }

    $leftD.transition({left: left}, time, 'linear', complete);
    $rightD.transition({left: right}, time, 'linear', complete);
    return $dfd;
}

//开门.
function openDoor(){
    doorAction('-50%', '100%', 2000);
}

//关门.
function closeDoor(){
    doorAction('0%', '50%', 2000);
}

//灯光效果.
var lamp = {
    $ele: $('.b_background'),
    bright: function(){
        this.$ele.addClass('lamp-bright');
    },
    dark: function(){
        this.$ele.removeClass('lamp-bright');
    }
};

//飞鸟效果
var bird = {
    elem: $(".bird"),
    fly: function() {
        this.elem.addClass('birdFly')
        this.elem.transition({
            right: $('#content').width()
        }, 15000, 'linear');
    }
};

//获取桥的Y轴
var bridgeY = getValue('.bg_c_middle').top;

var girl = {
    $ele: $('#girl'),
    getOffset: function(){
        return this.$ele.offset();
    },
    getWidth: function(){
        return this.$ele.width();
    },
    getHeight: function(){
        return this.$ele.height();
    },
    setOffset: function(){
        var T = this;
        this.$ele.css('top', bridgeY - T.getHeight()  + 'px');
    },
    //转身动作
    rotate: function(){
        this.$ele.addClass('girl-rotate');
    }
};

//小女孩位置矫正.
girl.setOffset();

//慕课网logo效果.
var logo = {
    $ele: $('#logo'),
    run: function(){
        this.$ele.addClass('logolightSpeedIn').on(animationEnd, function(){
            $(this).addClass('logoshake').off();
        })
    }
};

//飘雪花
var snowflakeURl = [
    'image/flower1.png',
    'image/flower2.png',
    'image/flower3.png',
    'image/flower4.png',
    'image/flower5.png',
    'image/flower6.png'
];

function snowflake() {
    // 雪花容器
    var $flakeContainer = $('#snowflake');

    // 随机六张图
    function getImagesName() {
        return snowflakeURl[[Math.floor(Math.random() * 6)]];
    }
    // 创建一个雪花元素
    function createSnowBox() {
        var url = getImagesName();
        return $('<div class="snowbox" />').css({
            'width': 41,
            'height': 41,
            'position': 'absolute',
            'backgroundSize': 'cover',
            'zIndex': 100000,
            'top': '-41px',
            'backgroundImage': 'url(' + url + ')'
        }).addClass('snowRoll');
    }
    // 开始飘花
    setInterval(function() {
        // 运动的轨迹
        var startPositionLeft = Math.random() * visualWidth - 100,
            startOpacity    = 1,
            endPositionTop  = visualHeight - 40,
            endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
            duration        = visualHeight * 10 + Math.random() * 5000;

        // 随机透明度，不小于0.5
        var randomStart = Math.random();
        randomStart = randomStart < 0.5 ? startOpacity : randomStart;

        // 创建一个雪花
        var $flake = createSnowBox();

        // 设计起点位置
        $flake.css({
            left: startPositionLeft,
            opacity : randomStart
        });

        // 加入到容器
        $flakeContainer.append($flake);

        // 开始执行动画
        $flake.transition({
            top: endPositionTop,
            left: endPositionLeft,
            opacity: 0.7
        }, duration, 'ease-out', function() {
            $(this).remove() //结束后删除
        });

    }, 200);
}

var html5Audio = function(playURL, loop){
    var audio = new Audio(playURL);
    audio.autoplay = true;
    audio.loop = loop || false;
    audio.play();
    return {
        end: function(callback){
            audio.addEventListener('ended', function(){
                callback();
            }, false);
        }
    };
}