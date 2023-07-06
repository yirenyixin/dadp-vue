export const getmark = () => {
  const id = 'set-customer-watermark';
  const setWatermark = (dom: HTMLDivElement, str: any) => {
    if (document.getElementById(id) !== null) {
      dom
        ? dom.removeChild(document.getElementById(id)!)
        : document.body.removeChild(document.getElementById(id)!);
    }

    //创建一个画布
    const can = document.createElement('canvas');
    can.width = 400;
    can.height = 200;

    const cans = can.getContext('2d');
    cans!.rotate((-30 * Math.PI) / 180);
    cans!.font = '14px Vedana';
    cans!.fillStyle = 'rgba(0,0,0,0.15)';
    cans!.textAlign = 'left';
    cans!.textBaseline = 'middle';
    cans!.fillText(str, 0, can.height);

    // 创建整体容器，设置样式
    let div = document.createElement('div');
    div.id = id;
    div.style.pointerEvents = 'none';
    div.style.top = '0px';
    div.style.left = '-100px';
    div.style.position = 'absolute';
    div.style.zIndex = '1000';
    div.style.width = document.documentElement.clientWidth + 'px';
    div.style.height = document.documentElement.clientHeight + 'px';
    div.style.background =
      'url(' + can.toDataURL('image/png') + ') left top repeat';

    dom ? dom.appendChild(div) : document.body.appendChild(div);
    return id;
  };
  const watermark = (dom: HTMLDivElement, str: string) => {
    let id = setWatermark(dom, str);
    setInterval(() => {
      if (document.getElementById(id) === null) {
        id = setWatermark(dom, str);
      }
    }, 500);
    window.onresize = () => {
      setWatermark(dom, str);
    };
  };
  return { watermark };
};

// 清除水印
export const removeWatermark = () => {
  const id = 'set-customer-watermark';
  if (document.getElementById(id) !== null) {
    document.getElementById(id)!.style.display = 'none';
  }
};
