/**
 * Created by pc on 2017/8/22.
 */
var canvas = document.querySelector('#canvas'),
    cxt = canvas.getContext('2d'),
    cWidth = canvas.width,
    cHeight = canvas.height,
    baseColor = '#e1e1e1',
    coverColor = '#8DFFF0',
    process = 0.0,
    PI = Math.PI,
    circleColor = "#FFFFFF";

function draw(percent, sR) {
    if (percent < 0 || percent > 100) {
        return;
    }
    if (sR < Math.PI / 2 || sR >= 3 / 2 * Math.PI) {
        return;
    }
    sR = sR || 3 / 4 * PI;
    var finalRadian = sR + ((PI + (PI - sR) * 2) * percent / 100); // 红圈的终点弧度
    var step = (PI + (PI - sR) * 2) / 100; // 一个1%对应的弧度大小
    var text = 0; // 显示的数字
    var timer = setInterval(function () {
        cxt.clearRect(0, 0, cWidth, cHeight);
        var endRadian = sR + text * step;
        // 画灰色圆弧
        //drawCanvas(cWidth / 2, cHeight / 2, 80, sR, sR + (PI + (PI - sR) * 2), baseColor, 2);
        // 画圆弧
        //sector(cWidth / 2, cHeight / 2, 75, sR, endRadian, circleColor, 10);
        loading(percent, sR, endRadian);

        var angle = 1.975 * PI - endRadian;
        xPos = Math.cos(angle) * 89 + cWidth / 2;
        yPos = -Math.sin(angle) * 89 + cHeight / 2;
        drawCanvas(xPos, yPos, 0.5, 0, 2 * PI, coverColor, 5);

        $("#credit").text(Math.floor(text * 9.9));
        //cxt.fillText(text+'%', cWidth/2 - textWidth/2, cHeight/2 + 15);
        text++;

        if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
            $("#credit").text(percent * 10);
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

// 画弧线
function sector(cx, cy, r, startAngle, endAngle, anti, lineWidth, percent) {
    cxt.beginPath();
    cxt.lineWidth = lineWidth;
    // 渐变色 - 可自定义
    // var linGrad = cxt.createLinearGradient(
    //     cx, cy - r - lineWidth, cx, cy + r + lineWidth
    // );
    var r1 = r * Math.sin(PI / 4);
    var xd = 0,
        yd = 0;
    if (percent < 50) {
        xd = r * Math.sin(3 * PI * percent / 200 + PI / 4);
        yd = r * Math.sin(3 * PI * percent / 200 - PI / 4);
    } else {
        xd = -r * Math.sin(3 * PI * percent / 200 - PI * 3 / 4);
        yd = r * Math.cos(3 * PI * percent / 200 - PI * 3 / 4);
    }
    var linGrad = cxt.createLinearGradient(
        cx - r1, cy + r1 - lineWidth, cx - xd, cy - yd
    );
    linGrad.addColorStop(1.0, '#FFFFFF');
    linGrad.addColorStop(0.1, '#A3D5FB');
    linGrad.addColorStop(0.0, '#8FCFFB');
    cxt.strokeStyle = linGrad;
    // 圆弧两端的样式
    cxt.lineCap = 'round';
    // 圆弧
    cxt.arc(
        cx, cy, r,
        startAngle,
        endAngle,
        anti
    );
    cxt.stroke();
}

function loading(percent, sRadian, eRadian) {
    // 清除canvas内容
    cxt.clearRect(0, 0, cWidth * 2, cHeight * 2);
    // 圆弧
    sector(cWidth / 2, cHeight / 2, 75, sRadian, eRadian, "", 10, percent);
    // 控制结束时动画的速度
    if (process / percent > 0.90) {
        process += 0.30;
    } else if (process / percent > 0.80) {
        process += 0.55;
    } else if (process / percent > 0.70) {
        process += 0.75;
    } else {
        process += 1.0;
    }
}