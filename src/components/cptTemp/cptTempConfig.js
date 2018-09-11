/**
 * 作者 ：author
 *
 * 日期 ：time
 *
 * 描述 ：demo管理配置数据
 */

class demoOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return modelObj;
  }
}

export default (data) => {
  return new demoOptions(data);
}
