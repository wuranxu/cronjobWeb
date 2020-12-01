import React, {Fragment, useEffect, useState} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Card, Divider, notification, Table, Tag, Badge} from 'antd';
import {executeJob, fetchJobList, stopJob} from '@/services/job';
import JobLog from '@/components/Modal/JobLog';
import '@/global.less';

export default () => {
  // job数据
  const [data, setData] = useState([]);

  // 当前任务列表
  const [taskModal, setTaskModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskText, setTaskText] = useState('');
  const [taskId, setTaskId] = useState('');
  const [reconnect, setReconnect] = useState(true);

  const fetchJob = async () => {
    const response = await fetchJobList();
    if (response.code !== 0) {
      notification.error(response.msg);
      return;
    }
    setData(response.data);
  };

  const getStatus = status => {
    if (status === 0) {
      return <Badge text="未注册" status="danger"/>
    }
    if (status === 1) {
      return <Badge status="processing" text="运行中"/>
    }
    if (status === 2) {
      return <Badge text="等待中" status="default"/>
    }
    return null
  }

  useEffect(() => {
    fetchJob();
  }, []);

  const onStop = async (record) => {
    const res = await stopJob(record.id);
    if (res.code === 0) {
      notification.success({
        message: res.msg,
      });
    } else {
      notification.error({
        message: res.msg,
      });
    }
    await fetchJob();
  };

  const onExecute = async (record) => {
    const res = await executeJob(record.id);
    if (res.code === 0) {
      notification.success({
        message: '任务开始执行',
      });
    } else {
      notification.error({
        message: res.msg,
      });
      return;
    }
    setTaskId(record.id);
    setTaskText('');
    setReconnect(true);
    setTaskName(`任务: ${record.name}`);
    setTaskModal(true);
    await fetchJob();
  };

  const onLog = (record) => {
    setTaskId(record.id);
    setReconnect(true);
    setTaskText("");
    setTaskName(`任务: ${record.name}`);
    setTaskModal(true);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '重试次数',
      dataIndex: 'retry',
      key: 'retry',
    },
    {
      title: 'command',
      dataIndex: 'command',
      key: 'command',
    },
    {
      title: 'cron表达式',
      dataIndex: 'cron_expr',
      key: 'cron_expr',
    },
    {
      title: '冻结',
      key: 'pause',
      render: (_, record) =>
        !record.pause ? <Tag color="green">否</Tag> : <Tag color="gray">是</Tag>,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => getStatus(record.status),
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <Fragment>
          <a>编辑</a>
          <Divider type="vertical"/>
          {record.status !== 1 ? (
            <a onClick={() => {
                onExecute(record);
              }}
            >执行</a>
          ) : (
            <a onClick={() => {
              onStop(record);
            }}>停止</a>
          )}
          {record.status === 1
            ? [
              <Divider type="vertical"/>,
              <a
                onClick={() => {
                  onLog(record);
                }}
              >
                日志
              </a>,
            ]
            : null}
        </Fragment>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <Card>
        <JobLog
          taskName={taskName}
          taskModal={taskModal}
          taskText={taskText}
          setTaskText={setTaskText}
          taskId={taskId}
          setTaskModal={setTaskModal}
          setTaskId={setTaskId}
          reconnect={reconnect}
          setReconnect={setReconnect}
        />
        <Table columns={columns} dataSource={data} rowKey={record => record.id}/>
      </Card>
    </PageHeaderWrapper>
  );
};
