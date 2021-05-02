import React, { useEffect, useState } from 'react';
import './Portfolio.css';

import { useData } from '../../app.context';
import { request } from '../../commons';
import { Table } from '../../components';

// console.log({ C });
export const Portfolio = () => {
  const { session: { totalAccountValue = 0 } = {} } = useData();

  const [wallet, setWallet] = useState();

  useEffect(() => {
    request({
      hostname: 'http://localhost:8080/ftx',
      endpoint: '/wallet',
    })
      .then((wallet) => setWallet(wallet))
      .catch((error) => console.error(error));
  }, []);

  console.log({ wallet });

  return (
    <article className="dashbaord">
      <h1 className="font-XL">${totalAccountValue.toFixed(2)}</h1>

      <Table
        dataSource={wallet}
        schema={{
          coin: { label: 'Coin' },
          total: { label: 'total' },
          usdValue: { label: 'USD' },
          a: { label: 'BTC' },
        }}
      />
    </article>
  );
};
