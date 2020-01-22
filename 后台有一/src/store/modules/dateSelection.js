import { getBeforeDate, lastMonth } from "@/utils/newDate";
const dateSelection = {
    state: {
        pickerOptions: {
            shortcuts: [
                {
                    text: "今天",
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "昨日",
                    onClick(picker) {
                        const end = getBeforeDate(1);
                        picker.$emit("pick", [end, end]);
                    }
                },
                {
                    text: "最近一周",
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "最近一个月",
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "上月",
                    onClick(picker) {
                        const lastmonth = lastMonth();
                        picker.$emit("pick", lastmonth);
                    }
                },
                {
                    text: "最近三个月",
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit("pick", [start, end]);
                    }
                }
            ]
        }
    }
}
export default dateSelection