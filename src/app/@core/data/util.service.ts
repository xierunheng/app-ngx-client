import { Injectable } from '@angular/core';
import * as _ from 'lodash';

//应用相关数据
@Injectable()
export class UtilData {
  public static systemObj = {
    hs: {
      text: 'hs',
      name: '层级结构',
    },
    personnel: {
      text: 'personnel',
      name: '员工',
    },
    equipment: {
      text: 'equipment',
      name: '设备',
    },
    material: {
      text: 'material',
      name: '物料',
    },
    para: {
      text: 'para',
      name: '参数',
    },
    opdef: {
      text: 'opdef',
      name: '操作定义',
    },
    kpi: {
      text: 'kpi',
      name: 'KPI',
    },
    physicalAsset: {
      text: 'physicalAsset',
      name: '工装',
    },
    energy: {
      text: 'energy',
      name: '能源',
    },
    sched: {
      text: 'sched',
      name: '维护计划',
    }
  };

  //正常的logo
  public static logo: string = '传奇陶瓷We系统';
  //简写的logo
  public static shortLogo: string = '传奇陶瓷';
  //详细完整的logo
  public static longLogo: string = '';

  //长时间格式 2018年01月23日 19:43
  public static longDateOpt = { year: 'numeric', month: 'long', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric' };

  //短时间格式 2018年01月23日
  public static shortDateOpt = { year: 'numeric', month: 'long', day: 'numeric' };

  //calendar的时间显示中文版（完整）
  public static zhFull = {
    firstDayOfWeek: 0,
    dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    today: '今天',
    clear: '清除'
  };

  //calendar的时间显示中文版
  public static zh = {
    firstDayOfWeek: 0,
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    today: '今天',
    clear: '清除'
  };

  //代替字符串，需要被替代的内容
  public static txtReplace = '*#*';

  //查看的自负表示，静态修改，可统一配置
  public static txtGet = '确定';

  //新建的字符表示，静态修改，可统一配置
  public static txtNew = '新建';

  //更新的字符表示，静态修改，可统一配置
  public static txtUpdate = '更新';

  //选择的字符表示，静态修改，可统一配置
  public static txtSelect = '选择';

  public static txtRelease = '布产';

  public static txtReleaseSingle = '单独布产';

  public static txtReleaseMulti = '联合布产';

  //get 的类型字符串，一般不需要修改，为了一致性，在此统一配置
  public static txtGetType = 'get';

  //create 的类型字符串，一般不需要修改，为了一致性，在此统一配置
  public static txtCreateType = 'create';

  //createby 的类型字符串，一般不需要修改，为了一致性，在此统一配置
  //createby 与 create 的区别在于，createby 有一个额外的参数，
  //作为 createby 创建的依据
  public static txtCreateByType = 'createby';

  //订单创建的物料批次
  public static txtCreateByJobType = 'createbyjob';

  //update 的类型字符串，一般不需要修改，为了一致性，在此统一配置
  public static txtUpdateType = 'update';

  //updatepart, update part of an object, 为了一致性，在此统一配置
  public static txtUpdatePartType = 'updateType';

  public static txtReleaseType = 'release';

  public static txtManageType = 'manage';

  //delete行 的提示说明，一般不需要修改，为了一致性，在此统一配置
  public static txtDeleteRowDes = '删除该行数据后，不可恢复，是否继续？';

  //delete属性 的提示说明，一般不需要修改，为了一致性，在此统一配置
  public static txtDeletePropDes = '该属性将被删除，是否继续？';

  //生产节拍的单位，表示一个Op或者一个Job的生产时间
  public static tuints: string[] = ['年', '月', '周', '天', '小时', '分钟', '秒'];



  //生产管理员的角色
  public static txtManager = '生产管理员';

  //公共生产元的角色
  public static txtPublic = '公共生产员';

  //超级管理员的角色
  public static txtSuper = '超级管理管';

  //组长的角色
  public static txtTeamLeader = '组长';

  //标准的属性标签
  public static txtTags = ['tag', '员工属性', '设备属性', '物料属性', '缺陷',
    '瓷土', '瓷釉', '成型', '修坯', '喷釉',
    '登窑', '烧成', '报警属性', '其他', '工序属性',
    '操作项属性', '订单属性', '检验项', '半检', '报废',
    '成检', '巡检'];

  public static tags = {
    tag: {
      text: 'tag',
      name: 'tag',
    },
    person: {
      text: 'person',
      name: '员工属性',
    },
    equipment: {
      text: 'equipment',
      name: '设备属性',
    },
    material: {
      text: 'material',
      name: '物料属性',
    },
    defect: {
      text: 'defect',
      name: '缺陷',
    },
    ct: {
      text: 'ct',
      name: '瓷土',
    },
    cj: {
      text: 'cj',
      name: '瓷釉',
    },
    mold: {
      text: 'mold',
      name: '成型',
    },
  }

  /**
   * [终端操作可能出现的错误]
   * trans: 有限状态机报错，状态转移错误
   * mismatch: 物料不匹配，扫描的物料与订单需求不匹配
   * molder: 成型工扫的条码与成型工自己不匹配，扫了别人的条码
   * color：喷釉颜色不匹配
   * invalid: 无效的条码
   * repeat: 重复条码
   * kiln: 窑炉不匹配
   * repair: 修复方式不匹配
   * @type {Array}
   */
  public static terminalErrs = ['trans', 'mismatch', 'molder', 'color', 'invalid', 'repeat', 'kiln', 'repair', 'order', ''];

  /**
   * [终端操作的警告信息]
   * emptyKiln: 窑炉信息为空
   * emptyMdef： 物料定义不完
   * emptyMdefKiln：以上两者
   * @type {Array}
   */
  public static terminalWarnings = ['emptyKiln', 'emptyMdef', 'emptyMdefKiln', ''];

  /**
   * [ run for jobOrder running
   * qc for quality control
   * sc for scrap
   * err for error]
   * @type {Array}
   */
  public static terminalStates = ['run', 'qc', 'sc', 'err', 'warning'];

  public static terminalCategorys = ['电子看板', '检验终端', '巡视终端', '大屏'];
  public static terminalSizes = ['5*7', '12*16'];
  public static terminalResolutions = ['600*800', '600*900'];

  /**
   * [成型工的字符串]
   * @type {String}
   */
  public static txtMolder = '成型工';

  /**
   * [成品的字符床]
   * @type {String}
   */
  public static txtProduct = '成品';

  /**
   * [坯体的字符串]
   * @type {String}
   */
  public static txtPT = '坯体';

  /**
   * [模具的字符串]
   * @type {String}
   */
  public static txtMJ = '模具';

/**
 * [备品备件的字符串]
 * @type {String}
 */
  public static txtBJ = '备品备件';

  /**
   * [纸箱的字符串]
   * @type {String}
   */
  public static txtZX = '纸箱';

  /**
   * [托盘的字符串]
   * @type {String}
   */
  public static txtTP = '托盘';

  //HierarchyScope Levels
  public static hsLevels: string[] = ['Enterprise', 'Site', 'Area',
    'ProcessCell', 'Unit', 'ProductionLine', 'WorkCell', 'ProductionUnit',
    'StorageZone', 'StorageUnit', 'StorageLocation', 'WorkCenter', 'WorkUnit',
    'EquipmentModule', 'ControlModule', 'Other'];

  public static hsLevelTree: any = {
    text: 'Enterprise',
    value: 'Enterprise',
    checked: false,
    children: [{ text: 'Site',
      value: 'Site',
      checked: false,
      children: [{ text: 'Area',
        value: 'Area',
        checked: false,
        children: [{ text: 'WorkCenter',
          value: 'WorkCenter',
          checked: false,
          children: [{ text: 'WorkUnit',
            value: 'WorkUnit',
            checked: false
          }]
        }, { text: 'StorageZone',
          value: 'StorageZone',
          checked: false,
          children: [{ text: 'StorageUnit',
            value: 'StorageUnit',
            checked: false
          }]
        }, { text: 'ProductionLine',
          value: 'ProductionLine',
          checked: false,
          children: [{ text: 'WorkCell',
            value: 'WorkCell',
            checked: false
          }]
        }, { text: 'ProcessCell',
          value: 'ProcessCell',
          checked: false,
          children: [{ text: 'Unit',
            value: 'Unit',
            checked: false
          }]
        }, { text: 'ProductionUnit',
          value: 'ProductionUnit',
          checked: false,
          children: [{ text: 'Unit',
            value: 'Unit',
            checked: false
          }]
        }] // children of Area
      }] // children of Site
    }]  // children of Enterprise
  };
}

//物料相关数据
@Injectable()
export class MaterialData {
  //物料装配类型
  public static assemblyTypes = ['Physical', 'Logical', 'Other', ''];
  //物料装配关系
  public static assemblyRelations = ['Permanent', 'Transient', 'Other', ''];
  //物料批次或者物料子批次的状态
  public static statuses = ['released', 'approved', 'blocked', 'in process', 'in quality check', 'scraped'];
  //使用类型
  public static useTypes = ['Consumed', 'Produced', 'Consumable', 'Replaced Asset', 'Replacement Asset',
    'Sample', 'Returned Sample', 'Carrier', 'Returned Carrier', 'Other', ''];

  //material use type for production operations
  public static pUseTypes = ['Consumed', 'Produced', 'Consumable', 'Other', ''];
  //material use type for maintenance operations
  public static mUseTypes = ['Consumable', 'Replaced Asset', 'Replacement Asset', 'Other', ''];
  //material use type for quality operations
  public static qUseTypes = ['Consumable', 'Sample', 'Returned Sample', 'Other', ''];
  //material use type for inventory operations
  public static iUseTypes = ['Consumable', 'Carrier', 'Returned Carrier', 'Other', ''];

  //终端操作相关的所有内容，包括字符/名称/状态/URL
  public static BodyOps = {
    create: {
      text: 'create',
      name: '创建',
      pre: '',
      oper: '',
      state: 'Created',
      desc: '已创建',
      url: ''
    },
    mold: {
      text: 'mold',
      name: '成型',
      pre: '',
      oper: '成型工',
      state: 'Molded',
      desc: '已成型',
      url: '/terminals/molding',
    },
    remold: {
      text: 'remold',
      name: '型号更换',
      pre: '',
      oper: '成型工',
      state: 'Molded',
      desc: '已成型',
      url: ''
    },
    dry: {
      text: 'dry',
      name: '干燥',
      pre: '',
      oper: '',
      state: 'Dried',
      desc: '已干燥',
      url: '',
    },
    trim: {
      text: 'trim',
      name: '修坯',
      pre: '成型',
      oper: '修坯工',
      state: 'Trimed',
      desc: '已修坯',
      url: '/terminals/jobOrder/trimming',
    },
    mgtrim: {
      text: 'mgtrim',
      name: '管理员修坯',
      pre: '成型',
      oper: '生产管理员',
      state: 'Trimed',
      desc: '已修坯',
      url: '',
    },
    glaze: {
      text: 'glaze',
      name: '喷釉',
      pre: '修坯',
      oper: '喷釉工',
      state: 'Glazed',
      desc: '已喷釉',
      url: '/terminals/jobOrder/glazing',
    },
    reglaze: {
      text: 'reglaze',
      name: '颜色更换',
      pre: '喷釉',
      oper: '喷釉工',
      state: 'Glazed',
      desc: '已喷釉',
      url: '',
    },
    grind: {
      text: 'grind',
      name: '刮脚',
      pre: '喷釉',
      oper: '刮脚工',
      state: 'Ground',
      desc: '已刮脚',
      url: '/terminals/jobOrder/grinding',
    },
    load: {
      text: 'load',
      name: '登窑',
      pre: '刮脚',
      oper: '登窑工',
      state: 'Loaded',
      desc: '已登窑',
      url: '/terminals/jobOrder/loading',
    },
    unload: {
      text: 'unload',
      name: '退出',
      pre: '登窑',
      oper: '登窑工',
      state: 'Ground',
      desc: '已刮脚',
      url: '',
    },
    fire: {
      text: 'fire',
      name: '窑烧',
      pre: '登窑',
      oper: '烧火工',
      state: 'Fired',
      desc: '已窑烧',
      url: '',
    },
    draw: {
      text: 'draw',
      name: '卸窑',
      pre: '窑烧',
      oper: '',
      state: 'Drawed',
      desc: '已卸窑',
      url: '',
    },
    undo: {
      text: 'undo',
      name: '反扫码',
      state: 'Defective',
      desc: '有缺陷',
      url: '',
    },
    qc: {
      text: 'qc',
      name: '质检',
      oper: '质检员',
      state: 'Checked',
      desc: '优等品',
      url: '/terminals/qc',
    },
    wgqc: {
      text: 'wgqc',
      name: '外购质检',
      oper: '质检员',
      state: 'Checked',
      desc: '优等品',
      url: '/terminals/qc',
    },
    wxqc: {
      text: 'wxqc',
      name: '外协质检',
      oper: '质检员',
      state: 'Checked',
      desc: '优等品',
      url: '/terminals/qc',
    },
    pass: {
      text: 'pass',
      name: '等外',
      state: 'NG',
      desc: '等外品',
      url: '',
    },
    reject: {
      text: 'reject',
      name: '缺陷',
      state: 'Defective',
      desc: '有缺陷',
      url: '',
    },
    suspend: {
      text: 'suspend',
      name: '暂缓',
      state: 'Suspending',
      desc: '已隔离',
      url: '',
    },
    renew: {
      text: 'renew',
      name: '返修',
      state: 'Renewed',
      desc: '已返修',
      url: '',
    },
    repair: {
      text: 'repair',
      name: '修复',
      state: 'Repaired',
      desc: '已修复',
      url: '/terminals/repair',
    },
    recovery: {
      text: 'recovery',
      name: '恢复',
      state: 'OK',
      desc: '再检优等品',
      url: '',
    },
    edge: {
      text: 'edge',
      name: '磨边',
      oper: '磨边工',
      state: 'Edged',
      desc: '已磨边',
      url: '/terminals/edging',
    },
    scrap: {
      text: 'scrap',
      name: '报废',
      state: 'Scraped',
      desc: '已报废',
      url: '',
    },
    pqc: {
      text: 'pqc',
      name: '装检',
      state: 'OK',
      desc: '优等品',
      url: '',
    },
    pack: {
      text: 'pack',
      name: '包装',
      oper: '包装工',
      state: 'Packed',
      desc: '已包装',
      url: '/terminals/packing',
    },
    packcarrier: {
      text: 'packcarrier',
      name: '包材包装',
      oper: '包装工',
      state: 'PackedCarrier',
      desc: '已包装',
      url: '',
    },
    unpack: {
      text: 'unpack',
      name: '退包',
      pre: '包装',
      oper: '包装工',
      state: 'Checked',
      desc: '优等品',
      url: '',
    },
    palletize: {
      text: 'palletize',
      name: '打托',
      oper: '包装工',
      state: 'Palletized',
      desc: '已打托',
      url: '/terminals/palletizing',
    },
    palletizecarrier: {
      text: 'palletizecarrier',
      name: '包材打托',
      oper: '包装工',
      state: 'PalletizedCarrier',
      desc: '已打托',
      url: '',
    },
    unpalletize: {
      text: 'unpalletize',
      name: '退托',
      pre: '打托',
      oper: '包装工',
      state: 'Packed',
      desc: '已包装',
      url: '',
    },
    trunk: {
      text: 'trunk',
      name: '装车',
      oper: '包装工',
      state: 'Trunked',
      desc: '已装车',
      url: '/terminals/trunking',
    },
    replace: {
      text: 'replace',
      name: '坯体替换',
      state: '',
      desc: '已替换',
      url: '',
    },
    track: {
      text: 'track',
      name: '巡检',
      state: '',
      desc: '',
      url: '/terminals/track',
    },
    gc: {
      text: 'gc',
      name: '配釉检测',
      state: '',
      desc: '',
      url: '/terminals/gc',
    },
    idle: {
      text: 'idle',
      name: '停滞',
      state: 'Idle',
      desc: '已停滞',
      url: '',
    },
    inventory: {
      text: 'inventory',
      name: '盘点',
      state: 'Inventoried',
      desc: '已盘点',
      url: '/terminals/inventory',
    },
    invqc: {
      text: 'invqc',
      name: '优等盘点',
      state: 'Checked',
      desc: '优等品',
      url: ''
    },
    invpass: {
      text: 'invpass',
      name: '等外盘点',
      state: 'NG',
      desc: '等外品',
      url: '',
    },
    invscrap: {
      text: 'invscrap',
      name: '报废盘点',
      state: 'Scraped',
      desc: '已报废',
      url: '',
    },
  };

}

//设备静态数据
export class EquipData {
  //设备状态
  public static statuses = ['正常运行', '故障', '正常停机'];
  //设备维护操作名称
  public static ops = ['维修', '保养'];

    /**
   * [窑炉终端的PLC数采数据的的参数对应表]
   * @type {Object}
   */
  public static plcKiln = {
    kiln1: {
      text: '窑炉1#',
      table: 'kiln1_data',
      WKFL: {
        name: '燃气工况流量',
        para: 'kiln_data.kiln_saPLC.1WKFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      STFL: {
        name: '燃气标况流量',
        para: 'kiln_data.kiln_saPLC.1STFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      SP2W: {
        name: '风机压力',
        para: 'kiln_data.kiln_saPLC.1SP2W',
        unit: 'kPa',
        desc: '*60/27648'
      },
      SP1G: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.1SP1G',
        unit: 'kPa',
        desc: '*60/27648'
      },
      PT4: {
        name: '温度4',
        para: 'kiln_data.kiln_saPLC.1PT4',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT3: {
        name: '温度3',
        para: 'kiln_data.kiln_saPLC.1PT3',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT2: {
        name: '温度2',
        para: 'kiln_data.kiln_saPLC.1PT2',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT1: {
        name: '温度1',
        para: 'kiln_data.kiln_saPLC.1PT1',
        unit: '℃',
        desc: '*1600/27648'
      },
      GTOTAL: {
        name: '燃气总量',
        para: 'kiln_data.kiln_saPLC.1GTOTAL',
        unit: 'm³',
        desc: '采集自燃气表'
      },
      GSTP: {
        name: '燃气温度',
        para: 'kiln_data.kiln_saPLC.1GSTP',
        unit: '℃',
        desc: '采集自燃气表'
      },
      GSPR: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.1GSPR',
        unit: 'kPa',
        desc: '采集自燃气表'
      },
      FRQ: {
        name: '风机频率',
        para: 'kiln_data.kiln_saPLC.1FRQ',
        unit: 'Hz',
        desc: '*50/27648'
      },
    },
    kiln2: {
      text: '窑炉2#',
      table: 'kiln2_data',
      WKFL: {
        name: '燃气工况流量',
        para: 'kiln_data.kiln_saPLC.2WKFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      STFL: {
        name: '燃气标况流量',
        para: 'kiln_data.kiln_saPLC.2STFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      SP2W: {
        name: '风机压力',
        para: 'kiln_data.kiln_saPLC.2SP2W',
        unit: 'kPa',
        desc: '*60/27648'
      },
      SP1G: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.2SP1G',
        unit: 'kPa',
        desc: '*60/27648'
      },
      PT4: {
        name: '温度4',
        para: 'kiln_data.kiln_saPLC.2PT4',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT3: {
        name: '温度3',
        para: 'kiln_data.kiln_saPLC.2PT3',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT2: {
        name: '温度2',
        para: 'kiln_data.kiln_saPLC.2PT2',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT1: {
        name: '温度1',
        para: 'kiln_data.kiln_saPLC.2PT1',
        unit: '℃',
        desc: '*1600/27648'
      },
      GTOTAL: {
        name: '燃气总量',
        para: 'kiln_data.kiln_saPLC.2GTOTAL',
        unit: 'm³',
        desc: '采集自燃气表'
      },
      GSTP: {
        name: '燃气温度',
        para: 'kiln_data.kiln_saPLC.2GSTP',
        unit: '℃',
        desc: '采集自燃气表'
      },
      GSPR: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.2GSPR',
        unit: 'kPa',
        desc: '采集自燃气表'
      },
      FRQ: {
        name: '风机频率',
        para: 'kiln_data.kiln_saPLC.2FRQ',
        unit: 'Hz',
        desc: '*50/27648'
      },
    },
    kiln3: {
      text: '窑炉3#',
      table: 'kiln_data1106',
      WKFL: {
        name: '燃气工况流量',
        para: 'kiln_data.kiln_saPLC.3WKFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      STFL: {
        name: '燃气标况流量',
        para: 'kiln_data.kiln_saPLC.3STFL',
        unit: 'm³/h',
        desc: '采集自燃气表'
      },
      SP2W: {
        name: '风机压力',
        para: 'kiln_data.kiln_saPLC.3SP2W',
        unit: 'kPa',
        desc: '*60/27648'
      },
      SP1G: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.3SP1G',
        unit: 'kPa',
        desc: '*60/27648'
      },
      PT4: {
        name: '温度4',
        para: 'kiln_data.kiln_saPLC.3PT4',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT3: {
        name: '温度3',
        para: 'kiln_data.kiln_saPLC.3PT3',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT2: {
        name: '温度2',
        para: 'kiln_data.kiln_saPLC.3PT2',
        unit: '℃',
        desc: '*1600/27648'
      },
      PT1: {
        name: '温度1',
        para: 'kiln_data.kiln_saPLC.3PT1',
        unit: '℃',
        desc: '*1600/27648'
      },
      GTOTAL: {
        name: '燃气总量',
        para: 'kiln_data.kiln_saPLC.3GTOTAL',
        unit: 'm³',
        desc: '采集自燃气表'
      },
      GSTP: {
        name: '燃气温度',
        para: 'kiln_data.kiln_saPLC.3GSTP',
        unit: '℃',
        desc: '采集自燃气表'
      },
      GSPR: {
        name: '燃气压力',
        para: 'kiln_data.kiln_saPLC.3GSPR',
        unit: 'kPa',
        desc: '采集自燃气表'
      },
      FRQ: {
        name: '风机频率',
        para: 'kiln_data.kiln_saPLC.3FRQ',
        unit: 'Hz',
        desc: '*50/27648'
      },
    },
    weather: {
      text: '厂外环境',
      table: 'weather_data1109',
      TEMP: {
        name: '厂外实时温度',
        para: 'kiln_data.kiln_saPLC.TEMP',
        unit: '℃',
        desc: '/10'
      },
      DIR: {
        name: '厂外实时风向',
        para: 'kiln_data.kiln_saPLC.WIND_DIR',
        unit: '°',
        desc: '25为西风、115为北风、205为东风、295为南风、25-115之间为西北风、115-205之间为东北风、205-295之间为东南风、0-25和295-360之间为西南风'
      },
      SPD: {
        name: '厂外实时风速',
        para: 'kiln_data.kiln_saPLC.WIND_SPD',
        unit: 'm/s',
        desc: '/10'
      },
      HUMI: {
        name: '厂外实时湿度',
        para: 'kiln_data.kiln_saPLC.HUMI',
        unit: '%RH',
        desc: '/10'
      },
      PRES: {
        name: '厂外实时大气压强',
        para: 'kiln_data.kiln_saPLC.PRES',
        unit: 'hPa',
        desc: '/10'
      },
      RAIN: {
        name: '雨量',
        para: 'kiln_data.kiln_saPLC.RAIFALL',
        unit: 'mm',
        desc: '/10'
      },
    }
  };
}

//操作相关数据
export class WorkData {
  //员工使用类型
  /**
   * [员工适用类型
   * allocated: 安排工作
   * move: 搬坯]
   * @type {Array}
   */
  public static personnelUses = ['allocated', 'move'];
  //设备使用类型
  public static equipmentUses = ['allocated', 'maintenance'];
  //设备维护类型
  public static mtypes = ['维护', '修理', '校准', '报废'];
  //能力类型
  public static capTypes = ['used', 'unused', 'total', 'available', 'unattainable', 'committed'];
  //操作类型或者作业类型
  public static opTypes = ['Production', 'Maintenance', 'Quality', 'Inventory', 'Mixed', 'Other'];

  //KPI参数
  public static trend = ['Higher-is-better', 'Lower-is-better', 'Other', ''];
  public static timing = ['Real-time', 'Periodically', 'On-demand', 'Other', ''];
  public static audience = ['Operator', 'Supervisor', 'Management', ''];
  public static prodMethodology = ['Batch', 'Continuous', 'Discrete', 'Other', ''];


  /**
   * [工单运行命令集]
   * @type {Object}
   */
  public static JobCmds = {
    start: {
      text: 'start',
      name: '开工',
      state: 'Running',
      post: 'hold',
      desc: '运行中',
    },
    complete: {
      text: 'complete',
      name: '完工',
      state: 'Completed',
      post: '',
      desc: '已完工',
    },
    stop: {
      text: 'stop',
      name: '停止',
      state: 'Stopped',
      post: 'reset',
      desc: '已停止',
    },
    hold: {
      text: 'hold',
      name: '暂停',
      state: 'Held',
      post: 'restart',
      desc: '已暂停',
    },
    restart: {
      text: 'restart',
      name: '继续',
      state: 'Running',
      post: 'hold',
      desc: '运行中',
    },
    abort: {
      text: 'abort',
      name: '中止',
      state: 'Aborted',
      post: 'reset',
      desc: '已中止',
    },
    reset: {
      text: 'reset',
      name: '重置',
      state: 'Ready',
      post: 'start',
      desc: '已准备',
    },
    pause: {
      text: 'pause',
      name: '中断',
      state: 'Paused',
      post: 'resume',
      desc: '已中断',
    },
    resume: {
      text: 'resume',
      name: '恢复',
      state: 'Running',
      post: 'pause',
      desc: '运行中',
    },
  };

  //工单或操作的状态，在原有文本的基础上，增加其他字段，方便统一替换或统一管理
  public static WorkStates = {
    Ready: {
      text: 'Ready',
      status: 'info',
      txtClass: 'text-info',
    },
    Running: {
      text: 'Running',
      status: 'primary',
      txtClass: 'text-primary'
    },
    Completed: {
      text: 'Completed',
      status: 'success',
      txtClass: 'text-success'
    },
    Stopped: {
      text: 'Stopped',
      status: 'danger',
      txtClass: 'text-danger'
    },
    Held: {
      text: 'Held',
      status: 'warning',
      txtClass: 'text-warning'
    },
    Paused: {
      text: 'Paused',
      status: 'warning',
      txtClass: 'text-warning'
    },
    Aborted: {
      text: 'Aborted',
      status: 'info',
      txtClass: 'text-info'
    }
  };

  //工单的分配状态
  //Received：已收到，但未排产
  //Forecast：预排产
  //Released：已排产
  public static dispatchStatus = ['Received', 'Forecast', 'Released'];

  //请求状态
  public static reqStates = ['Forecast', 'Released', 'Distributed'];

  //报警处理状态
  public static alertStates = ['To be processed', 'Processing', 'Processed', 'Not processed yet'];

  //计划状态
  public static scheduleStates = ['Forecast', 'Released', ''];

  //可执行的命令
  public static commands: string[] = ['start', 'complete', 'stop', 'hold', 'restart', 'abort',
    'reset', 'pause', 'resume', ''];
  //所有工序之间的可能存在的依赖关系
  public static dependencies: string[] = ['NotFollow', 'PossibleParallel', 'NotInParallel',
    'AtStart', 'AfterStart', 'AfterEnd', 'NoLaterAfterStart',
    'NoEarlierAfterStart', 'NoLaterAfterEnd', 'NoEarlierAfterEnd', 'Other', ''];
}

export class TableSettings {
  //ng2-smart-table的Settings，在界面风格不变的情况下，这些是不变的
  public static basic = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
    },
    noDataMessage: '暂时未有相关属性。',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      // confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      // confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      // confirmDelete: true,
    },
    mode: 'external',
    selectMode: '',
    columns: {},
    pager: {
      display: true,
      perPage: 10
    }
  };

  public static editBasic = {
    actions: {
      columnTitle: '操作',
      add: false,
      edit: true,
      delete: false,
    },
    noDataMessage: '暂时未有相关属性。',
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    mode: 'external',
    selectMode: '',
    columns: {},
    pager: {
      display: true,
      perPage: 10
    }
  };

  //ng2-smart-table 的弹出窗口呈现模式
  public static exMode = 'external';
  public static inMode = 'inline';

  //员工列呈现属性
  public static pColumns = {
    oid: {
      title: '规格名称',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    pclass: {
      title: '员工类型',
      type: 'string',
      valuePrepareFunction: (pclass, row) => {
        return row.pclass ? row.pclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    person: {
      title: '员工',
      type: 'string',
      valuePrepareFunction: (person, row) => {
        return row.person ? row.person.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    use: {
      title: '使用类型',
      type: 'string',
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? `${row.qty.quantity}${row.qty.unit}` : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit &&
          `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
  };

  public static jobResColumns = {
    oid: {
      title: 'ID',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    workType: {
      title: '类型',
      type: 'string',
    },
    hs: {
      title: '层级结构',
      type: 'string',
      valuePrepareFunction: (hs, row) => {
        return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
      },
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty && row.qty.quantity ? row.qty.quantity + row.qty.unit : '';
      },
    },
    startTime: {
      title: '起始时间',
      type: 'string',
      valuePrepareFunction: (startTime, row) => {
        return row.startTime ? new Date(row.startTime).toLocaleDateString('zh', UtilData.longDateOpt) : '';
      },
    },
    endTime: {
      title: '结束时间',
      type: 'string',
      valuePrepareFunction: (endTime, row) => {
        return row.endTime ? new Date(row.endTime).toLocaleDateString('zh', UtilData.longDateOpt) : '';
      },
    },
    jobState: {
      title: '状态',
      type: 'string',
    },
  }

  public static segResColumns = {
    oid: {
      title: '名称',
      type: 'string',
    },
    actSTime: {
      title: '实际起时',
      type: 'string',
      valuePrepareFunction: (actSTime, row) => {
        return row.actSTime ?
          new Date(row.actSTime).toLocaleDateString('zh', UtilData.longDateOpt) : '';
      },
    },
    actETime: {
      title: '实际终时',
      type: 'string',
      valuePrepareFunction: (actETime, row) => {
        return row.actETime ?
          new Date(row.actETime).toLocaleDateString('zh', UtilData.longDateOpt) : '';
      },
    },
    state: {
      title: '段响应状态',
      type: 'string',
    },
    jobResponse: {
      title: '工单执行',
      type: 'html',
      valuePrepareFunction: (jobResponse, row) => {
        return row.jobResponse ?
          `<a href="/#/pages/works/jobresponse/${row.jobResponse._id}" routerLinkActive="active">${row.jobResponse.oid}</a>` : '';
      }
    }
  };

  //设备列呈现属性
  public static eColumns = {
    oid: {
      title: '规格名称',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    eclass: {
      title: '设备类型',
      type: 'string',
      valuePrepareFunction: (eclass, row) => {
        return row.eclass ? row.eclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    equipment: {
      title: '设备',
      type: 'string',
      valuePrepareFunction: (equipment, row) => {
        return row.equipment ? row.equipment.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    use: {
      title: '使用类型',
      type: 'string',
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? `${row.qty.quantity}${row.qty.unit}` : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit &&
          `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
  };

  //物料列呈现属性，只包含了'物料类型'和'物料', 没有包含‘物料批次’和‘物料子批次’
  public static mColumns = {
    oid: {
      title: '规格名称',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    mclass: {
      title: '物料类型',
      type: 'string',
      valuePrepareFunction: (mclass, row) => {
        return row.mclass ? row.mclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    mdef: {
      title: '物料',
      type: 'string',
      valuePrepareFunction: (mdef, row) => {
        return row.mdef ? row.mdef.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    use: {
      title: '使用类型',
      type: 'string',
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? row.qty.quantity + row.qty.unit : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit &&
          `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
  };

  //参数列属性
  public static resPropColumns = {
    oid: {
      title: '名称',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    value: {
      title: '值',
      type: 'string',
      valuePrepareFunction: (value, row) => {
        return row.value ? row.value.valueStr + row.value.unit : '';
      },
    },
    active: {
      title: '可用',
      filter: {
        type: 'checkbox',
        config: {
          true: 'true',
          false: 'false',
          resetText: '重置',
        },
      },
      editor: {
        type: 'checkbox',
      }
    },
  };

  //属性列属性
  public static opPropColumns = {
    oid: {
      title: '名称',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    value: {
      title: '值',
      type: 'string',
      valuePrepareFunction: (value, row) => {
        return row.value ? row.value.valueStr + row.value.unit : '';
      },
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? row.qty.quantity + row.qty.unit : '';
      },
    },
    active: {
      title: '可用',
      filter: {
        type: 'checkbox',
        config: {
          true: 'true',
          false: 'false',
          resetText: '重置',
        },
      },
      editor: {
        type: 'checkbox',
      }
    },
  };

  public static getPspecColumns(): any {
    return TableSettings.pColumns;
  }

  public static getEspecColumns(): any {
    return TableSettings.eColumns;
  }

  public static getMspecColumns(): any {
    return TableSettings.mColumns;
  }

  public static getProdspecColumns(): any {
    let cols = { ...TableSettings.mColumns };
    cols['para'] = {
      title: '颜色',
      type: 'string',
      valuePrepareFunction: (para, row) => {
        let color = row.para ? row.para.find(item => item.oid === '颜色') : undefined;
        return color ? color.value.valueStr : '';
      },

    };
    return cols;
  }

  public static getPopColumns(): any {
    let cols = { ...TableSettings.pColumns };
    cols['hs'] = {
      title: '层级结构',
      type: 'string',
      valuePrepareFunction: (hs, row) => {
        return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
      },
      filterFunction: (value, search) => {
        return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
      }
    },
    cols['pclass'] = {
      title: '员工类型',
      type: 'string',
      valuePrepareFunction: (pclass, row) => {
        return row.pclass ? row.pclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    };
    return cols;
  }

  public static getEopColumns(): any {
    let cols = { ...TableSettings.eColumns };
    cols['hs'] = {
      title: '层级结构',
      type: 'string',
      valuePrepareFunction: (hs, row) => {
        return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
      },
      filterFunction: (value, search) => {
        return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
      }
    };
    return cols;
  }

  public static getMopColumns(): any {
    let cols = { ...TableSettings.mColumns };
    cols['lot'] = {
      title: '批次',
      type: 'string',
      valuePrepareFunction: (lot, row) => {
        return row.lot ? row.lot.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    };
    cols['subLot'] = {
      title: '子批次',
      type: 'string',
      valuePrepareFunction: (subLot, row) => {
        return row.subLot ? row.subLot.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    };
    cols['mclass'] = {
      title: '物料类型',
      type: 'string',
      valuePrepareFunction: (mclass, row) => {
        return row.mclass ? row.mclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    cols['hs'] = {
      title: '层级结构',
      type: 'string',
      valuePrepareFunction: (hs, row) => {
        return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
      },
      filterFunction: (value, search) => {
        return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
      }
    };
    return cols;
  }

  public static getPcapColumns(): any {
    let cols = TableSettings.getPopColumns();
    cols['capType'] = {
      title: '能力类型',
      type: 'string',
    };
    cols['reason'] = {
      title: '原因',
      type: 'string',
    };
    cols['conFactor'] = {
      title: '可信度',
      type: 'number',
    };
    cols['startTime'] = {
      title: '起始时间',
      type: 'date',
    };
    cols['endTime'] = {
      title: '结束时间',
      type: 'date',
    };

    return cols;
  }

  public static getEcapColumns(): any {
    let cols = TableSettings.getEopColumns();
    cols['capType'] = {
      title: '能力类型',
      type: 'string',
    };
    cols['reason'] = {
      title: '原因',
      type: 'string',
    };
    cols['conFactor'] = {
      title: '可信度',
      type: 'number',
    };
    cols['startTime'] = {
      title: '起始时间',
      type: 'date',
    };
    cols['endTime'] = {
      title: '结束时间',
      type: 'date',
    };

    return cols;
  }

  public static getMcapColumns(): any {
    let cols = TableSettings.getMopColumns();
    cols['capType'] = {
      title: '能力类型',
      type: 'string',
    };
    cols['reason'] = {
      title: '原因',
      type: 'string',
    };
    cols['conFactor'] = {
      title: '可信度',
      type: 'number',
    };
    cols['startTime'] = {
      title: '起始时间',
      type: 'date',
    };
    cols['endTime'] = {
      title: '结束时间',
      type: 'date',
    };

    return cols;
  }

  public static getCapPropColumns(): any {
    let cols = { ...TableSettings.opPropColumns };
    cols['quantity'] = {
      title: '时长',
      type: 'string',
      valuePrepareFunction: (quantity, row) => {
        return row.quantity ? row.quantity.quantity + row.quantity.unit : '';
      },
    };

    return cols;
  }
}

//ID通用的比较函数，没有特别指明，就用该函数作为 Object 的比较函数
export function IDCmpFn(o1: any, o2: any): boolean {
  return o1 && o2 && o1._id && o2._id ? o1._id === o2._id : o1 == o2;
}

//OID通用的比较函数，没有特别指明，就用该函数作为 Object 的比较函数
export function OIDCmpFn(o1: any, o2: any): boolean {
  return o1 && o2 && o1.oid && o2.oid ? o1.oid === o2.oid : o1 == o2;
}

export function NameCmpFn(o1: any, o2: any): boolean {
  return o1 && o2 && o1.name && o2.name ? o1.name === o2.name : o1 == o2;
}

export function winSize():string{
  //获取浏览器窗口的可视区域的高度
    let height: number = document.body.clientHeight;
    let ssize: string;
     //根据高度大小确定弹窗的大小
    if ( height > 816 ) {
      ssize = 'xxlarge';
    } else if ( height > 696 ) {
      ssize = 'xlarge';
    } else if (height > 576 ) {
      ssize = 'large';
    } else {
      ssize = 'medium';
    }
    return ssize;
}

