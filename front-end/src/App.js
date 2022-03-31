import React from 'react';
import Appbar from './components/Appbar/Appbar';
import AllQuestionsView from './components/AllQuestionsView';
import AskQuestion from './components/AskQuestion/AskQuestion';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import QuestionView from './components/QuestionView';

function App() {
    return (
        <div className="App">
            <Router>
                <Appbar />
                <Switch>
                    
                    <Route exact key='view-question' path='/question' component = {QuestionView}/>
                    <Route exact key='ask-question' path='/ask-question' component = {AskQuestion}/>
                    <Route exact key='all-questions' path='/questions/:id?' component = {AllQuestionsView}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
