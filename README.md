# react-tree-matrix
大纲视图展示
### Demo
 ![image](https://github.com/cs-yang/react-tree-matrix/tree-matrix.png)
 ```js
const data = [{
  title: '规划',
  type: 'program',
  children: [{
      title: '规划',
      type: 'program',
      children: [{
          title: '工作',
          type: 'work',
          children:[{
            title: '工作',
            type: 'work',
            children: [{
                title: '任务',
                type: 'task',
            }],
        }],
      }],
  }, {
      title: '规划',
      type: 'program',
      children: [{
          title: '工作',
          type: 'work',
          children: [{
              title: '工作',
              type: 'work',
              children: [{
                  title: '工作',
                  type: 'work',
                  children: [{
                      title: '任务',
                      type: 'task',
                  },],
              }],
          }],
      }],
  }],
}, {
  title: '规划',
  type: 'program',
  children: [{
      title: '工作',
      type: 'work',
      children: [{
          title: '任务',
          type: 'task',
      }],
  },{
    title: '工作',
    type: 'work',
    children: [{
        title: '任务',
        type: 'task',
    }],
}],
}, {
  title: '规划',
  type: 'program',
  children: [{
      title: '工作',
      type: 'work',
      children: [{
          title: '任务',
          type: 'task',
      }],
  }],
}, {
  title: '规划',
  type: 'program',
  children: [{
      title: '规划',
      type: 'program',
      children: [{
          title: '工作',
          type: 'work',
          children: [{
              title: '任务',
              type: 'task',
          },{
              title: '任务',
              type: 'task',
          }],
      }],
  }],
}];
```
### API
### Props
| 参数 | 说明 | 类型 | 默认值 |
 |--------|----------|------------------------|---------|
 data | 数据源 | array | []
 types | 类型数组 | array | []
 cellWidth | 每个类型列宽 | array | []
 cellHeight | 列高 | array | []
 render | 重写每个格子 | function | -- 
 
 ###### 更多属性参考 uxcore-matrix
