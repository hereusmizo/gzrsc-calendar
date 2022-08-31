import React from 'react';
import reduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {StatusBar} from 'react-native';
import reducers from './reducers';
import Routes from './routes/Routes';

const composeEnhancers = compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk)),
);

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Routes />
    </Provider>
  );
};

export default App;
