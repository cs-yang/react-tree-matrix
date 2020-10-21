"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _indexOf2 = _interopRequireDefault(require("lodash/indexOf"));

var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var treeMaxUtil = /*#__PURE__*/function () {
  function treeMaxUtil(source, types) {
    _classCallCheck(this, treeMaxUtil);

    this.source = source;
    this.types = types;
  } // 转换数据源(计算 x, parent, row, col, text, isEnd, isLeaf) 未计算y坐标


  _createClass(treeMaxUtil, [{
    key: "_transferSource",
    value: function _transferSource() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return data.map(function (item) {
        var _item = item;
        _item.x = x; //x 坐标

        _item.parent = parent;
        _item.row = _item.children ? _item.children.length : 1; //默认row为1

        _item.col = 1;
        _item.text = _item.title; // 显示的文本

        if (_item.children && _item.children.length) {
          // 判断row 大于1 给父级增加row
          var dep = _item.row - 1;

          if (dep > 0) {
            _this._setParentRow(_item, dep);
          } // 设置类型宽度已到末尾


          if (item.parent) {
            item.parent.isEnd = item.parent.type !== item.type;
          }

          _this._transferSource(_item.children, x + 1, _item);
        } else {
          // 既是子叶 必然是类型结点
          _item.isEnd = true;
          _item.isLeaf = true;

          if (_item.parent && _item.parent.type !== item.type) {
            _item.parent.isEnd = true;
          }
        }

        return _item;
      });
    } // 计算y轴坐标

  }, {
    key: "_calcY",
    value: function _calcY(data, parent) {
      var _this2 = this;

      return data.map(function (item, index) {
        var _item = item;

        var _y = parent ? parent.y : 0;

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
          _this2._calcY(_item.children, _item);
        }

        return _item;
      });
    }
  }, {
    key: "_setParentRow",
    value: function _setParentRow(item, dep) {
      if (item.parent) {
        // 父级row 等于父级row 加额外深度
        item.parent.row = item.parent.row + dep;

        this._setParentRow(item.parent, dep);
      }
    } // 扁平化数据

  }, {
    key: "_flatDataSource",
    value: function _flatDataSource() {
      var source = (0, _cloneDeep2.default)(this.source); // 1.转换数据源

      var transferSource = this._transferSource(source); // 2. 计算Y轴


      var afterCalcYData = this._calcY(transferSource);

      var _data = [];

      var _flatData = function _flatData(source) {
        return source.forEach(function (item) {
          var x = item.x,
              y = item.y,
              row = item.row,
              col = item.col,
              text = item.text,
              type = item.type,
              isEnd = item.isEnd,
              isLeaf = item.isLeaf;

          _data.push({
            text: text,
            x: x,
            y: y,
            row: row,
            col: col,
            isLeaf: isLeaf,
            type: type,
            isEnd: isEnd,
            parent: !!item.parent
          });

          if (item.children && item.children.length) {
            _flatData(item.children);
          }
        });
      }; // 3. 扁平数据


      _flatData(afterCalcYData);

      return _data;
    } // 计算不同类型深度范围

  }, {
    key: "_calcTypeRange",
    value: function _calcTypeRange() {
      var flatData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var _deepRange = {}; // 计算 不类型的x

      var mapX = new Map();
      flatData.map(function (item) {
        if (item.isEnd) {
          var getTypeX = mapX.get(item.type);

          if (getTypeX && getTypeX < item.x + 1) {
            mapX.set(item.type, item.x + 1);
          }

          if (!getTypeX) {
            mapX.set(item.type, item.x + 1);
          }
        }
      }); // 计算不同类型的范围

      types.forEach(function (type, index) {
        _deepRange[type] = {}; // 如果x 值为0 则为第一列 默认为1

        _deepRange[type].max = mapX.get(type) || 1; // 最小幅度 如果index = 0 则为第一列, 其余为前一项得最大值

        _deepRange[type].min = index === 0 ? 0 : _deepRange[types[index - 1]].max;
      });
      return _deepRange;
    } // 计算合并列并输出结果

  }, {
    key: "getResult",
    value: function getResult() {
      var _this3 = this;

      // 1.获取数据转换后的扁平化
      var flatDataSource = this._flatDataSource(); // 2.计算不同类型的最大最小值范围


      var range = this._calcTypeRange(flatDataSource, this.types);

      this.range = range; // 计算合并列修正x轴

      return flatDataSource.map(function (item, index) {
        var _item = item;
        var x = _item.x;
        var _x = x; // 起始位置x都等于0

        if (!_item.parent) {
          _item.x = 0;
        }

        if (_item.parent) {
          if (_item.isEnd || _item.type === _this3.types[_this3.types.length - 1]) {
            //类型不一样 获取扁平化数据前一项为后一项的父节点
            var prevIndex = index - 1;

            var _parent;

            for (var i = prevIndex; i >= 0; i--) {
              _parent = flatDataSource[i];
              var currentTypeIndex = (0, _indexOf2.default)(_this3.types, _item.type);
              var parentTypeIndex = (0, _indexOf2.default)(_this3.types, _parent.type); // 前一项与后一项类型相同，且起始点不一样

              var min = range[_item.type].min;

              if (_parent.type === _item.type && min !== _item.x) {
                _item.x = min < _item.x ? _item.x : min;
                break;
              } // 找出index> 当前index 的type类型


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
  }]);

  return treeMaxUtil;
}();

exports.default = treeMaxUtil;