function num(s) {
    return s < 10 ? '0' + s : s;
}
//拿到今天的时间
export function newDate() {
    var Day = new Date();
    var y = Day.getFullYear();
    var m = Day.getMonth() + 1; //获取当前月份的日期 
    var d = Day.getDate();
    return y + "-" + num(m) + "-" + num(d);
}
//日期时间计算
export function getBeforeDate(n) {
    var n = n;
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
        if (mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
}

//根据时间计算星期几
export function getMyDay(date) {
    var week;
    if (date.getDay() == 0) week = "(日)"
    if (date.getDay() == 1) week = "(一)"
    if (date.getDay() == 2) week = "(二)"
    if (date.getDay() == 3) week = "(三)"
    if (date.getDay() == 4) week = "(四)"
    if (date.getDay() == 5) week = "(五)"
    if (date.getDay() == 6) week = "(六)"
    return week;
}


//获取本月的第一天
export function getCurrentMonthFirstDay() {
    var date = new Date()
    date.setDate(1)
    var month = parseInt(date.getMonth() + 1)
    var day = date.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day
}

//获取本月的最后一天
export function getCurrentMonthLast() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = new Date(year, month, 0)
    return year + '-' + month + '-' + day.getDate()
}

//获取上个月第一天和最后一天
export function lastMonth() {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var firstDayOfPreMonth = year + "-" + month + "-" + "01"; //上个月的第一天
    var lastDay = new Date(year, month, 0);
    var lastDayOfPreMonth = year + "-" + month + "-" + lastDay.getDate(); //上个月的最后一天
    return [firstDayOfPreMonth, lastDayOfPreMonth]
}

//获取今天的时间 到秒
export function todayTime() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + strHours + seperator2 + strMinutes + seperator2 + strSeconds;
    return currentdate;
}