import { createApp } from 'vue';

/**
 * @description  自定义全局组件注册
 * @param  {ReturnType<typeofcreateApp>} 实例
 */
export function loadAllPlugins(app: ReturnType<typeof createApp>) {
  const selfComponents = require.context(
    '@/components/global',
    true,
    /\.(vue)$/
  );
  selfComponents.keys().forEach((component) => {
    const _selfComponent = selfComponents(component);
    app.component(_selfComponent.default.name, _selfComponent.default);
  });
}

/**
 * @description  获取svg文件
 * @param  {ReturnType<typeofcreateApp>} 实例
 */
export const loadSvg = () => {
  const req = require.context(`@/assets/svg/icon`, true, /\.svg$/);
  req.keys().map(req);
};

/**
 * 码值转换-通过码值获取名称
 * @param codeName 码值名
 * @param codeValue 待转换的值
 * @param isMult 是否存在多个转换的值
 * @returns
 */
export const getNameByCode = (
  codeName: any,
  codeValue: any,
  isMult = false
) => {
  const hasCode = sessionStorage.getItem('codeList') || '';
  if (!hasCode) return codeValue;
  const codeList = JSON.parse(hasCode);
  const codeData = codeList[codeName] || [];
  if (isMult) {
    const resValue: any[] = [];
    const newCodeValue = codeValue.split(',');
    newCodeValue.forEach((el: any) => {
      const _value = codeData.filter((k: { value: any }) => k.value === el)[0];
      if (_value) resValue.push(_value.content);
    });
    return resValue.join(',');
  } else {
    const _value = codeData
      ? codeData.filter((k: any) => k.value === codeValue)[0]
      : '';
    return _value ? _value.content : codeValue;
  }
};
/**
 * 表单重置
 * @param obj 表单对象
 * @returns
 */
export const resetFields = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    switch (Object.prototype.toString.call(obj[key])) {
      case '[object Number]': {
        obj[key] = 0;
        break;
      }
      case '[object String]': {
        obj[key] = '';
        break;
      }
      case '[object Boolean]': {
        obj[key] = false;
        break;
      }
      case '[object Object]': {
        obj[key] = {};
        break;
      }
      case '[object Array]': {
        obj[key] = [];
        break;
      }
      default: {
        obj[key] = null;
      }
    }
  });
};

/**
 * 在input框光标的位置插入对应文字
 * @param id 操作对象
 * @param insertTxt 待插入的文字
 * @param ogValue 编辑前文本
 * @returns
 */
export const insertInputTxt = (id: string, insertTxt: string) => {
  const elInput = document.getElementById(id) as HTMLInputElement;
  const startPos = elInput?.selectionStart;
  const endPos = elInput?.selectionEnd;
  if (!startPos || !endPos) {
    elInput.value = insertTxt;
    return elInput.value;
  }
  const txt = elInput.value;
  const result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos);
  elInput.value = result;
  // 重新定义光标位置
  elInput.focus();
  elInput.selectionStart = startPos + insertTxt.length;
  elInput.selectionEnd = startPos + insertTxt.length;
  return result;
};
/**
 * 千分符
 * @param val 需要格式化的数据
 * @param toFixedNum 需要保留的位数
 * @returns
 */
export const regThousandsFn = (val: string | number, toFixedNum = 0) => {
  const num = toFixedNum ? Number(val).toFixed(toFixedNum) : val;
  if (!isNaN(Number(num))) {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return num;
  }
};
