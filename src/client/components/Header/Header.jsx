import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import './Header.css';

import { useData } from '../../app.context';

const paths = [
  { to: '/', label: 'Portfolio' },
  { to: '/activity', label: 'Activity' },
  { to: '/settings', label: 'Settings' },
];

export const Header = () => {
  const { session } = useData();

  return (
    <header className="header">
      <h1>
        Satoshi <span>custody</span>
      </h1>

      {session ? (
        <>
          <nav className="wrapper">
            {paths.map(({ to, label }) => (
              <Link key={to} to={to} className={useRouteMatch({ path: to, exact: true }) ? 'active' : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="session">
            <a href="#">
              <span className="icon">notifications</span>
            </a>
            <p>{session.username}</p>
          </div>
        </>
      ) : (
        <Link to="/signin">Sign In</Link>
      )}
    </header>
  );
};
