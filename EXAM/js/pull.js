/**
 * Created by pc on 2017/5/24.
 */
var data,
    myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;
data0 = {"msgTypeId": "02", "msgInfoList": [{}, {},{}, {},{}]};

// function pullDownAction () {
//     myScroll.refresh();
//     console.log("下拉刷新");
//     setTimeout(function () {
//         //getExamList("0");
//         //myScroll.refresh();
//     }, 0);
// }

function pullUpAction () {
    console.log("上拉加载");
    setTimeout(function () {
        initMore();
    }, 600);
}

//初始化绑定iScroll控件 
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
document.addEventListener('DOMContentLoaded', loaded, false);

function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    /**
     * 初始化iScroll控件
     */
    myScroll = new iScroll('wrapper', {
        vScrollbar: false,
        topOffset: pullDownOffset,
        bounce: true,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                //pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                $("#pullUp").hide();
            }
        },
        onScrollMove: function () {
            if (this.y > 0 && !pullDownEl.className.match('flip')) {
                //pullDownEl.className = 'flip';
                //pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < -55 && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.style.display="block";
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                //pullDownEl.className = 'loading';
                //pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();
            }
        }
    });
}