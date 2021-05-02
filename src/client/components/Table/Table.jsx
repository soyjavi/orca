import PropTypes from 'prop-types';
import React, { useState } from 'react';

// import { TablePropTypes, TEXT } from '../ModelManager.definition';
import { sortBy } from './helpers';
import { TableRow } from './TableRow';
import './Table.css';

export const Table = ({ dataSource = [], schema = {}, onPress = () => {} }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(undefined);

  const handleSort = (nextField) => {
    const { field, asc } = sort || {};

    setSort(field === nextField && asc === false ? undefined : { field: nextField, asc: field !== nextField });
  };

  return (
    <div>
      {/* <View alignItems={ALIGN.CENTER} display={DISPLAY.FLEX} marginBottom={LAYOUT.XXS}>
        <Text level={1} flex={SIZE.XL}>
          {name}
        </Text>
        {!busy && (
          <Input
            customStyle={style.tableSearch}
            flex={SIZE.S}
            paddingHorizontal={SIZE.M}
            placeholder={translate(TEXT.SEARCH)}
            marginRight={SIZE.M}
            value={search}
            // onChange={(event, value = '') => setSearch(value.trim().toLowerCase())}
          />
        )}
        <Button busy={busy} color={COLOR.GRAYSCALE_M} small onPress={() => onPress({})} wide={false}>
          {translate(busy ? TEXT.WAIT_MOMENT : TEXT.NEW)}
        </Button>
      </View> */}

      <div>
        <table className="table">
          <thead>
            <TableRow schema={schema} sort={sort} onPress={handleSort} />
          </thead>
          <tbody>
            {dataSource
              .filter((row) => search.length === 0 || JSON.stringify(row).toLowerCase().includes(search))
              .sort((a, b) => sortBy(a, b, sort))
              .map((row, index) => (
                <TableRow dataSource={row} key={index} schema={schema} onPress={() => onPress(row)} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.shape({})),
  schema: PropTypes.shape({}),
  onPress: PropTypes.func,
};
