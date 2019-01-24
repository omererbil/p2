import React,{Component} from 'react'
import {AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK,{AccessToken,LoginManager} from 'react-native-fbsdk'
import {Button,Card,CardSection,Input,Spinner} from './common'
import Icon from 'react-native-vector-icons/FontAwesome';


class Logout extends Component{
  constructor(){
  super()
    this.state={
      firstName:'',
      secondName:'',
      nameLoad:true
    }
  }
  componentDidMount(){
  const {currentUser}= firebase.auth()
   firebase.database().ref(`/users/${currentUser.uid}`)
   .on('value',(snapshot)=>{
     var firstName=snapshot.val().firstName
     var secondName=snapshot.val().secondName
     this.setState({firstName:firstName,secondName:secondName,nameLoad:false})
   })
 }
  logout= () => {
    if(this.props.logoutCheck=='facebook'){
     LoginManager.logOut()
     AsyncStorage.removeItem('userData7');
     Actions.login()
  }else{
       GoogleSignin.revokeAccess();
       GoogleSignin.signOut();
       AsyncStorage.removeItem('userData7');
       Actions.login()

  }




}

render(){
  return(
    <View>
    <View style={{backgroundColor:'#0c2e66',marginBottom:20,alignItems:'center'}}>
    <Text style={{padding:8,color:'white',fontSize:33,alignItems:'center',fontWeight:'bold'}}>Lanpract</Text>
    </View>
    <View>
    {this.state.nameLoad?
    <View>
    </View>
    :
    <View style={{alignItems:'center'}}>
      <Text style={{fontSize:16,fontWeight:'bold'}}>{this.state.firstName} </Text>
    </View>
    }
    </View>
    <View style={styles.socialButtonContainer}>
    <TouchableOpacity
    onPress={this.logout}
    style={{backgroundColor:'white',borderRadius:15,}}><Text style={{color:'black',fontSize:22, padding:10,  alignSelf:'center',paddingLeft:20,paddingRight:20}}>  logout</Text>
    </TouchableOpacity>

    </View>
    <View style={{marginTop:20}}>
     <CardSection>
     <Button onPress={()=>Actions.start()}> Go to chat </Button>
     </CardSection>
     </View>
    </View>
  )
}
}
const styles={
  container:{
    flex:1,
    backgroundColor:'#ECECEC'
  },
  mainTextContainer:{
    alignItems:'center',
  marginTop:80

},
mainText:{
  fontSize:30,
  fontWeight:'bold'
},
socialButtonContainer:{
  alignItems:'center',
  marginTop:20,

},

googleButtonContainer:{
  alignItems:'center'

},
emailContainer:{
  alignItems:'center',
  marginTop:20,
},
googleButtonText:{
  color:'white',
  padding:10,
  alignSelf:'center',
  paddingLeft:25,
  paddingRight:25
},
socialButton:{
backgroundColor:'#3B5998',
  borderRadius:15,
},
socialButtonText:{
  color:'white',
  padding:10,
  alignSelf:'center',
  paddingLeft:20,
  paddingRight:20


},
googleButton:{
  backgroundColor:'#dd4b39',
  marginTop:20,
  borderRadius:15,
},
  errorTextStyle:{
    fontSize:20,
    alignSelf:'center',
    color:'red'
  }
}

export default Logout
