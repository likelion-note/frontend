/** 바텀시트·토스트를 띄울 기준 요소. 폰 프레임이 있으면 그 안, 없으면 body */
export function getFrameElement(): HTMLElement {
  return document.getElementById('mobile-frame') ?? document.body
}
