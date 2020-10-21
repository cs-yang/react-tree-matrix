import React from 'react';
import logo from './logo.svg';
import styles from './App.css';

import TreeMatrix from 'react-tree-matrix';

const customRender = (cellData) => {
  const style = {};
  if (cellData.y === 0) {
    style.fontWeight = 'bold';
  }

  return (
    <div style={style} className={styles.cellHeight} title={cellData.text}>
      {cellData.text}
    </div>
  );
};

const previewHead = {
  title: '规划',
  type: 'program',
  children: [
    {
      title: '工作',
      type: 'work',
      children: [
        {
          title: '任务',
          type: 'task',
        },
      ],
    },
  ],
};

const programWork = [
  {
    title: '规划',
    type: 'program',
    children: [
      {
        title: '规划',
        type: 'program',
        children: [
          {
            title: '工作',
            type: 'work',
            children: [
              {
                title: '工作',
                type: 'work',
                children: [
                  {
                    title: '任务',
                    type: 'task',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '规划',
        type: 'program',
        children: [
          {
            title: '工作',
            type: 'work',
            children: [
              {
                title: '工作',
                type: 'work',
                children: [
                  {
                    title: '工作',
                    type: 'work',
                    children: [
                      {
                        title: '任务',
                        type: 'task',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '规划',
    type: 'program',
    children: [
      {
        title: '工作',
        type: 'work',
        children: [
          {
            title: '任务',
            type: 'task',
          },
        ],
      },
      {
        title: '工作',
        type: 'work',
        children: [
          {
            title: '任务',
            type: 'task',
          },
        ],
      },
    ],
  },
  {
    title: '规划',
    type: 'program',
    children: [
      {
        title: '工作',
        type: 'work',
        children: [
          {
            title: '任务',
            type: 'task',
          },
        ],
      },
    ],
  },
  {
    title: '规划',
    type: 'program',
    children: [
      {
        title: '规划',
        type: 'program',
        children: [
          {
            title: '工作',
            type: 'work',
            children: [
              {
                title: '任务',
                type: 'task',
              },
              {
                title: '任务',
                type: 'task',
              },
            ],
          },
        ],
      },
    ],
  },
];

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
