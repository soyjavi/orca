import PropTypes from 'prop-types';
import React, { useContext, useLayoutEffect, useState, createContext } from 'react';

import { request } from './commons';

const DataContext = createContext({
  session: undefined,
});

const DataProvider = ({ children }) => {
  const [session, setSession] = useState();

  useLayoutEffect(() => {
    request({
      hostname: 'http://localhost:8080/ftx',
      endpoint: '/',
    })
      .then((response) => setSession(response))
      .catch((error) => console.error(error));
  }, []);

  return <DataContext.Provider value={{ session }}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.node,
};

const useData = () => useContext(DataContext);

export { DataContext, DataProvider, useData };
