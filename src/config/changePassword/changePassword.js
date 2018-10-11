/**
 * Created by Administrator on 2018/10/10 0010.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/18
 *
 * 描述 ：目录管理资源挂接配置数据
 */

class catalogMountOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '修改密码',
      apis: {
        changePwdApi: 'changePwd',
      },
      formValidate: {
        oldPwd: '',
        newPwd: '',
        checkPwd: '',
      },
      oldFormValidate: {
        oldPwd: '',
        newPwd: '',
        checkPwd: '',
      },
      showErrorPwd: false,
      tips: '',
      ruleValidate: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPwd: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          },
          {
            max: 24,
            min: 6,
            message: '密码为6-24位英文或数字'
          },
          {
            pattern:/[^\d]/g,
            message: '密码为纯数字时不可连续'
          }
        ],
        checkPwd: [
          {
            required: true,
            message: '重新确认的新密码不能为空',
            trigger: 'blur'
          }
        ],

      },

      initData: {
        name: '',
        beginTime: '',
        endTime: '',
        status: 1,
        pageNum: 1,
        pageSize: 10
      },


    }
  }
}

export default (data) => {
  return new catalogMountOptions(data);
}
