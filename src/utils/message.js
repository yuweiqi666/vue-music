export default function message (message = '消息弹窗') {
  const div = document.createElement('div')
  document.body.appendChild(div)
  setDomCommonStyle(div)
  setDomAnimateStyle(div)
  div.innerHTML = message
}

function setDomCommonStyle (dom) {
  dom.style.width = '128px'
  dom.style.height = '75px'
  dom.style.background = 'rgba(0, 0, 0, 0.6)'
  dom.style.position = 'fixed'
  dom.style.zIndex = '999'
  dom.style.top = '35%'
  dom.style.left = 0
  dom.style.right = 0
  dom.style.margin = 'auto'
  dom.style.borderRadius = '12px'
  dom.style.textAlign = 'center'
  dom.style.lineHeight = '75px'
  dom.style.fontSize = '20px'
}

function setDomAnimateStyle (dom) {
  dom.style.animation = 'scaleDia 0.2s ease, hideAnimate 0.2s 0.4s linear'
  setTimeout(() => {
    document.body.removeChild(dom)
  }, 600)
}
