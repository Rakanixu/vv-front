import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    
    return this;
};
