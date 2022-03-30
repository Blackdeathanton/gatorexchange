import React from 'react';
import Appbar from './components/Appbar/Appbar';
import AllQuestionsView from './components/AllQuestionsView';
import AskQuestion from './components/AskQuestion/AskQuestion';
import Auth from './components/Auth';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import QuestionView from './components/QuestionView';

function App() {
    return (
        <div className="App">
            <Router>
                <Appbar />
                <Switch>
                    <Route exact path='/auth' component = {Auth}/>
                    <Route exact path='/' component = {AllQuestionsView}/>
                    <Route exact path='/:id' component = {AllQuestionsView}/>
                    <Route exact path='/question' component = {QuestionView}/>
                    <Route exact path='/question/:id' component = {QuestionView}/>
                    <Route exact path='/ask-question' component = {AskQuestion}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
