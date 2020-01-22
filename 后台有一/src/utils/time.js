

/**
 * 
 * @param {Date} date1 
 * @param {Date} date2 截止时间 （要加24小时）
 * @param {Number} interval 时间间隔
 */
export function getSplitTime(date1, date2, interval) {
    const time1 = date1;
    const time2 = date2;
    const timeList = [];
    for (let i = 0, ti1 = time1, ti2 = time1 + interval; ti1 < time2; ti1 += interval, ti2 += interval) {

        timeList.push([ti1 * 0.001, ti2 * 0.001])
    }
    return timeList
}
export function formatTime(time) {
    // console.log(time)
    var d = new Date(time * 1000);
    if(time == 0) {
        return 0;
    }else if (time < 30) {
        return time + '秒';
    } else if (time < 3600) {
        // less 1 hour
        return Math.ceil(time / 60) + '分钟';
    } else if (time < 3600 * 24) {
        return Math.ceil(time / 3600) + '小时';
    } else {
        return  Math.ceil(time / 3600 * 24) + '天';
    }
    //  else {



    //     return (
    //         d.getDate() +
    //         '日' +
    //         d.getHours() +
    //         '时' +
    //         d.getMinutes() +
    //         '分'
    //     )
    // }
}