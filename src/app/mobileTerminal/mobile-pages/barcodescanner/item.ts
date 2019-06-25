export interface Item {
  id: number;
  overTime:string;//交坯日期
  overPeople:string;//交坯员
  serviceTime:string;//检修日期
  servicePeople:string;//检修员
  cadreTime:string;//干补日期
  cadrePeople:string;//干补员
  cadreType:string;//干补类型
  storageLocation:string;//库位
  greenLibrary:string;//入青坯库
  slabWarehouse:string;//青坯仓管
  greyOutbound:string;//青坯出库
  outboundWarehouse:string;//出库仓管

  glazeTime:string;//施釉日期
  glazePeople:string;//施釉员工
  sglazeTime:string;//舒施釉日期
  sglazePeople:string;//舒施釉员工
  cleanGlazeTime:string;//自洁釉日期
  cleanGlazePeople:string;//自洁釉员工
  writeLibrary:string;//入白坯库
  writeWarehouse:string;//白坯仓管
  writeOutbound:string;//白坯出库
  outboundPeople:string;//出库员工

  encastageTime:string;//装窑日期
  encastagePeople:string;//装窑员工
  encastageTeam:string;//装窑班组
  encastageClass:string;//装窑班别
  checkTime:string;//点检日期
  checkPeople:string;//点检员工
  kilnStartime:string;//入窑日期
  kilnEndtime:string;//出窑日期
  unloadingKilnTime:string;//卸窑日期
  unloadingKilnPeople:string;//卸窑员工

  qcTime:string;//品检日期
  qcPeople:string;//品检员工
  isGood:string;//是否良品
  isReburn:string;//是否进行二次烧
  packTime:string;//包装日期
  packPeople:string;//包装员工

}
