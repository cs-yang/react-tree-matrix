import React from 'react';
import logo from './logo.svg';
import styles from './App.css';

import TreeMatrix from 'tree-matrix/tree-matrix';
import 'tree-matrix/tree-matrix.css';

const customRender = (cellData) => {
  const style = { };
  if (cellData.y === 0) {
    style.fontWeight = 'bold';
}

return (<div style={style} className={styles.cellHeight} title={cellData.text}>
    {cellData.text}
</div>);
}

const previewHead = {
  title: '规划',
  type: 'program',
  children: [{
      title: '工作',
      type: 'work',
      children: [{
          title: '牵头单位',
          type: 'task',
      }],
  }],
};

const programWork = [{
  key: '1',
  title: '规划一',
  type: 'program',
  children: [{
      key: '1-1',
      title: '规划一一',
      type: 'program',
      children: [{
          key: '1-2-1',
          title: '工作',
          type: 'work',
          children:[{
            key: '1-2-1',
            title: '工作',
            type: 'work',
            children: [{
                key: '1-2-1-1',
                title: '任务',
                type: 'task',
            }],
        }],
      }],
  }, {
      key: '1-2',
      title: '规划一二',
      type: 'program',
      children: [{
          key: '1-2-1',
          title: '工作',
          type: 'work',
          children: [{
              key: '1-2-1-1',
              title: '任务',
              type: 'task',
          }],
      }],
  }],
}, {
  key: '2',
  title: '规划二',
  type: 'program',
  children: [{
      key: '3',
      title: '工作四',
      type: 'work',
      children: [{
          key: '1-2-1-1',
          title: '任务',
          type: 'task',
      }],
  },{
    key: '3',
    title: '工作四',
    type: 'work',
    children: [{
        key: '1-2-1-1',
        title: '任务',
        type: 'task',
    }],
}],
}, {
  key: '3',
  title: '规划三',
  type: 'program',
  children: [{
      key: '3',
      title: '工作四',
      type: 'work',
      children: [{
          key: '1-2-1-1',
          title: '任务',
          type: 'task',
      }],
  }],
}, {
  key: '4',
  title: '规划四',
  type: 'program',
  children: [{
      key: '4-1',
      title: '规划四一',
      type: 'program',
      children: [{
          key: '3',
          title: '工作四',
          type: 'work',
          children: [{
              key: '1-2-1-1',
              title: '任务',
              type: 'task'
          },],
      }],
  }],
}];

function App() {
  return (
    <div className="App">
      <span style={{ color: 'red' }}>每个格子必须有值</span>
      <TreeMatrix
        cellWidth={[100, 200, 100, 100]}
        cellHeight={[60]}
        data={[previewHead, ...programWork]}
        types={['program', 'work', 'task', 'weight']}
        render={customRender}
    />
    </div>
  );
}

export default App;
