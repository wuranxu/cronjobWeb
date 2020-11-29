import { Modal, notification } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import React, { useState } from 'react';
import Websocket from 'react-websocket';
import styles from './JobLog.less';

export default ({
  taskName,
  taskModal,
  taskId,
  setTaskModal,
  taskText,
  setTaskText,
  reconnect,
  setReconnect,
  setTaskId,
}) => {
  const [socketUrl] = useState('ws://localhost:9999/job/log');

  return (
    <Modal
      title={taskName}
      visible={taskModal}
      bodyStyle={{ padding: 0 }}
      style={{ height: 500 }}
      className="cmd"
      onCancel={setTaskModal(false)}
      footer={null}
      width={800}
    >
      {taskId !== '' ? (
        <Websocket
          url={`${socketUrl}/${taskId}`}
          reconnect={reconnect}
          onMessage={(msg) => {
            if (msg === 'finished') {
              setReconnect(false);
              notification.success({
                message: '任务完成',
              });
              return;
            }
            setTaskText(taskText !== '' ? `${taskText}${msg}` : msg);
          }}
        />
      ) : null}
      <div
        style={{
          minHeight: 500,
          height: 500,
          overflowY: 'auto',
          background: 'rgb(40, 44, 52)',
        }}
      >
        <SyntaxHighlighter language="text" style={atomOneDark}>
          {taskText}
        </SyntaxHighlighter>
      </div>
    </Modal>
  );
};
