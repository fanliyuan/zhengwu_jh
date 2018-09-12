/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/12
 *
 * 描述 ：目录管理路由
 */

import CatalogPage from '@/pages/catalog/catalog.vue'

export default [{
  path: '/catalog',
  name: 'Catalog',
  component: CatalogPage,
  meta: {
    authority: ['user']
  }
}]
