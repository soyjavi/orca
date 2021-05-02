import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './app.css';
import { DataProvider } from './app.context';
import { Header } from './components';
import { Portfolio, Activity, Settings } from './Views';

const App = () => (
  <DataProvider>
    <Router>
      <Header />
      <section className="content wrapper">
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/Activity">
            <Activity />
          </Route>
          <Route path="/">
            <Portfolio />
          </Route>

          {/* <Route path="*">
          <Redirect to="/somewhere/else" />
        </Route> */}
        </Switch>
      </section>
    </Router>
  </DataProvider>
);

render(<App />, document.getElementById('root'));
