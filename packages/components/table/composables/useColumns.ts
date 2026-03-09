import type { TableColumn } from '../types';

/**
 * 解析列宽为数字（px）
 */
function parseColumnWidth(width: string | number | undefined): number {
  if (width === undefined) return 0;
  if (typeof width === 'number') return width;
  const num = parseFloat(width);
  return isNaN(num) ? 0 : num;
}

/**
 * Table 列配置处理 composable
 */
export function useColumns(columns: () => TableColumn[]) {
  /**
   * colgroup > col 的样式，控制列宽
   * 在 table-layout: fixed 下，未指定 width 的列会自动均分剩余宽度
   */
  const getColStyle = (column: TableColumn) => {
    const style: any = {};
    if (column.width) {
      style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    if (column.minWidth) {
      style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
    }
    return style;
  };

  /**
   * 固定列的 sticky 定位样式（仅用于 th/td）
   * 计算累计偏移量，使多个固定列不重叠
   */
  const getFixedStyle = (column: TableColumn, isHeader = false) => {
    if (!column.fixed) return undefined;
    const cols = columns();
    const style: any = {
      position: 'sticky',
      zIndex: isHeader ? 4 : 2,
    };

    if (column.fixed === 'left') {
      let offset = 0;
      for (const col of cols) {
        if (col === column) break;
        if (col.fixed === 'left') {
          offset += parseColumnWidth(col.width);
        }
      }
      style.left = `${offset}px`;
    } else if (column.fixed === 'right') {
      let offset = 0;
      const colIndex = cols.indexOf(column);
      for (let i = cols.length - 1; i > colIndex; i--) {
        if (cols[i].fixed === 'right') {
          offset += parseColumnWidth(cols[i].width);
        }
      }
      style.right = `${offset}px`;
    }

    return style;
  };

  /**
   * 是否存在固定列
   */
  const hasFixedColumns = () => {
    return columns().some((col) => col.fixed);
  };

  /**
   * 计算所有列宽之和，用于设置 table min-width 以强制水平滚动
   */
  const getTableMinWidth = (): string | undefined => {
    if (!hasFixedColumns()) return undefined;
    const cols = columns();
    let total = 0;
    for (const col of cols) {
      total += parseColumnWidth(col.width) || parseColumnWidth(col.minWidth) || 100;
    }
    return `${total}px`;
  };

  const getHeaderClass = (column: TableColumn) => [
    'x-table__cell',
    column.align ? `x-table__cell--${column.align}` : '',
    {
      'is-sortable': column.sortable,
      'is-fixed-left': column.fixed === 'left',
      'is-fixed-right': column.fixed === 'right',
      'is-filterable': column.filters && column.filters.length > 0,
    },
  ];

  const getCellValue = (row: any, column: TableColumn, index: number) => {
    const value = row[column.prop];
    if (column.formatter) {
      return column.formatter(row, column, value, index);
    }
    return value;
  };

  const hasExpandColumn = () => {
    return columns().some((col) => col.type === 'expand');
  };

  const getTreeColumnIndex = () => {
    return columns().findIndex(
      (col) => !col.type || !['selection', 'index', 'expand'].includes(col.type),
    );
  };

  return {
    getColStyle,
    getFixedStyle,
    getHeaderClass,
    getCellValue,
    hasExpandColumn,
    hasFixedColumns,
    getTableMinWidth,
    getTreeColumnIndex,
  };
}
