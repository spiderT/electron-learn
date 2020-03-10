const {
    desktopCapturer,
    remote
} = require('electron');
const screen = remote.screen;
const {
    width,
    height
} = screen.getPrimaryDisplay().workAreaSize

const {
    Draw
} = require(`${__dirname}/js/draw.js`)


desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
        width,
        height
    }
}, async (error, sources) => {
    if (error) return console.log(error)
    const screenImgUrl = sources[0].thumbnail.toDataURL()

    const bg = document.querySelector('.bg')
    const rect = document.querySelector('.rect')
    const sizeInfo = document.querySelector('.size-info')
    const toolbar = document.querySelector('.toolbar')
    const draw = new Draw(screenImgUrl, bg, width, height, rect, sizeInfo, toolbar)
    document.addEventListener('mousedown', draw.startRect.bind(draw))
    document.addEventListener('mousemove', draw.drawingRect.bind(draw))
    document.addEventListener('mouseup', draw.endRect.bind(draw))
})