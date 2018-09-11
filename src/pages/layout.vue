/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：公共部分
*/
<template>
  <div class="layout">
    <Layout class="layout-main">
      <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed" width="256" class="layout-sidebar">
        <Navs :options="navsOptions"></Navs>
      </Sider>
      <Layout>
        <Header></Header>
        <Content class="main-container">
          <router-view/>
        </Content>
        <Footer></Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import Header from '../components/header/header.vue'
  import Navs from '../components/navs/navs.vue'
  import Footer from '../components/footer/footer.vue'

  export default{
    name: 'Layouts',
    components: {
      Header,
      Navs,
      Footer
    },
    data () {
      return {
        isCollapsed: false,
        navsOptions: {
          title: '政务数据交换平台',
          data: [
            {
              navId: 9,
              show: true,
              label: '系统概览',
              icon: 'md-speedometer',
              isParent: true,
              childrenUrl: ['/nodeOverview', '/logging'],
              authority: ['admin', 'security', 'auditor', 'operator', 'assessor'],
              children: [
                {
                  navId: 91,
                  show: true,
                  label: '节点概览',
                  frontUrl: '/nodeOverview',
                  authority: ['admin', 'security', 'auditor', 'operator', 'assessor']
                },
                {
                  navId: 92,
                  show: true,
                  label: '登录日志',
                  frontUrl: '/logging',
                  authority: ['admin', 'security', 'auditor', 'operator', 'assessor']
                }
              ]
            },
            {
              navId: 1,
              show: true,
              label: '数据资源管理',
              icon: 'logo-buffer',
              isParent: true,
              childrenUrl: ['/source', '/catalog', '/sourceAudit', '/catalogAudit', '/subscriptionAudit'],
              authority: ['operator', 'assessor'],
              children: [
                {
                  navId: 11,
                  show: true,
                  label: '资源管理',
                  frontUrl: '/source',
                  authority: ['operator']
                },
                {
                  navId: 12,
                  show: true,
                  label: '目录管理',
                  frontUrl: '/catalog',
                  authority: ['operator']
                },
                {
                  navId: 13,
                  show: true,
                  label: '资源审核',
                  frontUrl: '/sourceAudit',
                  authority: ['assessor']
                },
                {
                  navId: 14,
                  show: true,
                  label: '目录审核',
                  frontUrl: '/catalogAudit',
                  authority: ['assessor']
                },
                {
                  navId: 15,
                  show: true,
                  label: '订阅审核',
                  frontUrl: '/subscriptionAudit',
                  authority: ['assessor']
                }
              ]
            },
            {
              navId: 2,
              show: true,
              label: '资源交换管理',
              icon: 'md-sync',
              isParent: true,
              childrenUrl: ['/sourceSubscription', '/allSub', '/sourceManagement', '/sourceManagementAudit'],
              authority: ['operator', 'assessor'],
              children: [
                {
                  navId: 21,
                  show: true,
                  label: '资源集市',
                  frontUrl: '/sourceSubscription',
                  authority: ['operator']
                },
                {
                  navId: 22,
                  show: true,
                  label: '所有订阅',
                  frontUrl: '/allSub',
                  authority: ['operator']
                },
                {
                  navId: 23,
                  show: true,
                  label: '资源管理',
                  frontUrl: '/sourceManagement',
                  authority: ['operator']
                },
                {
                  navId: 24,
                  show: true,
                  label: '订阅审核',
                  frontUrl: '/sourceManagementAudit',
                  authority: ['assessor']
                }
              ]
            },
            {
              navId: 3,
              show: true,
              label: '审计管理',
              icon: 'md-create',
              isParent: true,
              childrenUrl: ['/logging', '/operation'],
              authority: ['auditor'],
              children: [
                {
                  navId: 31,
                  show: true,
                  label: '登录审计',
                  frontUrl: '/logging',
                  authority: ['auditor']
                },
                {
                  navId: 32,
                  show: true,
                  label: '操作审计',
                  frontUrl: '/operation',
                  authority: ['auditor']
                }
              ]
            },
            {
              navId: 4,
              show: true,
              label: '机构用户管理',
              icon: 'md-people',
              isParent: true,
              childrenUrl: ['/userManage', '/assignRole'],
              authority: ['admin', 'security'],
              children: [
                {
                  navId: 41,
                  show: true,
                  label: '用户管理',
                  frontUrl: '/userManage',
                  authority: ['admin']
                },
                {
                  navId: 42,
                  show: true,
                  label: '分配角色',
                  frontUrl: '/assignRole',
                  authority: ['security']
                }
              ]
            }
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    height: inherit;
    .layout-main{
      height: inherit;
      .layout-sidebar{
        background: #001529;
      }
      .main-container{
        background: #f0f2f5;
      }
    }
  }
</style>
