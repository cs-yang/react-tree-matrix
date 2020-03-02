import _ from 'lodash';

export default class treeMaxUtil {
    constructor(source, types) {
        this.source = source;
        this.types = types;
    }

    // 转换数据源(计算 x, parent, row, col, text, isEnd, isLeaf) 未计算y坐标
    _transferSource(data = [], x = 0, parent = null) {
        return data.map(item => {
            const _item = item;
            _item.x = x; //x 坐标
            _item.parent = parent;
            _item.row = _item.children ? _item.children.length: 1 ; //默认row为1
            _item.col = 1;
            _item.text = _item.title; // 显示的文本

            if (_item.children && _item.children.length) {
                // 判断row 大于1 给父级增加row
                const dep = _item.row - 1;
                if (dep > 0) {
                    this._setParentRow(_item, dep);
                }
                // 设置类型宽度已到末尾
                if (item.parent) {
                    item.parent.isEnd = item.parent.type !== item.type;
                }

                this._transferSource(_item.children, x+1, _item);
            } else {
                // 既是子叶 必然是类型结点
                _item.isEnd = true;
                _item.isLeaf = true;

                if (_item.parent && _item.parent.type !== item.type) {
                    _item.parent.isEnd = true;
                }
            }
            return _item;
        })
    }

    // 计算y轴坐标
    _calcY(data, parent) {
        return data.map((item, index) => {
            const _item = item;
            const _y = parent ? parent.y : 0;

            if (index === 0) {
                // 数组第一项 与父级y轴起点相同
                _item.y = _y;
            } else if (index === 1) {
                // 数组第二项 是第一项加上row
                _item.y = _y + data[index - 1].row;
            } else {
                // 数组其余项 是前一项row加前一项的y
                _item.y = data[index - 1].row + data[index - 1].y;
            }

            if (_item.children && _item.children.length) {
                this._calcY(_item.children, _item);
            }
            return _item;
        })
    }

    _setParentRow(item, dep) {
        if (item.parent) {
            // 父级row 等于父级row 加额外深度
            item.parent.row = item.parent.row + dep;
            this._setParentRow(item.parent, dep);
        }
    }

    // 扁平化数据
    _flatDataSource() {
        const source = _.cloneDeep(this.source);
        // 1.转换数据源
        const transferSource = this._transferSource(source);
        // 2. 计算Y轴
        const afterCalcYData = this._calcY(transferSource);
        const _data = [];
        const _flatData = source => source.forEach(item => {
            const { x, y, row, col, text, type, isEnd, isLeaf } = item;
            _data.push({
                text,
                x,
                y,
                row,
                col,
                isLeaf,
                type,
                isEnd,
                parent: !!item.parent,
            });
            if (item.children && item.children.length) {
                _flatData(item.children);
            }
        });
        // 3. 扁平数据
        _flatData(afterCalcYData);
        return _data;
    }

    // 计算不同类型深度范围
    _calcTypeRange(flatData = [], types = []) {
        const _deepRange = { };

        // 计算 不类型的x
        const mapX = new Map();
        flatData.map(item => {
            if (item.isEnd) {
                const getTypeX = mapX.get(item.type);
                if (getTypeX && getTypeX < item.x+1) {
                    mapX.set(item.type, item.x + 1);
                }
                if (!getTypeX) {
                    mapX.set(item.type, item.x + 1);
                }
            }
        });

        // 计算不同类型的范围
        types.forEach((type, index) => {
            _deepRange[type] = { };
            // 如果x 值为0 则为第一列 默认为1
            _deepRange[type].max = mapX.get(type) || 1;
            // 最小幅度 如果index = 0 则为第一列, 其余为前一项得最大值
            _deepRange[type].min = index === 0 ? 0 : _deepRange[types[index - 1]].max;
        });
        return _deepRange;
    }

    // 计算合并列并输出结果
    getResult() {
        // 1.获取数据转换后的扁平化
        const flatDataSource = this._flatDataSource();
        // 2.计算不同类型的最大最小值范围
        const range = this._calcTypeRange(flatDataSource, this.types);
        this.range = range;
        // 计算合并列修正x轴
        return flatDataSource.map((item, index) => {
            const _item = item;

            const { x } = _item;
            let _x = x;

            // 起始位置x都等于0
            if (!_item.parent) {
                _item.x = 0;
            }

            if (_item.parent) {
                if (_item.isEnd || _item.type === this.types[this.types.length-1]) {
                    //类型不一样 获取扁平化数据前一项为后一项的父节点
                    let prevIndex = index - 1;
                    let _parent;
                    for (let i = prevIndex; i >= 0; i--) {
                        _parent = flatDataSource[i];
                        const currentTypeIndex = _.indexOf(this.types, _item.type);
                        const parentTypeIndex = _.indexOf(this.types, _parent.type);
                        // 前一项与后一项类型相同，且起始点不一样
                        const min = range[_item.type].min;
                        if (_parent.type === _item.type && min !== _item.x) {
                            _item.x = min < _item.x ? _item.x : min;
                            break;
                        }
                        // 找出index> 当前index 的type类型
                        if (_parent.type !== _item.type && currentTypeIndex > parentTypeIndex) {
                            // x 轴变换为 前一项的x轴加上前一项的col
                            _item.x = _parent.x + _parent.col;
                            break;
                        }
                    }
                }

            }

            if (item.isEnd) {
                if (_item.x + _item.col <= range[_item.type].max) {
                    _item.col = range[_item.type].max - _item.x;
                }
            }
            return _item;
        });
    }
}
