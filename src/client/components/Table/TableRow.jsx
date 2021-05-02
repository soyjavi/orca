import PropTypes from 'prop-types';
import React from 'react';

export const TableRow = ({ dataSource, schema = {}, sort = {}, onPress = () => {}, ...others }) => {
  const isHead = dataSource === undefined;

  return (
    <tr {...others} as="tr">
      {Object.keys(schema).map((field) =>
        React.createElement(
          isHead ? 'th' : 'td',
          {
            // color={COLOR.GRAYSCALE_M}
            // customStyle={style.tableRowBorder}
            // key={field}
            // paddingHorizontal={SIZE.M}
            // paddingVertical={SIZE.M}
          },
          <span
          // color={isHead ? COLOR.GRAYSCALE_L : undefined}
          // detail
          // display={DISPLAY.BLOCK}
          // selectable={false}
          // upperCase
          // onPress={() => {
          //   isHead ? onPress(field) : onPress(dataSource);
          // }}
          >
            {isHead
              ? `${schema[field].label} ${sort.field === field ? (sort.asc ? '↓' : '↑') : ' '}`
              : dataSource[field] || ''}
          </span>,
        ),
      )}
    </tr>
  );
};

TableRow.propTypes = {
  dataSource: PropTypes.shape({}),
  schema: PropTypes.shape({}),
  sort: PropTypes.shape({}),
  onPress: PropTypes.func,
};
