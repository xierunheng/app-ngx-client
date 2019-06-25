import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'E-commerce',
  //   icon: 'nb-e-commerce',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'nb-home',
  //   link: '/pages/iot-dashboard',
  // },
  {
    title: '综合概览',
    icon: 'nb-home',
    link: '/pages/i-dashboard',
  },
  {
    title: '生产概览',
    icon: 'nb-home',
    link: '/pages/def-dashboard',
  },
  {
    title: '生产过程',
    icon: 'nb-bar-chart',
    link: '/pages/process-dashboard',
  },
  {
    title: '实时生产',
    icon: 'nb-title',
    link: '/pages/realtime-dashboard',
  },
  {
    title: '质量概览',
    icon: 'nb-search',
    link: '/pages/qc-dashboard',
  },
  {
    title: '设备概览',
    icon: 'nb-gear',
    link: '/pages/emaint-dashboard',
  },
  {
    title: '生产管理',
    group: true,
  },
  {
    title: '生产建模',
    icon: 'nb-star',
    children: [
      {
        title: '层级结构',
        link: '/pages/productions/hs',
      },
      {
        title: '参数配置',
        link: '/pages/productions/parameter',
      },
      {
        title: '员工配置',
        link: '/pages/productions/personnel',
      },
      {
        title: '设备配置',
        link: '/pages/productions/equipment',
      },
      {
        title: '物料配置',
        link: '/pages/productions/material',
      },
      {
        title: '能源配置',
        link: '/pages/productions/energy',
      },
      {
        title: '工艺段',
        link: '/pages/productions/proseg',
      },
      {
        title: '操作定义',
        link: '/pages/productions/opdef',
      },
      {
        title: 'KPI',
        link: '/pages/productions/kpi',
      },
    ],
  },
  {
    title: '工单管理',
    icon: 'nb-star',
    children: [
      {
        title: '工单概览',
        link: '/pages/productions/jobOrder',
      },
      {
        title: '工单统计',
        link: '/pages/productions/jobs-stats',
      },
      {
        title: '作业响应',
        link: '/pages/productions/work-res',
      },
      {
        title: '工单响应',
        link: '/pages/productions/jobOrder-res',
      },
    ],
  },
  {
    title: '车间排产',
    icon: 'nb-star',
    children: [
      {
        title: '车间计划',
        link: '/pages/productions/floor-schedule',
      },
    ],
  },
  {
    title: '物料&生产流转',
    icon: 'nb-star',
    children: [
      {
        title: '在制品概览',
        link: '/pages/productions/prod-logistic/wip',
      },
    ],
  },
  {
    title: '跟踪&追溯',
    icon: 'nb-star',
    children: [
      {
        title: '批次概览',
        link: '/pages/productions/track-trace/mlot',
      },
      {
        title: '坯体追溯',
        link: '/pages/productions/track-trace/prod-trace',
      }, {
        title: '包材跟踪',
        link: '/pages/productions/track-trace/pack-track',
      }, {
        title: '釉料跟踪',
        link: '/pages/productions/track-trace/glaze-track',
      },
    ],
  },
  {
    title: '过程控制',
    icon: 'nb-star',
    children: [
      {
        title: '生产事件',
        link: '/pages/productions/process/single-event',
      },
      {
        title: '设备过程',
        link: '/pages/productions/process/process-equipment',
      },
      {
        title: '过程对比分析',
        link: '/pages/productions/process/process-compare',
      },

    ],
  },
  {
    title: '设备管理',
    group: true,
  },
  {
      title: '设备运维',
      icon: 'nb-star',
      children: [
      // {
      //   title: '设备监控',
      //   link: '/pages/maintenance/equip-perf',
      // },
      {
        title: '报警&保养',
        //    icon: 'nb-bar-chart',
        children: [
          {
            title: '维保报警',
            link: '/pages/maintenance/e-alert',
          }, {
            title: '维保信息',
            link: '/pages/maintenance/MTSignal',
          },
        ],
      },
      {
        title: '维保调度',
        //    icon: 'nb-bar-chart',
        children: [
          {
            title: '维保派工',
            link: '/pages/maintenance/sched',
          },
            // {
            //   title: '维保操作请求',
            //   link: '/pages/maintenance/opreq',
            // },{
            //   title: '维保工单',
            //   link: '/pages/maintenance/opreq',
            // },
            // {
            //   title: '维保记录',
            //   link: '/pages/maintenance/opreq',
            // },
        ],
      },
      // {
      //   title: '设备点检',
      //   link: '/pages/maintenance/equip-perf',
      // },
      {
        title: '设备绩效',
        link: '/pages/maintenance/equip-perf',
      },
      // {
      //   title: '维保经验库',
      //   link: '/pages/maintenance/equip-perf',
      // }
    ],
  },
  {
    title: '设备统计',
    icon: 'nb-star',
  //  icon: 'nb-tables',
    children: [
      // {
      //   title: ' 工艺设备数量',
      //   link: '/pages/maintenance/alertStats',
      // },
     {
        title: '故障统计',
        link: '/pages/maintenance/alertStats',
      },
      // {
      //   title: '设备OEE',
      //   link: '/pages/maintenance/analysis',
      // },
          // {
          //   title: '持续改善',
          //   link: '/pages/maintenance/analysis',
          // },
   ],
  }, 
  {
    title: '工装管理',
    icon: 'nb-star',
    children: [
      {
        title: '工装概览',
        link: '/pages/maintenance/physical-asset',
      },
    ],
  },
  {
    title: '量具管理',
    icon: 'nb-star',
    children: [
      {
        title: '层级结构',
        link: '/pages/productions/hs',
      },
    ],
  },
  {
    title: '质量管理',
    group: true,
  },
  {
    title: '生产检验',
    icon: 'nb-star',
    children: [
      {
        title: '基础数据',
        link: '/pages/quality/IPQC/database',
      },
      {
        title: '实验室检测',
        link: '/pages/quality/IPQC/mtest',
      },
      {
        title: '质量统计',
        link: '/pages/quality/IPQC/statistics',
      },
      {
        title: '质量处理单',
        link: '/pages/quality/IPQC/alertreport',
      },
    ],
  },
  {
    title: '来料检验',
    icon: 'nb-star',
    children: [
      {
        title: '物料检测规格',
        link: '/pages/quality/IQC/mtest-spec',
      },
      {
        title: '物料检测记录',
        link: '/pages/quality/IQC/mtest',
      },
    ],
  },
  {
    title: '缺陷模型分析',
    icon: 'nb-star',
    children: [
      {
        title: '层级结构',
        link: '/pages/productions/hs',
      },
    ],
  },
  {
    title: '人力资源管理',
    group: true,
  },
  {
    title: '工时&出勤',
    icon: 'nb-star',
    children: [
      {
        title: '工时概览',
        link: '/pages/personnel/attendance',
      },
    ],
  },
  {
    title: '绩效工资',
    icon: 'nb-star',
    children: [
      {
        title: '工资单',
        link: '/pages/personnel/wage',
      },
    ],
  },
  {
    title: '能源管理',
    group: true,
  },
  {
    title: '能源监测',
    icon: 'nb-star',
    link: '/pages/energy/energy-monitor'
  },
  {
    title: '预警管理',
    group: true,
  },
  {
    title: '预警配置',
    icon: 'nb-star',
    link: '/pages/alerts/work-alert-def'
  },
  {
    title: '预警概览',
    icon: 'nb-star',
    link: '/pages/alerts/work-alert'
  },
  {
    title: '交互终端管理',
    group: true,
  },
  {
    title: '终端配置',
    icon: 'nb-star',
    link: '/pages/terminals/terminal-def'
  },
  {
    title: '电子看板',
    icon: 'nb-star',
    children: [
      {
        title: '综合看板',
        link: '/terminals/e-kanbans/integration',
      }, {
        title: '质量看板',
        link: '/pages/terminals/e-kanbans/quality',
      },{
        title: '设备看板',
        link: '/pages/terminals/e-kanbans/equipment',
      },{
        title: '总经理看板',
        link: '/pages/terminals/e-kanbans/president',
      },{
        title: '设备管理看板',
        link: '/pages/terminals/e-kanbans/equipManage',
      },
    ],
  },
  {
    title: '车间终端',
    icon: 'nb-star',
    link: '/pages/terminals/units'
  },
  {
    title: '移动终端',
    icon: 'nb-star',
    link: '/pages/terminals/smart'
  },
  {
    title: '系统配置管理',
    group: true,
  },
  {
    title: '权限管理',
    icon: 'nb-star',
    children: [
      {
        title: '登录',
        link: '/auth/login',
      },
      {
        title: '注册',
        link: '/auth/register',
      },
      {
        title: '重置密码',
        link: '/auth/reset-password',
      },
    ],
  },
  {
    title: '系统集成',
    icon: 'nb-star',
    children: [
      {
        title: 'ERP数据交互',
        link: '/pages/other-system/erp',
      },
      {
        title: 'SCADA数据交互',
        link: '/pages/other-system/scada',
      },
    ],
  },
  {
    title: '文档管理',
    icon: 'nb-star',
    children: [
      {
        title: '工艺文档',
        link: '/pages/docs',
      },
    ],
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Extra Components',
  //   icon: 'nb-star',
  //   children: [
  //     {
  //       title: 'Calendar',
  //       link: '/pages/extra-components/calendar',
  //     },
  //     {
  //       title: 'Stepper',
  //       link: '/pages/extra-components/stepper',
  //     },
  //     {
  //       title: 'List',
  //       link: '/pages/extra-components/list',
  //     },
  //     {
  //       title: 'Infinite List',
  //       link: '/pages/extra-components/infinite-list',
  //     },
  //     {
  //       title: 'Accordion',
  //       link: '/pages/extra-components/accordion',
  //     },
  //     {
  //       title: 'Progress Bar',
  //       link: '/pages/extra-components/progress-bar',
  //     },
  //     {
  //       title: 'Spinner',
  //       link: '/pages/extra-components/spinner',
  //     },
  //     {
  //       title: 'Alert',
  //       link: '/pages/extra-components/alert',
  //     },
  //     {
  //       title: 'Tree',
  //       link: '/pages/extra-components/tree',
  //     },
  //     {
  //       title: 'Tabs',
  //       link: '/pages/extra-components/tabs',
  //     },
  //     {
  //       title: 'Calendar Kit',
  //       link: '/pages/extra-components/calendar-kit',
  //     },
  //     {
  //       title: 'Chat',
  //       link: '/pages/extra-components/chat',
  //     },
  //   ],
  // },
  // {
  //   title: 'Forms',
  //   icon: 'nb-compose',
  //   children: [
  //     {
  //       title: 'Form Inputs',
  //       link: '/pages/forms/inputs',
  //     },
  //     {
  //       title: 'Form Layouts',
  //       link: '/pages/forms/layouts',
  //     },
  //     {
  //       title: 'Buttons',
  //       link: '/pages/forms/buttons',
  //     },
  //     {
  //       title: 'Datepicker',
  //       link: '/pages/forms/datepicker',
  //     },
  //   ],
  // },
  // {
  //   title: 'UI Features',
  //   icon: 'nb-keypad',
  //   link: '/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Grid',
  //       link: '/pages/ui-features/grid',
  //     },
  //     {
  //       title: 'Icons',
  //       link: '/pages/ui-features/icons',
  //     },
  //     {
  //       title: 'Typography',
  //       link: '/pages/ui-features/typography',
  //     },
  //     {
  //       title: 'Animated Searches',
  //       link: '/pages/ui-features/search-fields',
  //     },
  //   ],
  // },
  // {
  //   title: 'Modal & Overlays',
  //   icon: 'nb-layout-default',
  //   children: [
  //     {
  //       title: 'Dialog',
  //       link: '/pages/modal-overlays/dialog',
  //     },
  //     {
  //       title: 'Window',
  //       link: '/pages/modal-overlays/window',
  //     },
  //     {
  //       title: 'Popover',
  //       link: '/pages/modal-overlays/popover',
  //     },
  //     {
  //       title: 'Toastr',
  //       link: '/pages/modal-overlays/toastr',
  //     },
  //     {
  //       title: 'Tooltip',
  //       link: '/pages/modal-overlays/tooltip',
  //     },
  //   ],
  // },
  // {
  //   title: 'Bootstrap',
  //   icon: 'nb-gear',
  //   children: [
  //     {
  //       title: 'Form Inputs',
  //       link: '/pages/bootstrap/inputs',
  //     },
  //     {
  //       title: 'Buttons',
  //       link: '/pages/bootstrap/buttons',
  //     },
  //     {
  //       title: 'Modal',
  //       link: '/pages/bootstrap/modal',
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   icon: 'nb-bar-chart',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/pages/charts/echarts',
  //     },
  //     {
  //       title: 'Charts.js',
  //       link: '/pages/charts/chartjs',
  //     },
  //     {
  //       title: 'D3',
  //       link: '/pages/charts/d3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables',
  //   icon: 'nb-tables',
  //   children: [
  //     {
  //       title: 'Smart Table',
  //       link: '/pages/tables/smart-table',
  //     },
  //   ],
  // },
  // {
  //   title: 'Miscellaneous',
  //   icon: 'nb-shuffle',
  //   children: [
  //     {
  //       title: '404',
  //       link: '/pages/miscellaneous/404',
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth',
  //   icon: 'nb-locked',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
