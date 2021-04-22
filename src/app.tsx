import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import css from './styles/app.module.less';
import loadable from '@loadable/component';
import Loading from './components/loading/index.jsx';

const Home = loadable(() => import('./pages/home'), {
    fallback: <Loading />
});
const Graph = loadable(() => import('./pages/graph'), {
    fallback: <Loading />
});
const NotFound = loadable(() => import('./pages/not-found'), {
    fallback: <Loading />
});
const Question = loadable(() => import('./pages/questions'), {
    fallback: <Loading />
});

const App: React.FC = () => (
    <div className={css.app}>
        <Router>
            <Switch>
                <Route path="/" component={Home} exact={true} />
                <Route path="/graph" component={Graph} exact={true} />
                <Route path="/explain" component={Question} exact={true} />
                <Route path="/404" component={NotFound} exact={true} />
                <Redirect to="/404" />
            </Switch>
        </Router>
        <div id="loadingWrapper" className={css['loading-wrapper']}>
            <Loading />
        </div>
    </div>
);

export default App;
