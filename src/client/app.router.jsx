import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { useData } from './app.context';
import { Header } from './components';
import { Portfolio, Activity, Settings } from './Views';

const App = () => {
  const { session } = useData();

  <Router>
    <Header />
    <section className="content wrapper">
      {session ? (
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
      ) : (
        <h1>Loading...</h1>
      )}
    </section>
  </Router>;
};

render(<App />, document.getElementById('root'));
