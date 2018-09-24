/**
 * Created by Ouyang on 2016/3/29.
 * @description 转盘抽奖逻辑类
 */


/**
 * 转盘核心逻辑
 * */
  



function playOrpause(e){
    if(video.paused){
        video.play();
        event.target.innerHTML=';'
        event.target.style.color='red'
    }
    else{
        video.pause();
        event.target.innerHTML='4'
        event.target.style.color='green'
    }
}






var core = {

    /**List*/
    gifts: ["萌乐搞怪公仔*1","熊抱抱男班助","正步走回原位","抱临近同性至下个惩罚","熊抱抱女班助","萌乐搞怪公仔*1","唯他奶柠檬茶*1","谢谢体验！","唯C*1","做10个俯卧撑","抱某个女性10秒钟","与上个被罚者共舞5秒"],
    /**随机颜色*/
    colors: [],
    /***/
    step: 2*Math.PI/12,    //增加减少增加减少
    /**外盘大小*/
    outerR: 298,
    /**内盘大小*/
    interR: 120,
    /**抽奖标识*/
    LOTTERY_TAG: null,

    init: function () {
        for(var i = 0; i < core.gifts.length; i++){
            core.colors.push(this.getColor());
        }
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var deviceType = this.getDeviceType();
        context.translate(400, 300);
        this.drawTurnTable(context);
        this.drawArrow(context);
        this.initEvent(deviceType);
    },

    /**注册触碰事件*/
    initEvent: function (type) {
        var btn = document.getElementById("btn_lottery");
        btn.addEventListener(type == DEVICE_CONFIG.CHROME ? "mousedown" : "touchstart", function(event){
            core.lottery();
        });
    },

    /**抽奖*/
    lottery: function () {
        var context = document.getElementById("canvas").getContext("2d");
        if(core.LOTTERY_TAG){
            return false;
        }
        /**总步数*/
        var step = TURNTABLE_CONFIG.BEGIN_ANGLE + Math.random() * 250;
        /*角度*/
        var angle = 50;
        core.LOTTERY_TAG = setInterval(function () {
            //核心关键点在这行代码，转盘之所以有一个线性渐变的过程
            //因为step的值一直在变化，这个变化是一个线性的，有规律的，直到不满足条件，跳出循环
            //以前以为乘法后的值是递增的，现在发现to yang to simple，下面这个就是乘以小数会递减
            step *= TURNTABLE_CONFIG.RADIO;
            //console.log("总步骤: " + step);
            if(step <= 0.1){
                clearInterval(core.LOTTERY_TAG);
                core.LOTTERY_TAG = null;
                var pos = Math.ceil(angle / 30);  // 增加减少增加减少
                console.log("pos: " + pos);
                var res = core.gifts[12 - pos];    //增加减少增加减少
                context.save();
                context.beginPath();
                context.font = "23px 微软雅黑";
                context.fillStyle = "#f00";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(res, 0, 0);
                context.restore();
            }else{
                context.clearRect(-250, -250, 500, 500);
                angle += step;
                //一开始每个角度的值相差比较大，到了后面每个角度的值相差越来越小(开始慢慢减速)
                console.log("角度: " + angle);
                if(angle > 360){
                    angle -= 360;
                }
                context.save();
                context.beginPath();
                context.rotate(angle * Math.PI / 180);
                core.drawTurnTable(context);
                context.restore();
                core.drawArrow(context);

            }
        }, 60);
    },

    /**绘制转盘（外盘和内盘）*/
    drawTurnTable: function (context) {
        var size = core.gifts.length;        
        var colors = core.colors;
        for(var i = 0; i < size; i++){
            context.save();
            context.beginPath();
            context.moveTo(0, 0);
            context.fillStyle = colors[i];
            context.arc(0, 0, core.outerR, i * core.step, (i+1) * core.step);
            context.fill();
            context.restore();
        }
        context.save();
        context.beginPath();
        context.fillStyle = "#fff";
        context.arc(0,0, core.interR, 0, 2*Math.PI);
        context.fill();
        context.restore();
        for(var i = 0; i < size; i++){
            context.save();
            context.beginPath();
            context.fillStyle = "#000";
            context.font = "15px 微软雅黑";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.rotate(i * core.step + core.step / 2);
            context.fillText(core.gifts[i], (core.outerR + core.interR)/2, 0);
            context.restore();
        }
    },

    /**绘制箭头*/
    drawArrow: function (context) {
        context.save();
        context.beginPath();
        context.lineWidth = 5;
        context.moveTo(250, 0);
        context.lineTo(280, 15);
        context.lineTo(280, 5);
        context.lineTo(400, 5);
        context.lineTo(400, -5);
        context.lineTo(280, -5);
        context.lineTo(280, -15);
        context.closePath();
        context.fill();
        context.restore();
    },

    /**
     * 获得当前设备类型
     * */
    getDeviceType: function () {
        var userAgent =  navigator.userAgent.toLocaleLowerCase();
        if(userAgent.match(/MicroMessager/i) == "micrcomeeager"){
            return DEVICE_CONFIG.WEIXING;
        }else if(userAgent.match(/chrome\/([\d.]+)/) != null){
            return DEVICE_CONFIG.CHROME;
        }else if(userAgent.match(/applewebkit\/([\d.]+)/) != null){
            return DEVICE_CONFIG.IOS;
        }
        return DEVICE_CONFIG.CHROME;
    },

    /**获得随机颜色*/
    getColor: function () {
        var random = function () {
            return Math.floor(Math.random() * 255);
        };
        return "rgb(" + random() + "," + random() + "," + random() + ")";
    },

    /**测试*/
    testProgram: function () {

    }
};

/**
 * 奖品对象
 * */
function Gift(id, name){
    this.id = id;
    this.name = name;
}

Gift.prototype.getId = function () {
    return this.id;
};

Gift.prototype.getName = function () {
    return this.name;
};

Gift.prototype.toString = function () {
    return "Gift: " + "id=" + this.index
                + ", name=" + this.name;
};


/**
 * 转盘配置
 * */
var TURNTABLE_CONFIG = {
    /*旋转起来时默认开始旋转的度数，度数愈大旋转的初始速度愈大*/
    BEGIN_ANGLE: 50,
    /*旋转速度衰减系数，影响旋转时间*/
    RADIO: 0.95
};

/**
 * 设备类型配置表
 * */
var DEVICE_CONFIG = {
    WEIXING : "weixing",
    CHROME : "chrome",
    PC: "PC",
    ANDROID: "android",
    IOS: "iphone",
    WP: "",
    MOBILE: ""
};


//var GIFTS = {
//    ONE_REWARD : "一等奖",
//    TWO_REWARD : "二等奖",
//    THREE_REWARD : "三等奖",
//    FOUR_REWARD : "四等奖",
//    FIVE_REWARD : "五等奖",
//    SIX_REWARD : "六等奖",
//    SEVEN_REWARD : "七等奖",
//    EIGHT_REWARD : "八等奖",
//    NINE_REWARD : "九等奖",
//    TEN_REWARD : "十等奖"
//};