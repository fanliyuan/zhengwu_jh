import { stringify } from 'qs';
import request from '@/utils/request';

// 搜索资源列表
export async function initDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasources?${stringify(params)}`);
}

// 新建数据源
export async function addDataSource(params) {
  return request('/api/api/v2/zhengwu/swap/datasource', {
    method: 'POST',
    body: params,
  });
}

// 删除数据源
export async function deleteDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 修改数据源
export async function updateDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 查看数据源详情
export async function viewDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`);
}

// 连接测试
export async function connectBase(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/connect?${stringify(params)}`);
}

// 判断数据名称是否存在
export async function isSameNameData(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/data/name?${stringify(params)}`);
}

// 判断数据源名称是否存在
export async function isSameNameSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/name?${stringify(params)}`);
}

// 文件下载
export async function download(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/file/down?${stringify(params)}`);
}

// 文件上传
export async function upload(params) {
  return request('/api/api/v2/zhengwu/swap/datasource/file/up', {
    method: 'POST',
    body: params,
  });
}

// 获取ftp的数据list
export async function ftpDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/ftp/data?${stringify(params)}`);
}

// 获取ftp的数据tree
export async function ftpDataTree(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/ftp/tree?${stringify(params)}`);
}

// 获取mysql指定库表的字段list
export async function mysqlColumnList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/column?${stringify(params)}`);
}

// 获取mysql指定库表的数据list
export async function mysqlDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/data?${stringify(params)}`);
}

// 获取mysql的数据库list
export async function mysqlDbList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/db?${stringify(params)}`);
}

// 获取mysql指定库的数据表list
export async function mysqlTableList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/table?${stringify(params)}`);
}

// 获取sftp的数据list
export async function sftpDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/sftp/data?${stringify(params)}`);
}

// 获取sftp的数据tree
export async function sftpDataTree(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/sftp/tree?${stringify(params)}`);
}

// 数据源（关系型数据库）数据接入
export async function accessDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}/db`, {
    method: 'POST',
    body: params.addDto,
  });
}

// 数据源（文件）数据接入
export async function accessFile(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}/file`, {
    method: 'POST',
    body: params.values,
  });
}

// 数据源（SFTP/FTP）数据接入
export async function accessFtp(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}/ftp`, {
    method: 'POST',
    body: params.addDto,
  });
}

// 搜索数据列表
export async function initDataSourceManagement(params) {
  return request(`/api/api/v2/zhengwu/swap/datas?${stringify(params)}`);
}

// 删除数据
export async function deleteDataSourceManagement(params) {
  return request(`/api/api/v2/zhengwu/swap/data/${params.type}/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 数据（关系数据库）详情
export async function viewDbDetail(params) {
  return request(`/api/api/v2/zhengwu/swap/data/db/${params}`);
}

// 数据（关系数据库）详情 （当前配置）
export async function viewDbDetailCurrent(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/db/${params}`);
}

// 修改数据（关系数据库）
export async function updateDb(params) {
  return request(`/api/api/v2/zhengwu/swap/data/db/${params.id}`, {
    method: 'PUT',
    body: params.addDto,
  });
}

// 数据（关系数据库）表数据list
export async function viewDbDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/db/${params.id}/data?${stringify(params.query)}`);
}

// 数据（关系数据库）表结构list
export async function viewDbStruct(params) {
  return request(`/api/api/v2/zhengwu/swap/data/db/${params.id}/struct`);
}

// 数据（关系数据库）表结构list（当前配置）
export async function viewDbStructCurrent(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/db/${params.id}/struct`);
}

// 数据（关系数据库）表数据导出
export async function exportDb(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/db/${params.id}/export?${stringify(params.query)}`
  );
}

// 批量下载数据（文件）文件项
export async function downloads(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/file/${params.id}/down`);
}

// 数据（文件）详情
export async function viewFileDetail(params) {
  return request(`/api/api/v2/zhengwu/swap/data/file/${params}`);
}

// 数据（文件）详情
export async function viewFileDetailCurrent(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/file/${params}`);
}

// 修改数据（文件）及其文件项
export async function updateFile(params) {
  return request(`/api/api/v2/zhengwu/swap/data/file/${params.id}`, {
    method: 'PUT',
    body: params.values,
  });
}

// 搜索数据（文件）文件项list
export async function initFileList(params) {
  return request(`/api/api/v2/zhengwu/swap/data/file/${params.id}/file`);
}

// 搜索数据（文件）文件项list
export async function initFileListCurrent(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/file/${params.id}/file?${stringify(params.query)}`
  );
}

// 数据（ftp）详情
export async function viewFtpDetail(params) {
  return request(`/api/api/v2/zhengwu/swap/data/ftp/${params}`);
}

// 数据（ftp）详情
export async function viewFtpDetailCurrent(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/ftp/${params}`);
}

// 修改数据（FTP）及其文件（夹）
export async function updateFtp(params) {
  return request(`/api/api/v2/zhengwu/swap/data/ftp/${params.id}`, {
    method: 'PUT',
    body: params.addDto,
  });
}

// 搜索数据（ftp）文件（夹）list
export async function initFtpList(params) {
  return request(`/api/api/v2/zhengwu/swap/data/ftp/${params.id}/ftpfile`);
}

// 搜索数据（ftp）文件（夹）list
export async function initFtpListCurrent(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/ftp/${params.id}/ftpfile?${stringify(params.query)}`
  );
}

// 查询审核日志
export async function searchReview(params) {
  return request(`/api/api/v2/zhengwu/swap/data/${params.type}/${params.id}/review`);
}

// 数据审核
export async function auditData(params) {
  return request(`/api/api/v2/zhengwu/swap/data/${params.type}/${params.id}/ftp`, {
    method: 'POST',
    body: params,
  });
}

// 查询同步计划
export async function searchTask(params) {
  return request(`/api/api/v2/zhengwu/swap/data/${params.dataType}/${params.params.id}/sync`);
}

// 查询同步基本信息(任务)

export async function getSyncBasic(params) {
  return request(`/api/api/v2/zhengwu/swap/dataR/${params.dataType}/${params.id}/task/basicInfo`);
}

// 查看运行日志
export async function viewRunlog(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/${params.type}/${params.id}/task/runLog?${stringify(
      params.query
    )}`
  );
}

// 查看同步日志
export async function viewSynclog(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/${params.type}/${params.id}/task/syncLog?${stringify(
      params.query
    )}`
  );
}

// 查看数据库数据表的结构
export async function getDBTableStruct(params) {
  return request(
    `/api/api/v2/zhengwu/swap/data/db/${params.path}/struct?${stringify(params.query)}`
  );
}

// 查看资源详情
export async function getInfoSrcDetail(params) {
  return request(`/api/api/v2/zhengwu/swap/resource/${params.path}`);
}

// 取消数据
export async function cancelData(params) {
  return request(`/api/api/v2/zhengwu/swap/data/${params.type}/${params.id}/cancel`, {
    method: 'POST',
    body: params,
  });
}

// 检测下载数据是否存在
export async function checkFiles(params) {
  return request(
    `/api/api/v2/zhengwu/swap/dataR/${params.type}/${params.id}/check?ids=${params.ids}`
  );
}
