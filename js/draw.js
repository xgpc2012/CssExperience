/**
 * Created by pc on 2017/8/22.
 */
function draw(percent, sR) {
    if (percent < 0 || percent > 100) {
        return;
    }
    if (sR < Math.PI / 2 || sR >= 3 / 2 * Math.PI) {
        return;
    }
    var canvas = document.querySelector('#canvas'),
        cxt = canvas.getContext('2d'),
        cWidth = canvas.width,
        cHeight = canvas.height,
        baseColor = '#e1e1e1',
        coverColor = '#8DFFF0',
        circleColor = "#FFFFFF";
    PI = Math.PI,
        sR = sR || 3 / 4 * PI; // 默认圆弧的起始点弧度为π/2
    var finalRadian = sR + ((PI + (PI - sR) * 2) * percent / 100); // 红圈的终点弧度
    var step = (PI + (PI - sR) * 2) / 100; // 一个1%对应的弧度大小
    var text = 0; // 显示的数字
    var timer = setInterval(function () {
        cxt.clearRect(0, 0, cWidth, cHeight);
        var endRadian = sR + text * step;
        // 画灰色圆弧
        //drawCanvas(cWidth / 2, cHeight / 2, 80, sR, sR + (PI + (PI - sR) * 2), baseColor, 2);
        // 画圆弧
        drawCanvas(cWidth / 2, cHeight / 2, 75, sR, endRadian, circleColor, 10);

        // 画红色圆头
        // 红色圆头其实就是一个圆，关键的是找到其圆心，涉及到三角函数知识，自己画个图一看就明了
        var angle = 2 * PI - endRadian; // 转换成逆时针方向的弧度（三角函数中的）
        xPos = Math.cos(angle) * 90 + cWidth / 2; // 红色圆 圆心的x坐标
        yPos = -Math.sin(angle) * 90 + cHeight / 2; // 红色圆 圆心的y坐标
        drawCanvas(xPos, yPos, 4, 0, 2 * PI, coverColor, 2);

        // 数字
        cxt.fillStyle = coverColor;
        cxt.font = '40px PT Sans';
        var textWidth = cxt.measureText(text + '%').width;
        //cxt.fillText(text+'%', cWidth/2 - textWidth/2, cHeight/2 + 15);
        text++;

        if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
            clearInterval(timer);
        }
    }, 30);

    function drawCanvas(x, y, r, sRadian, eRadian, color, lineWidth) {
        cxt.beginPath();
        cxt.lineCap = "round";
        cxt.strokeStyle = color;
        cxt.lineWidth = lineWidth;
        cxt.arc(x, y, r, sRadian, eRadian, false);
        cxt.stroke();
    }
}
// var canvas=document.getElementById("canvas");
// //获取屏幕的宽度
// var  clientWidth = document.documentElement.clientWidth;
// //根据设计图中的canvas画布的占比进行设置
// var canvasWidth = Math.floor(clientWidth*200/720);
// canvas.setAttribute('width',canvasWidth+'px');
// canvas.setAttribute('height',canvasWidth+'px');
// //translate方法也可以直接传入像素点坐标