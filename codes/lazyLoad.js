html
div#lazy-img
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
  img(data-src="https://file.diamondfsd.com/img/9c61bc16-ae02-4f06-a8aa-0501db51eadb.png")
CSS
img{
  width:600px;
  height:300px;
  border: 2px solid #eee;
  background: #ccc;
}
#lazy-img{
  height: 400px;
  background:#eee;
  overflow: auto;
}

Javascript 代码
//我们获取容器内所有有 data-src 属性的dom对象，遍历获取他们的相对高度，储存成 { height: imgDom} 格式。然后监听 容器的滚动事件，当滚动的时候，计算当前滚动区域显示的图片dom，并将改 图片dom 的 src 的内容改成我们存储在 data-src 的内容。
var imgContainer = document.getElementById('lazy-img')
var imgs = imgContainer.querySelectorAll('[data-src]')
var imgHeightDomMapping = {}
imgs.forEach(function (img) {
  imgHeightDomMapping[img.offsetTop + img.clientHeight / 1.5] = img
})  // 获取所有 dom 对象相对容器的高度 并储存成 key: height, value: imgDom
imgContainer.addEventListener('scroll', function () {
  showImage()
})
function showImage () {
  var currentHeight = imgContainer.clientHeight + imgContainer.scrollTop // 滚动区域的高度
  Object.keys(imgHeightDomMapping).forEach(function (imageHeight) {
    if (currentHeight > imageHeight) { // 判断当前图片是否已经显示
        //将图片dom的 `src` 改为 `data-src` 的内容
        imgHeightDomMapping[imageHeight].src = imgHeightDomMapping[imageHeight].getAttribute('data-src')
    }
  })
}

showImage() // 主动调用一次 加载首页的
