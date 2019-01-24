import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import Info from './components/Info'
import Chat  from './components/Chat.js'
import Start  from './components/Start.js'
import Logout  from './components/Logout.js'



const RouterComponent = () => {
  return (
    <Router>
    <Scene key="root">
      <Scene hideNavBar key="login"  >
        <Scene  key="first" component={LoginForm} title="Please Login" />
      </Scene>

      <Scene hideNavBar  key="info"  >
      <Scene key="first" component={Info} title="Info" />
      </Scene>

      <Scene hideNavBar  key="logout"  >
      <Scene key="first" component={Logout} title="logOut" />
      </Scene>

      <Scene hideNavBar  key="init"  >
      <Scene key="first" component={Start} title="init" />
      </Scene>




      <Scene hideNavBar  key="chat"  >
      <Scene key= "first"  component={Chat} title="lanpract" />
      </Scene>

      <Scene hideNavBar  key="start" initial >
      <Scene key= "first"  component={Start} title="lanpract" />
      </Scene>




      </Scene>
    </Router>
  );
};

export default RouterComponent;
