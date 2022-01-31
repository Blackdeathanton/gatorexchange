import React from 'react';
import Appbar from './components/Appbar/Appbar';
import AllQuestionsView from './components/AllQuestionsView/AllQuestionsView';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Router>
                <Appbar />
                <Switch>
                    <Route exact path='/' component = {AllQuestionsView}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
