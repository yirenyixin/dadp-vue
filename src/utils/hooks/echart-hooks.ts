import { init, getInstanceByDom, EChartsType, EChartsOption } from 'echarts';

export default function (id: string) {
  const el: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
  //获取图表实例
  let echartInstance: EChartsType = getInstanceByDom(el) as EChartsType;
  if (!echartInstance) {
    echartInstance = init(el, 'macarons');
    echartInstance?.resize();
  }
  const setOptions = (options: EChartsOption) => {
    echartInstance.setOption(options, true);
  };
  const updateSize = () => {
    echartInstance.resize();
  };
  //移除监听
  const destroyResize = () => {
    window.removeEventListener('resize', () => {
      echartInstance?.clear();
      echartInstance?.dispose();
    });
  };
  window.onresize = function () {
    echartInstance?.resize();
  };

  return {
    echartInstance,
    setOptions,
    updateSize,
    destroyResize,
  };
}
