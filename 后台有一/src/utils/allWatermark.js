import Watermark from "@/utils/watermark"
import { todayTime } from "@/utils/newDate";
import store from '../store'

export function allWatermark() {
    //console.log("水印", store.getters.name)
    let name = store.getters.name;
    let watermarkOne = todayTime();
    //console.log("水印", watermarkOne)
    let watermarkTwo = name + " youyiwan";
    Watermark.set(watermarkOne, watermarkTwo); //水印
}