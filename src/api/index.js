/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/20
 *
 * 描述 ：api请求入口
 */
import apiUrl from './apiUrl'
import apiUtil from './apiUtil'

const generateApiMap = apiUtil.generateApiMap({...apiUrl});

export default {
  ...generateApiMap // 取出所有可遍历属性赋值在新的对象上
}
