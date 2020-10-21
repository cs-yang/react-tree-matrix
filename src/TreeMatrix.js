import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Matrix from 'uxcore/lib/Matrix';
import 'uxcore/assets/iconfont.css';
import 'uxcore/assets/orange.css';

import treeMatrixUtils from './utils';

const TreeMatrix = ({ data, types, cellWidth, ...newProps }) => {
  const { source, range } = useMemo(() => {
    const _treeMatrixData = new treeMatrixUtils(data, types);
    const source = _treeMatrixData.getResult();
    const range = _treeMatrixData.range;
    return {
      source,
      range,
    };
  }, [data, types]);

  const matrixCellWidth = useMemo(() => {
    let _cellWidth = [];
    types.forEach((type, index) => {
      const dep = range[type].max - range[type].min;
      for (let i = 0; i < dep; i++) {
        _cellWidth = [..._cellWidth, cellWidth[index]];
      }
    });
    return _cellWidth;
  }, [cellWidth, types, range]);

  return (
    <Matrix
      {...newProps}
      cellWidth={matrixCellWidth}
      data={{
        data: source,
      }}
    />
  );
};

TreeMatrix.propTypes = {
  data: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
};

TreeMatrix.defaultProps = {
  data: [],
  type: [],
};

export default TreeMatrix;
