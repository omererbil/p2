import React,{Component} from 'react'
import {View} from 'react-native'
import firebase from 'firebase'
import {GoogleSignin} from 'react-native-google-signin'
import {Header,Button,Spinner} from './components/common'
import Router from './Router'

class App extends Component{
    // state={loggedIn:null}
  componentWillMount(){
    if (!firebase.apps.length) {


    firebase.initializeApp({
    apiKey: 'AIzaSyD0PGBPOmF-gwiqnM8fD69hZedf8odzdcQ',
    authDomain: 'authentication-11fdf.firebaseapp.com',
    databaseURL: 'https://authentication-11fdf.firebaseio.com',
    projectId: 'authentication-11fdf',
    storageBucket: 'authentication-11fdf.appspot.com',
    messagingSenderId: '177930074238'
  })
  }
}
//   firebase.auth().onAuthStateChanged((user)=>{
//       if(user){
//         this.setState({loggedIn:true})
//       }else{
//         this.setState({loggedIn:false})
//      }
//    })
//   }
//
//
// Signout=()=>{
//   firebase.auth().signOut()
//   GoogleSignin.revokeAccess();
//   GoogleSignin.signOut();
//   this.setState({ user: null });
// }
//
//
// press=()=>{
// alert(GoogleSignin.currentUser())
// }
//
// renderContent(){
// switch (this.state.loggedIn){
//   case true:
//  return (
//    <View style={styles.buttonStyle}>
//  <Button onPress={this.Signout}>Log Out</Button>
//  <Button
// onPress={this.press}
//  >user</Button>
//  </View>
// )
//   case false:
//   return <LoginForm />;
//
//   default :
//   return <Spinner size="large" />;
// }
// }


  render(){
    return(
<Router />
    )
  }
}

const styles={
  buttonStyle:{
    flexDirection:'row'
  }
}

export default App
