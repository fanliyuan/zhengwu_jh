import React, { Component, Fragment } from 'react';
import { Select } from 'antd';

const { OptGroup, Option } = Select;

const dataTree = [
  {
    label: '数据库类型',
    children: [
      { value: 'mysql', label: 'mysql' },
      { value: 'sqlserver', label: 'sqlserver' },
      { value: 'oracle', label: 'oracle' },
      { value: 'dm', label: 'dm' },
      { value: 'kingbase', label: 'kingbase' },
    ],
  },
  {
    label: '半结构文件类型',
    children: [
      { value: 'ftp', label: 'ftp' },
      { value: 'sftp', label: 'sftp' },
      { value: 'file', label: '文件' },
    ],
  },
];

export default dataTree.map(sub => (
  <OptGroup label={sub.label} key={sub.label}>
    {sub.children.map(item => (
      <Option value={item.value} key={item.value}>
        {item.label}
      </Option>
    ))}
  </OptGroup>
));
