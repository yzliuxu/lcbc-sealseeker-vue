import {dt} from './dt';
var i;
//s参数是待分解汉字，d参数指subdivide，即无理拆分
//此处的拆分方法和相关配置文件均来自WFG的部件检索项目http://fgwang.blogspot.com/2015/12/blog-post_30.html
// 按其代码逻辑，一个无法被拆分的汉字进行拆分后将返回""，此处做了修改，使无法被拆分的汉字原样返回
export function exhaust(s, d, m) {
    // eslint-disable-next-line no-debugger
    var t = "";
    if (s.length) {
        var j = 0;
        var w = s.charAt(j);
        var c = w.charCodeAt(0);
        if ((c >= 0xD800) && (c <= 0xDBFF)) {
            w += s.charAt(++j);
            c = ((c - 0xD800) << 10) + w.charCodeAt(1) + 0x2400;
        }
        var p = dt[GetIndex(c)].slice(j + 1);
        var k = 0;
        for (i = 0; i < p.length; i++) {
            w = p.charAt(i);
            if ((w == "!") && !d) break;
            if ((w == "@") || (w == "!")) {
                if (k) t += (m < 0) ? "┇" : "‖";
                k++;
            } else {
                c = w.charCodeAt(0);
                if ((c >= 0xD800) && (c <= 0xDBFF)) w += p.charAt(++i);
                t += w;
                if (m) {
                    var q = this.exhaust(w, d, -1);
                    if (q.length) t += "(" + q + ")";
                }
            }
        }
    }
    //使无法被拆分的汉字原样返回
    if (t === '') {
        return s;
    } else {
        return t;
    }
}

function GetBlock(c) {
    let n;
    if ((c >= 0x4E00) && (c <= 0x9FFF)) n = 1; else if ((c >= 0x3400) && (c <= 0x4DBF)) n = 2; else if ((c >= 0x20000) && (c <= 0x2A6DF)) n = 3; else if ((c >= 0x2A700) && (c <= 0x2B739)) n = 4; else if ((c >= 0x2B740) && (c <= 0x2B81D)) n = 5; else if ((c >= 0x2B820) && (c <= 0x2CEA1)) n = 6; else if ((c >= 0x2CEB0) && (c <= 0x2EBE0)) n = 7; else if ((c >= 0x30000) && (c <= 0x3134A)) n = 8; else if ((c >= 0x31350) && (c <= 0x323AF)) n = 9; else if ((c >= 0x2EBF0) && (c <= 0x2EE5D)) n = 10; else if ((c >= 0xF900) && (c <= 0xFA6D)) n = 27; else if ((c >= 0xFA70) && (c <= 0xFAD9)) n = 28; else if ((c >= 0x2F800) && (c <= 0x2FA1D)) n = 29; else if ((c >= 0xF0220) && (c <= 0x108FC4)) n = 30; else n = 0;
    return n;
}

function GetIndex(c) {
    var n = GetBlock(c);
    switch (n) {
        case 1:
            i = c - 0x4DCF;
            break;
        case 2:
            i = c + 0x1E31;
            break;
        case 3:
            i = c - 0x1940F;
            break;
        case 4:
            i = c - 0x1942F;
            break;
        case 5:
            i = c - 0x19435;
            break;
        case 6:
            i = c - 0x19437;
            break;
        case 7:
            i = c - 0x19445;
            break;
        case 8:
            i = c - 0x1A864;
            break;
        case 9:
            i = c - 0x1A869;
            break;
        case 10:
            i = c - 0x170A9;
            break;
        case 27:
            i = c + 0x84B5;
            break;
        case 28:
            i = c + 0x84B3;
            break;
        case 29:
            i = c - 0x17873;
            break;
        case 30:
            i = c - 0xD8075;
            break;
        default:
            for (i = 48; i > 0; i--) {
                if (c == dt[i].charCodeAt(0)) break;
            }
    }
    return i;
}