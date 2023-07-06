import { ElMessage } from 'element-plus';
import $http from './index';
import { CustomSuccessData } from './http-type';
/**
 * 文件下载
 * @param _url 地址
 * @param _params 参数
 * @param requestFn 请求方式
 * @returns
 */
export const downloadFiles = (
  _url: string,
  _params: any,
  requestFn = 'download'
) => {
  $http[requestFn](_url, _params)
    .then((res: CustomSuccessData) => {
      const { data } = { ...res };
      const contentDisposition = res.headers['content-disposition'];

      const fileName = window.decodeURI(
        contentDisposition.substring(contentDisposition.indexOf('=') + 1)
      );
      const blob = new Blob([data], {
        type: 'application/octet-stream',
      });
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      } else {
        (navigator as any).msSaveBlob(blob, fileName);
      }
    })
    .catch((err: any) => {
      ElMessage.error(err.msg);
    });
};

export const downLoadUrl = process.env.VUE_APP_BASE_API + '/sys/file/download';
export const doUploadUrl = process.env.VUE_APP_BASE_API + '/sys/file/upload';
