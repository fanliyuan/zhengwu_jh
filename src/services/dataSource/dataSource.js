import { stringify } from 'qs';
import request from '@/utils/request';

//搜索资源列表
export async function initDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasources?${stringify(params)}`);
}

//新建数据源
export async function addDataSource(params) {
  return request('/api/api/v2/zhengwu/swap/datasource', {
    method: 'POST',
    body: params,
  });
}

//删除数据源
export async function deleteDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

//修改数据源
export async function updateDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

//查看数据源详情
export async function viewDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`);
}

//连接测试
export async function connectBase(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/connect?${stringify(params)}`);
}

//判断数据名称是否存在
export async function isSameNameData(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/data/name?${stringify(params)}`);
}

//判断数据源名称是否存在
export async function isSameNameSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/name?${stringify(params)}`);
}

//文件下载
export async function download(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/file/down?${stringify(params)}`);
}

//文件上传
export async function upload(params) {
  return request('/api/api/v2/zhengwu/swap/datasource/file/up', {
    method: 'POST',
    body: params,
  });
}

//获取ftp的数据list
export async function ftpDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/ftp/data?${stringify(params)}`);
}

//获取ftp的数据tree
export async function ftpDataTree(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/ftp/tree?${stringify(params)}`);
}

//获取mysql指定库表的字段list
export async function mysqlColumnList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/column?${stringify(params)}`);
}

//获取mysql指定库表的数据list
export async function mysqlDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/data?${stringify(params)}`);
}

//获取mysql的数据库list
export async function mysqlDbList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/db?${stringify(params)}`);
}

//获取mysql指定库的数据表list
export async function mysqlTableList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/mysql/table?${stringify(params)}`);
}

//获取sftp的数据list
export async function sftpDataList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/sftp/data?${stringify(params)}`);
}

//获取sftp的数据tree
export async function sftpDataTree(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/sftp/tree?${stringify(params)}`);
}

//数据源（关系型数据库）数据接入
export async function accessDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${stringify(params)}/db`, {
    method: 'POST',
    body: params,
  });
}

//数据源（文件）数据接入
export async function accessFile(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${stringify(params)}/file`, {
    method: 'POST',
    body: params,
  });
}

//数据源（SFTP/FTP）数据接入
export async function accessFtp(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${stringify(params)}/ftp`, {
    method: 'POST',
    body: params,
  });
}
