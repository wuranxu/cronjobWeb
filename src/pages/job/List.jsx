import React, {useRef, useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Table, Card} from 'antd';
import {fetchJobList} from "@/services/job";

export default () => {
  const [data, setData] = useState([]);

  useEffect(async ()=>{
    const response = await fetchJobList();
    setData(response.data)
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    }
  ]
  return (
    <PageHeaderWrapper>
      <Card>
        <Table columns={columns} dataSource={data}/>
      </Card>
    </PageHeaderWrapper>
  )
}
