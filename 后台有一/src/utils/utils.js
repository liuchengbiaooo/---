define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function range(arrList, start, end) {
        if (end) {
            for (var i = start; i <= end; i++) {
                arrList.push(i);
            }
        }
        else {
            arrList.push(start);
        }
        return arrList;
    }
    exports.range = range;
});
