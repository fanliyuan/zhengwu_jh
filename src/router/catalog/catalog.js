/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/12
 *
 * 描述 ：目录管理路由
 */

import CatalogPage from '@/pages/catalog/catalog.vue'
import CatalogItemPage from '@/pages/catalog/catalogItem/catalogItem.vue'
import CatalogMountPage from '@/pages/catalog/catalogMount/catalogMount.vue'

export default [{
  path: '/catalog',
  name: 'Catalog',
  component: CatalogPage,
  meta: {
    authority: ['user'],
    //keepAlive: true
  }
}, {
  path: '/catalog/itemInfo/:id',
  name: 'CatalogItemInfo',
  component: CatalogItemPage,
  meta: {
    authority: ['user'],
    //keepAlive: true
  }
}, {
  path: '/catalog/mount/:id/',
  name: 'CatalogMount',
  component: CatalogMountPage,
  meta: {
    authority: ['user'],
    //keepAlive: false
  }
}]
