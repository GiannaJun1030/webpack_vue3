/**
 * 根据屏幕尺寸大小动态设置尺寸
 */
// 同postcss-pxtorem中rootValue相同
const baseSize = 14;

function setRem() {
  // 获取倍数
  const scale = document.documentElement.clientWidth / 1920;
  // 设置页面根节点大小
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + 'px';
}

setRem();

window.onresize = function () {
  setRem();
};
