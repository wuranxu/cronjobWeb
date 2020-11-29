import React, {Fragment, useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Divider, notification, Table, Tag} from 'antd';
import {executeJob, fetchJobList} from "@/services/job";
import JobLog from "@/components/Modal/JobLog";
import '@/global.less';


export default () => {
  // job数据
  const [data, setData] = useState([]);

  // 当前任务列表
  const [taskModal, setTaskModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskText, setTaskText] = useState('');
  const [taskId, setTaskId] = useState('');


  const fetchJob = async () => {
    const response = await fetchJobList();
    if (response.code !== 0) {
      notification.error(response.msg)
      return;
    }
    setData(response.data)
  }

  useEffect(() => {
    fetchJob();
  }, [])


  const onExecute = async record => {
    const res = await executeJob(record.id)
    if (res.code === 0) {
      notification.success({
        message: '任务开始执行'
      })
    } else {
      notification.error({
        message: res.msg
      })
      return
    }
    setTaskId(record.id);
    setTaskText('');
    setTaskName(`任务: ${record.name}`)
    setTaskModal(true);
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc'
    },
    {
      title: '重试次数',
      dataIndex: 'retry'
    },
    {
      title: 'command',
      dataIndex: 'command'
    },
    {
      title: 'cron表达式',
      dataIndex: 'cron_expr'
    },
    {
      title: '冻结',
      render: (_, record) => !record.pause ? <Tag color="green">激活</Tag> : <Tag color="gray">冻结</Tag>
    },
    {
      title: '操作',
      render: (_, record) => <Fragment>
        <a>编辑</a>
        <Divider type="vertical"/>
        <a onClick={() => {
          onExecute(record)
        }}>执行</a>
      </Fragment>
    }
  ]
  return (
    <PageHeaderWrapper>
      <Card>
        <JobLog taskName={taskName} taskModal={taskModal}
                taskText={taskText} setTaskText={setTaskText}
                taskId={taskId} setTaskModal={setTaskModal}/>
        <Table columns={columns} dataSource={data}/>
      </Card>
    </PageHeaderWrapper>
  )
}
