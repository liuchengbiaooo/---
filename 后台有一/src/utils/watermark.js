let watermark = {}

let setWatermark = (str, str2) => {
    let id = '1.23452384164.123412415'

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    let can = document.createElement('canvas')
    can.width = 250
    can.height = 150

    let cans = can.getContext('2d')
    cans.rotate(30 * Math.PI / 180)
    cans.font = '17px Vedana'
    cans.fillStyle = 'rgba(200, 200, 200, 0.30)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, 15, 30) //第一行字体
    cans.fillText(str2, 40, 65) //第二行字体
        // cans.fillText(str, can.width / 3, can.height / 2)

    let div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '70px'
    div.style.left = '200px'
    div.style.position = 'fixed'
    div.style.zIndex = '100000'
    div.style.width = document.documentElement.clientWidth - 100 + 'px'
    div.style.height = document.documentElement.clientHeight - 100 + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    document.body.appendChild(div)
    return id
}

// 该方法只允许调用一次
// watermark.set = (str) => {
//     let id = setWatermark(str)
//     setInterval(() => {
//         if (document.getElementById(id) === null) {
//             id = setWatermark(str)
//         }
//     }, 500)
//     window.onresize = () => {
//         setWatermark(str)
//     }
// }

watermark.set = (str, str2) => {
    let id = setWatermark(str, str2)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(str, str2)
        }
    }, 500)
    window.onresize = () => {
        setWatermark(str, str2)
    }
}

export default watermark