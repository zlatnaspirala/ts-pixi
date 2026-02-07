/**
 * @description
 * Put only global stuff here.
 * No PIXI context here.
 */

let fullscreenEnabled=false;
export function enableFullscreen() {
  if(fullscreenEnabled) return;
  const elem=document.documentElement;
  if(elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  } else if((elem as any).msRequestFullscreen) {
    (elem as any).msRequestFullscreen();
  }
  fullscreenEnabled=true;
}

export function onFirstInteraction() {
  enableFullscreen();
  window.removeEventListener('pointerdown', onFirstInteraction);
}

/**
 * Universal fetch handler for json format data.
 * @param link
 * @returns Promise
 */
export function getDataFromLink(link: string) {
  return new Promise((resolve, reject) => {
    fetch(link).then(r => r.json()).then((r) => {
      resolve(r);
    }).catch((e) => {
      reject(e);
    })
  })
}

/**
 * @description
 * Detect if the device is mobile / touch-capable.
 * Returns true if touch input is supported, not just screen size.
 */
export function isMobile(): boolean {
  if(typeof navigator==="undefined") return false;
  const ua=navigator.userAgent||navigator.vendor||(window as any).opera;
  const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
  const isMobileUA=/android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
  return isTouch||isMobileUA;
}

export function getOrientation(): "landscape" | "portrait" {
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}