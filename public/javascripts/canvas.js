'use strict';

var container = document.getElementById('container');
var resBtn = document.getElementById('restart-button');
var canvas = document.getElementById('canvas');

var canvasSize = container.offsetWidth;  //画布大小

//设置画布大小
canvas.width = canvasSize;
canvas.height = canvasSize;

var context = canvas.getContext('2d');

var BLOCKSIZE = 4;  //格子数量

var data;  //棋盘格数组

/**
 * 页面加载完毕
 */
window.onload = function () {
    dataInit();

    drawInterface(context);
    drawData(context);

    console.log();
};

resBtn.onclick = function () {
    dataInit();

    drawInterface(context);
    drawData(context);
};

/**
 * 添加键盘监听
 */
window.addEventListener('keydown', function (e) {
    var keyCode = e.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        e.preventDefault();
        canvas.focus();
        var move;
        switch (e.keyCode) {
            case 38:  //上键
                move = upSilde(data);
                break;
            case 40:  //下键
                move = downSilde(data);
                break;
            case 37:  //左键
                move = leftSilde(data);
                break;
            case 39:  //右键
                move = rightSilde(data);
                break;
        }

        if (move) {
            if (gameWin(data)) {
                alert('游戏胜利');
                return;
            }

            addNumber(data, 1);

            context.clearRect(0, 0, canvasSize, canvasSize);
            drawInterface(context);
            drawData(context);

            if (gameOver(data)) {
                alert('游戏失败');
                return;
            }
        }
    }
});

//滑动起始点坐标
var startPos = {};

//滑动终点坐标
var endPos = {};

/**
 * 手指触碰屏幕
 */
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();

    startPos.x = e.targetTouches[0].pageX;  //触摸点x坐标
    startPos.y = e.targetTouches[0].pageY;  //触摸点y坐标
});

/**
 * 手指在屏幕上滑动
 */
canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();

});

/**
 * 手指离开屏幕
 */
canvas.addEventListener('touchend', function (e) {
    e.preventDefault();

    endPos.x = e.changedTouches[0].pageX;  //离开屏幕时x坐标
    endPos.y = e.changedTouches[0].pageY;  //离开屏幕时y坐标

    sildeDirection(sildeAngle());
});

/**
 * 滑动角度
 */
function sildeAngle() {
    var a = endPos.y - startPos.y;  //对边
    var b = endPos.x - startPos.x;  //领边
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));  //斜边（滑动距离）

    //如果滑动距离小于10
    if (c < 10) {
        return 0;
    }

    var radian = Math.acos(b / c);  //弧度
    var angle = 180 / Math.PI * radian;  //角度

    if (a > 0) {
        return angle;
    } else {
        return 360 - angle;
    }
}

/**
 * 滑动方向
 * @param {*} angle 
 */
function sildeDirection(angle) {
    var move;
    if (angle == 0) {  //滑动距离小于10
        return;
    } else if (angle >= 225 && angle < 315) {  //上滑

        move = upSilde(data);
    } else if (angle >= 45 && angle < 135) {  //下滑

        move = downSilde(data);
    } else if (angle >= 135 && angle < 225) {  //左滑

        move = leftSilde(data);
    } else {  //右滑

        move = rightSilde(data);
    }

    if (move) {
        if (gameWin(data)) {
            alert('游戏胜利');
            return;
        }

        addNumber(data, 1);

        context.clearRect(0, 0, canvasSize, canvasSize);
        drawInterface(context);
        drawData(context);

        if (gameOver(data)) {
            alert('游戏失败');
            return;
        }
    }
}

/**
 * 随机出现2或4
 */
function newRandom() {
    var random = Math.floor(Math.random() * 10);
    if (random < 9) {
        return 2;
    }
    return 4;
};

/**
 * 随机数出现位置
 * @param {*} data 
 */
function newPosition(data) {
    var pos = [];  //存储空格所在位置
    //遍历棋盘数组，若为空则存储位置
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            if (data[i][j] == 0) {
                pos.push(i * BLOCKSIZE + j + 1);
            }
        }
    }
    //在空格中随机选取一个位置
    var random = Math.floor(Math.random() * pos.length);
    var p = pos[random];
    var getCol = function () {
        var col = p % BLOCKSIZE;
        if (col == 0) {
            return (BLOCKSIZE - 1);
        }
        return (col - 1);
    }
    return {
        row: (Math.ceil(p / BLOCKSIZE) - 1),
        col: getCol()
    };
}

/**
 * 将随机数添加到棋盘中
 * @param {棋盘数组} data 
 * @param {执行次数} time 
 */
function addNumber(data, time) {
    for (var i = 0; i < time; i++) {
        var pos = newPosition(data);
        data[pos.row][pos.col] = newRandom();
    }
}

/**
 * 游戏胜利
 * @param {*} data 
 */
function gameWin(data) {
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            if (data[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 游戏失败
 * @param {*} data 
 */
function gameOver(data) {
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            if(data[i][j] === 0) {
                return false;
            }
        }
    }

    var rect = [];
    for (var i = 0; i < BLOCKSIZE; i++) {
        var temp = [];
        for (var j = 0; j < BLOCKSIZE; j++) {
            temp.push(data[j][i]);
        }
        rect.push(temp);
    }

    var rowAndCol = function (arr) {
        for (var i = 0; i < BLOCKSIZE; i++) {
            for (var j = 0; j < BLOCKSIZE - 1; j++) {
                if (arr[i][j] === arr[i][j + 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    return (rowAndCol(data) && rowAndCol(rect));
}

function game() {

}

/**
 * 数据初始化
 */
function dataInit() {
    data = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
    addNumber(data, 2);
}

/**
 * 上滑
 * @param {*} data 
 */
function upSilde(data) {
    var move = false;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            var nextNum = -1;
            for (var n = j + 1; n < BLOCKSIZE; n++) {
                if (data[n][i] !== 0) {
                    nextNum = n;
                    break;
                }
            }
            if (nextNum !== -1) {
                if (data[j][i] === 0) {
                    data[j][i] = data[nextNum][i];
                    data[nextNum][i] = 0;
                    j--;
                    move = true;
                } else if (data[j][i] === data[nextNum][i]) {
                    data[j][i] = data[j][i] * 2;
                    data[nextNum][i] = 0;
                    move = true;
                }
            }
        }
    }
    return move;
}

/**
 * 下滑
 * @param {*} data 
 */
function downSilde(data) {
    var move = false;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = BLOCKSIZE - 1; j > -1; j--) {
            var nextNum = -1;
            for (var n = j - 1; n > -1; n--) {
                if (data[n][i] !== 0) {
                    nextNum = n;
                    break;
                }
            }
            if (nextNum !== -1) {
                if (data[j][i] === 0) {
                    data[j][i] = data[nextNum][i];
                    data[nextNum][i] = 0;
                    j++;
                    move = true;
                } else if (data[j][i] === data[nextNum][i]) {
                    data[j][i] = data[j][i] * 2;
                    data[nextNum][i] = 0;
                    move = true;
                }
            }
        }
    }
    return move;
}

/**
 * 左滑
 * @param {*} data 
 */
function leftSilde(data) {
    var move = false;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            var nextNum = -1;
            for (var n = j + 1; n < BLOCKSIZE; n++) {
                if (data[i][n] !== 0) {
                    nextNum = n;
                    break;
                }
            }
            if (nextNum !== -1) {
                if (data[i][j] === 0) {
                    data[i][j] = data[i][nextNum];
                    data[i][nextNum] = 0;
                    j--;
                    move = true;
                } else if (data[i][j] === data[i][nextNum]) {
                    data[i][j] = data[i][j] * 2;
                    data[i][nextNum] = 0;
                    move = true;
                }
            }
        }
    }
    return move;
}

/**
 * 右滑
 * @param {*} data 
 */
function rightSilde(data) {
    var move = false;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = BLOCKSIZE - 1; j > -1; j--) {
            var nextNum = -1;
            for (var n = j - 1; n > -1; n--) {
                if (data[i][n] !== 0) {
                    nextNum = n;
                    break;
                }
            }
            if (nextNum !== -1) {
                if (data[i][j] === 0) {
                    data[i][j] = data[i][nextNum];
                    data[i][nextNum] = 0;
                    j++;
                    move = true;
                } else if (data[i][j] === data[i][nextNum]) {
                    data[i][j] = data[i][j] * 2;
                    data[i][nextNum] = 0;
                    move = true;
                }
            }
        }
    }
    return move;
}








//todo
function test() {
    // context.fillRect(0, 0, canvasSize, canvasSize);
    // context.clearRect(0, 0, canvasSize, canvasSize);
}

function drawData(context) {
    var fillColor;
    var fontColor;
    var fontSize;
    var radius = 3;
    var space = 10;
    var size = (canvasSize - 5 * space) / 4;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            switch (data[i][j]) {
                case 2:
                    fillColor = '#eee4da';
                    fontColor = '#776e65';
                    fontSize = 35;
                    break;
                case 4:
                    fillColor = '#ede0c8';
                    fontColor = '#776e65';
                    fontSize = 35;
                    break;
                case 8:
                    fillColor = '#f2b179';
                    fontColor = '#f9f6f2';
                    fontSize = 35;
                    break;
                case 16:
                    fillColor = '#f59563';
                    fontColor = '#f9f6f2';
                    fontSize = 35;
                    break;
                case 32:
                    fillColor = '#f67c5f';
                    fontColor = '#f9f6f2';
                    fontSize = 35;
                    break;
                case 64:
                    fillColor = '#f65e3b';
                    fontColor = '#f9f6f2';
                    fontSize = 35;
                    break;
                case 128:
                    fillColor = '#edcf72';
                    fontColor = '#f9f6f2';
                    fontSize = 25;
                    break;
                case 256:
                    fillColor = '#edcc61';
                    fontColor = '#f9f6f2';
                    fontSize = 25;
                    break;
                case 512:
                    fillColor = '#ECC850';
                    fontColor = '#f9f6f2';
                    fontSize = 25;
                    break;
                case 1024:
                    fillColor = '#EFC53F';
                    fontColor = '#f9f6f2';
                    fontSize = 20;
                    break;
                case 2048:
                    fillColor = '#EDC53F';
                    fontColor = '#f9f6f2';
                    fontSize = 20;
                    break;
                default:
                    break;
            }
            if (data[i][j]) {
                var font = 'bold' + ' ' + fontSize + 'px' + ' ' + 'Arial';
                // context.save();
                // context.translate(5, 0);

                fillRoundRect(context, (j + 1) * space + j * size, (i + 1) * space + i * size, size, size, radius, fillColor);
                drawText(context, ((j + 1) * (space + size / 2)) + (j * size / 2), (i + 1) * (space + size / 2) + (i * size / 2), font, fontColor, data[i][j]);

                // context.restore();
            }
        }
    }
}

function drawText(context, x, y, font, fontColor, text) {
    context.fillStyle = fontColor;
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, x, y);
}

function drawInterface(context) {
    fillRoundRect(context, 0, 0, canvasSize, canvasSize, 6, '#bbada0');
    var radius = 3;
    var space = 10;
    var size = (canvasSize - 5 * space) / 4;
    for (var i = 0; i < BLOCKSIZE; i++) {
        for (var j = 0; j < BLOCKSIZE; j++) {
            fillRoundRect(context, (j + 1) * space + j * size, (i + 1) * space + i * size, size, size, radius, 'rgba(238, 228, 218, 0.35)');
        }
    }
}

/**
 * 填充圆角矩形
 * @param {*} context 
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 * @param {*} radius 
 * @param {*} fillColor 
 */
function fillRoundRect(context, x, y, width, height, radius, fillColor) {
    context.save();
    context.translate(x, y);
    pathRoundRect(context, width, height, radius);
    context.fillStyle = fillColor;
    context.fill();
    context.restore();
}

/**
 * 绘制圆角矩形路径
 * @param {*} context 
 * @param {*} width 
 * @param {*} height 
 * @param {*} radius 
 */
function pathRoundRect(context, width, height, radius) {
    context.beginPath();
    context.arc(width - radius, height - radius, radius, 0, Math.PI / 2, false);
    context.lineTo(radius, height);
    context.arc(radius, height - radius, radius, Math.PI / 2, Math.PI, false);
    context.lineTo(0, radius);
    context.arc(radius, radius, radius, Math.PI, 3 * Math.PI / 2, false);
    context.lineTo(width - radius, 0);
    context.arc(width - radius, radius, radius, 3 * Math.PI / 2, 2 * Math.PI, false);
    context.closePath();
}


/**
 * 2     #eee4da  #776e65  35px
 * 4     #ede0c8  #776e65  35px
 * 8     #f2b179  #f9f6f2  35px
 * 16    #f59563  #f9f6f2  35px
 * 32    #f67c5f  #f9f6f2  35px
 * 64    #f65e3b  #f9f6f2  35px
 * 128   #edcf72  #f9f6f2  25px
 * 256   #edcc61  #f9f6f2  25px
 * 512   #ECC850  #f9f6f2  25px
 * 1024  #EFC53F  #f9f6f2  25px
 * 2048  #EDC53F  #f9f6f2  25px
 */