import React from 'react';
import Appbar from './components/Appbar/Appbar';
import AllQuestionsView from './components/AllQuestionsView';
import AskQuestion from './components/AskQuestion/AskQuestion';
import Auth from './components/Auth';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import QuestionView from './components/QuestionView';
import Tags from './components/Tags';
import UserProfile from './components/UserProfile';

function App() {

    //const user = useSelector(selectUser);

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route
        {...rest}
        render={(props) =>
            sessionStorage.getItem("token") ? (
            <Component {...props} />
            ) : (
            <Redirect
                to={{
                pathname: "/auth",
                state: {
                    from: props.location,
                },
                }}
            />
            )
        }
        />
    );
    
    return (
        <div className="App">
            <Router>
                <Appbar />
                <Switch>
                    <Route exact path='/auth' component = {Auth}/>
                    <Route exact key='view-question' path='/question' component = {QuestionView}/>
                    <Route exact key='all-questions-search' path='/questions/:id?' component = {AllQuestionsView}/>
                    <Route exact key='all-questions-filter' path='/questions/:tag?/:filters?/:sort?' component = {AllQuestionsView}/>
                    <Route exact path='/tags' component= {Tags}/>
                    <Route exact path='/user/:name?' component= {UserProfile}/>
                    <PrivateRoute exact path='/ask-question' component = {AskQuestion}/>
                    <PrivateRoute exact path='/edit-question' component = {AskQuestion}/>
                    <PrivateRoute exact path='/edit-answer' component = {AskQuestion}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
