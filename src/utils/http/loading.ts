/**
 *loading框设置局部刷新
 * 当调用一次showLoading，则次数+1；当次数为0时，则显示loading
 * 当调用一次hideLoading，则次数-1; 当次数为0时，则结束loading
 */
import { ElLoading } from 'element-plus';

//声明一个对象用于存储请求个数
let loadingRequestCount = 0;
// 初始化loading
let loadingInstance: any;

//显示
const showLoading = () => {
  if (loadingRequestCount === 0) {
    let _target: any =
      document.querySelector('.el-dialog') ||
      document.querySelector('.app-main');

    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在请求数据...',
      background: 'rgb(0,0,0,0.1)',
      target: _target,
      customClass: 'me-loading'
    });
  }
  loadingRequestCount++;
};

//隐藏
const hideLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0) {
    loadingInstance.close();
  }
};

export { showLoading, hideLoading };
