import React, {useState, useCallback} from 'react';
import logo from '../../logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import UserWelcome from '../UserWelcome';
import ExchangeMonitor from '../ExchangeMonitor';

function App() {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const handleSaveUserName = useCallback((name) => {
        setUserName(name);
        localStorage.setItem('userName', name);
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <UserWelcome handleSaveUserName={handleSaveUserName}/>
                <ExchangeMonitor userName={userName}/>
            </header>
        </div>
    );
}

export default App;
