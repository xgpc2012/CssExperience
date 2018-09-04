/**
 * Created by pc on 2017/5/8.
 */
var $qlist = $("#q-list"),
    $progress = $("#progress"),
    $slice = $("#slice"),
    $elist = $("#exam-list"),
    estatus = "",
//pageSize代表每页考试数量
    pageSize = 10,
//cnum代表正确题目个数
    cnum = 0,
//tnum代表当前题目索引
    tnum = 0,
    eid = "",
    ccid = "",
    dialog = null,
    userInfo = null,
    pagestart = 0;
var aArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    mArr = [],
    testData = {
        "questionInfos": [{
            "questionType": "1",
            "questionContent": "hhh",
            "options": ["A.1", "B.2", "C.3", "D.4"],
            "questionAnswer": "B"
        }, {
            "questionType": "1",
            "questionContent": "hhh",
            "options": ["A.1", "B.2", "C.3", "D.4"],
            "questionAnswer": "B"
        }, {
            "questionType": "1",
            "questionContent": "hhh",
            "options": ["A.1", "B.2", "C.3", "D.4"],
            "questionAnswer": "B"
        }]
    };

/*
 动画结束时删除特效样式
 */
$qlist.on("webkitAnimationEnd", ".questionBox", function () {
    $(".middle").removeClass("bottom bottomQ").addClass("middleQ").css("opacity", 0.8);
    $(".top").eq(tnum - 1).addClass("hide");
    $(".top").eq(tnum).removeClass("middle middleQ").addClass("topQ").css("opacity", 1);
    $(".questionBox").removeClass("animation1 animation2 animation3");
})

/*
 题目切换效果
 */
function switchQuestion() {
    //初始化答案数组
    tnum++;
    var len = $(".questionBox").length;
    if (cnum >= 8) {
        $(".leaf").removeClass("leaf1").addClass("leaf2");
        //答对八道题代表通过
        if (estatus == "1") {
            $(".questionBox").eq(tnum - 1)
                .find(".optionLine").removeClass("optionLine");
            //UmsApi.notification.tip("您已通过该项考试,不可重复获取银杏豆");
            return;
        }
        getUserInfo(function (data) {
            submitExamResult("1", data);
        })
        return;
    }
    if (tnum < len) {
        mArr.length = 0;
        $(".top").last().addClass("animation1");
        $(".middle").addClass("animation2 top");
        $(".bottom").first().addClass("animation3 middle");
        $(".nextQ").eq(tnum - 1).animate({opacity: 0.6}, 1000);
    } else {
        //UmsApi.notification.tip("考试未通过,再接再厉哟~");
        // getUserInfo(function (data) {
        //     submitExamResult("0", data);
        // })
    }
}

function showExamList(data) {
    var html = template("eitem", data);
    $elist.append(html);
    //dialog.close();
    if (pagestart > 0) {
        pullUpEl = document.getElementById('pullUp');
        pullUpEl.style.display = "none";
    }
    myScroll.refresh();
}

function showQuestionList(data) {
    var html = template("qitem", data);
    $("#q-list").html(html);
    //dialog.close();
}

//加载更多
function initMore() {
    //当前页数++
    pagestart++;
    getExamList(pagestart);
};

/*
 *查询考试列表
 *服务名称qryExamInfoListForApp
 */
function getExamList(page) {
    $("#noresult").addClass("hide");
    pagestart = page;
    if (page == 0) {
        last = '';
        $elist.html("");
    }
    var params = {
        "service": "qryExamInfoListForApp",
        "appRequestDate": (new Date()).format("yyyyMMddhhmmss"),
        // "userId": Tool.Get("user_id"),
        "page": page,
        "pageSize": pageSize
    }
    UmsApi.base.call(uri, params, function (data) {
        try {
            if (data == null || data == undefined) {
                UmsApi.notification.error("Data Error!");
            }
            data = data["response"];
            data = JSON.parse(data);
            if (data.responseCode == '000000') {
                //UmsApi.notification.tip(JSON.stringify(data.content));
                //渲染考试列表
                if (data.content.length == 0) {
                    if (page != 0) {
                        pullUpEl = document.getElementById('pullUp');
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '暂无更多数据...';
                        setTimeout(function () {
                            pullUpEl.style.display = "none";
                        }, 600)
                    } else {
                        $("#noresult").removeClass("hide");
                    }
                } else {
                    showExamList(data);
                }
            } else {
                dialog.close();
                UmsApi.notification.tip(data.responseDesc);
            }
        } catch (e) {
            //TODO handle the exception
        }
    }, function (data) {
        dialog.close();
        UmsApi.notification.tip(data.errInfo);
    })
}

/*
 *查询试题列表及其答案
 *服务名称qryQuestionInfoListForApp
 */
function getQuestionList(eid) {
    var params = {
        "service": "qryQuestionInfoListForApp",
        "appRequestDate": (new Date()).format("yyyyMMddhhmmss"),
        //考试Id
        "examId": String(eid)
    };
    UmsApi.base.call(uri, params, function (data) {
        try {
            if (data == null || data == undefined) {
                UmsApi.notification.error("Data Error!");
            }
            data = data["response"];
            data = JSON.parse(data);
            //UmsApi.notification.tip(JSON.stringify(data));
            if (data.responseCode == '000000') {
                //dialog.close();
                //请求返回结果resultList是一个数组，数组元素是json，json详情：
                //UmsApi.notification.tip(JSON.stringify(data.questionInfos));
                showQuestionList(data);
            } else {
                dialog.close();
                UmsApi.notification.tip(data.responseDesc);
            }
        } catch (e) {
            //TODO handle the exception
        }
    }, function (data) {
        dialog.close();
        UmsApi.notification.tip(data.errInfo);
    })
}

/*
 *提交考试结果
 *服务名称proSubmitExamInfoForApp
 */
function submitExamResult(examStatus, userInfo) {
    dialog = new TipBox({
        type: 'load',
        //str: "恭喜您已通过考试!一点小礼,不成敬意",
        str: "努力加载中...",
        setTime: 10000,
        hasMask: true
    });
    var params = {
        "service": "proSubmitExamInfoForApp",
        "appRequestDate": (new Date()).format("yyyyMMddhhmmss"),
        //考试Id
        "examId": String(eid),
        "examStatus": examStatus,
        "creditsConfigId": String(ccid),
        "roleId": userInfo["userAppType"],
        "mchntId": userInfo["merchantId"],
        "mobilePhone": userInfo["userMobile"]
    };
    UmsApi.base.call(uri, params, function (data) {
        try {
            if (data == null || data == undefined) {
                UmsApi.notification.error("Data Error!");
            }
            data = data["response"];
            data = JSON.parse(data);
            //UmsApi.notification.tip(JSON.stringify(data));
            if (data.responseCode == '000000') {
                dialog.close();
                //UmsApi.notification.tip("您已成功提交考试结果!");
                //UmsApi.notification.tip(JSON.stringify(data));
                if (examStatus == "1") {
                    var json = {
                        "eid": eid,
                        "ccid": ccid
                    }
                    UmsApi.page.forwardBizPageByRelativeUrl('examResult.html', json);
                } else {
                    UmsApi.notification.tip("考试未通过,再接再厉哟~");
                }
            } else {
                dialog.close();
                UmsApi.notification.tip(data.responseDesc);
            }
        } catch (e) {
            //TODO handle the exception
        }
    }, function (data) {
        dialog.close();
        UmsApi.notification.tip(data.errInfo);
    })
}

//数组去重
function unique(arr) {
    var hash = {}, result = [];
    for (var i = 0; i < arr.length; i++) {
        if (!hash[arr[i]]) {
            hash[arr[i]] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

//数组去除指定项
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}

// 获取用户信息是否已注册
var isRegistered = false;

function getUserInfo(callback) {
    if (!isRegistered) {
        var type = 3025;
        var action = "set";
        var reflectClazz = "getUserInfo";
        var isSuccess = UmsApi.base.registerApi(type, action, reflectClazz, "getInfoCallback");
        if (isSuccess) {
            isRegistered = true;
        }
    }
    if (isRegistered) {
        var param = {};
        UmsApi.custom["getInfoCallback"](param, function (data) {
            //缓存数据
            userInfo = data["bizData"];
            callback(data["bizData"]);
        });
    }
}

var isBackRegister = false;

function backToRootVC() {
    if (!isBackRegister) {
        var type = 3026;
        var action = "";
        var reflectClazz = "backToRootVC";
        var isSuccess = UmsApi.base.registerApi(type, action, reflectClazz, "backCallback");
        if (isSuccess) {
            isBackRegister = true;
        }
    }
    if (isBackRegister) {
        var param = {};
        UmsApi.custom["backCallback"](param, function (data) {
        });
    }
}

function getCorrectIndex(mArr, correctAnswer) {
    if (mArr == "") {
        return aArr.indexOf(correctAnswer);
    } else {
        var cArr = correctAnswer.split("|"),
            cIndexArr = [];
        for (var i = 0; i < cArr.length; i++) {
            cIndexArr.push(aArr.indexOf(cArr[i]));
        }
        return cIndexArr;
    }
}