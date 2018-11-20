export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'security', 'auditor', 'user', 'assessor'],
    routes: [
      // 系统概览
      { path: '/', redirect: '/user/login' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        authority: ['admin', 'security', 'auditor', 'user', 'assessor'],
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/loginLog',
            name: 'loginLog',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/systemNotice',
            name: 'systemNotice',
            component: './Dashboard/Workplace',
            authority: ['admin', 'security', 'user', 'assessor'],
          },
        ],
      },
      // 机构用户管理
      {
        path: '/users',
        icon: 'team',
        name: 'users',
        authority: ['admin', 'security'],
        routes: [
          {
            path: '/users/usersManagement',
            name: 'usersManagement',
            component: './Forms/BasicForm',
            authority: ['admin'],
          },
          {
            path: '/users/assignRole',
            name: 'assignRole',
            component: './Forms/StepForm',
            authority: ['security'],
          },
        ],
      },
      // 审计管理
      {
        path: '/audit',
        icon: 'audit',
        name: 'audit',
        authority: ['auditor'],
        routes: [
          {
            path: '/audit/loginAudit',
            name: 'loginAudit',
            component: './List/TableList',
          },
          {
            path: '/list/operationAudit',
            name: 'operationAudit',
            component: './List/BasicList',
          },
        ],
      },
      // 政务信息资源目录
      {
        path: 'informationResource',
        name: 'informationResource',
        icon: 'profile',
        authority: ['user', 'assessor'],
        routes: [
          {
            path: '/informationResource/audit',
            name: 'audit',
            component: './Profile/BasicProfile',
            authority: ['assessor'],
          },
          {
            path: '/informationResource/subscriptionLicense',
            name: 'subscriptionLicense',
            component: './Profile/AdvancedProfile',
            authority: ['assessor'],
          },
          {
            path: 'management',
            name: 'management',
            component: './InformationResource/SourceManagement',
            authority: ['user'],
          },
          {
            path: 'addDirectory',
            name: 'addDirectory',
            hideInMenu: true,
            component: './InformationResource/AddDirectory',
            authority: ['user'],
          },
          {
            path: 'inputDirectory',
            name: 'inputDirectory',
            hideInMenu: true,
            component: './InformationResource/InputDirectory',
            authority: ['user'],
          },
          {
            path: 'viewDirectory',
            name: 'viewDirectory',
            hideInMenu: true,
            component: './InformationResource/ViewDirectory',
            authority: ['user'],
          },
          {
            path: 'resourceConnectionData',
            name: 'resourceConnectionData',
            hideInMenu: true,
            component: './InformationResource/ResourceConnectionData',
            authority: ['user'],
          },
          {
            path: 'openShare',
            name: 'openShare',
            hideInMenu: true,
            component: './InformationResource/OpenShare',
            authority: ['user'],
          },
          {
            path: 'openShareFile',
            name: 'openShareFile',
            hideInMenu: true,
            component: './InformationResource/OpenShareFile',
            authority: ['user'],
          },
        ],
      },
      // 数据发布管理
      {
        name: 'data',
        icon: 'file-done',
        path: '/data',
        authority: ['user', 'assessor'],
        routes: [
          {
            path: '/data/audit',
            name: 'audit',
            component: './Result/Success',
            authority: ['assessor'],
          },
          {
            path: '/data/source',
            name: 'source',
            component: './DataSource/DataSource',
            authority: ['user'],
          },
          {
            path: '/data/source/add',
            name: 'sourceAdd',
            component: './DataSource/AddDataSource',
            authority: ['user'],
            hideInMenu: true,
          },
          {
            path: '/data/source/update/:id',
            name: 'sourceUpdate',
            component: './DataSource/AddDataSource',
            authority: ['user'],
            hideInMenu: true,
          },
          {
            path: '/data/source/access/:id',
            name: 'sourceAccess',
            component: './DataSource/AccessDataSource',
            authority: ['user'],
            hideInMenu: true,
          },
          {
            path: '/data/management',
            name: 'management',
            component: './DataSource/DataSourceManagement',
            authority: ['user'],
          },
          {
            path: '/data/management/update/:type/:id',
            name: 'managementUpdate',
            component: './DataSource/AccessDataSource',
            authority: ['user'],
            hideInMenu: true,
          },
          {
            path: '/data/management/dbview/:id',
            name: 'dbview',
            component: './DataSource/DBView',
            auditor: 'user',
            hideInMenu: true,
          },
          {
            path: '/data/management/infoSource/:id',
            name: 'infoSource',
            component: './DataSource/InfoSource',
            audit: 'user',
            hideInMenu: true,
          },
        ],
      },
      // 数据订阅管理
      {
        name: 'subscribe',
        icon: 'link',
        path: '/subscribe',
        authority: ['user', 'assessor'],
        routes: [
          {
            path: '/subscribe/audit',
            name: 'audit',
            component: './Exception/403',
            authority: ['assessor'],
          },
          {
            path: '/subscribe/sourceCatalog',
            name: 'sourceCatalog',
            component: './Subscription/SourceCatalog',
            authority: ['user'],
          },
          {
            path: '/subscribe/management',
            name: 'management',
            component: './Subscription/SubManagement',
            authority: ['user'],
          },
          {
            path: '/subscribe/dataManagement',
            name: 'dataManagement',
            component: './Subscription/DataManagement',
            authority: ['user'],
          },
          {
            path: 'subDetailFile',
            name: 'subDetailFile',
            component: './Subscription/SubDetailFile',
            authority: 'user',
            hideInMenu: true,
          },
          {
            path: 'subDetailDataBase',
            name: 'subDetailDataBase',
            component: './Subscription/SubDetailDataBase',
            authority: 'user',
            hideInMenu: true,
          },
          {
            path: '/data/management/infoSource/:id',
            name: 'infoSource',
            component: './DataSource/InfoSource',
            audit: 'user',
            hideInMenu: true,
          },
        ],
      },
      // 监控告警
      {
        name: 'monitor',
        icon: 'desktop',
        path: '/monitor',
        authority: ['user'],
        routes: [
          {
            path: '/monitor/nodes',
            name: 'nodes',
            component: './Exception/403',
          },
          {
            path: '/monitor/channel',
            name: 'channel',
            component: './Exception/404',
          },
          {
            path: '/monitor/task',
            name: 'task',
            component: './Exception/500',
          },
          {
            path: '/monitor/viewWarning',
            name: 'viewWarning',
            component: './Exception/TriggerException',
          },
          {
            path: '/monitor/rulesWarning',
            name: 'rulesWarning',
            component: './Exception/TriggerException',
          },
        ],
      },
      // 统计分析
      {
        name: 'statistics',
        icon: 'pie-chart',
        path: '/statistics',
        authority: ['user'],
        routes: [
          {
            path: '/statistics/informationResources',
            name: 'informationResources',
            component: './Exception/403',
          },
          {
            path: '/statistics/data',
            name: 'data',
            component: './Exception/404',
          },
          {
            path: '/statistics/exchange',
            name: 'exchange',
            component: './Exception/500',
          },
          {
            path: '/statistics/open',
            name: 'open',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      // 错误处理
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
