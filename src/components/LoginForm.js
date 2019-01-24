import React,{Component} from 'react'
import {ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK,{AccessToken,LoginManager} from 'react-native-fbsdk'
import {Button,Card,CardSection,Input,Spinner} from './common'
import Icon from 'react-native-vector-icons/FontAwesome';





//-------------------------------------------------------------------------------
const {RNGoogleSignin}=NativeModules
var logIn
var credentialSaved
var User

class LoginForm extends Component{

  constructor(){
    super()
    this.state={
      user:null,
      loading:false
    }
  }



componentWillMount(){
  User =this.props.user
  console.ignoredYellowBox = ['Setting a timer'];

  GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true})
    .then(() => {
      // play services are available. can now configure library
    })
    .catch(err => {
      console.log('Play services error', err.code, err.message);
    });
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    webClientId: '177930074238-rricvj9ob63q5b2odargolvuphsa341k.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
    accountName: '', // [Android] specifies an account name on the device that should be used
})



}



//Login as facebook----------------------------------------------------------------------
fbAuth=()=>{
  logIn=0
  // const user=GoogleSignin.currentUser()
  LoginManager.logInWithReadPermissions(['public_profile','email'])
  .then((result)=> {
    AccessToken.getCurrentAccessToken()
    .then((data) => {
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    firebase.auth().signInAndRetrieveDataWithCredential(credential)

    .then((userData)=>{
      this.setState({loading:true})
      AsyncStorage.setItem('userData7',JSON.stringify({id:userData.user,login:'facebook'}))
      const user= firebase.auth().currentUser
       firebase.database().ref(`/users/${user.uid}`).on('value',(snapshot)=>{
         if(snapshot.val()){
           Actions.start()
         }else{
           Actions.info()
         }
     })
    })
  }).catch((error)=>{
    alert(error)
  })
  },(error)=> {
    alert('Login fail with error: ' + error);
  }
).catch((error)=>{
  alert(error)
});
}

//login with google--------------------------------------------------------------------
  gAuth= async ()  => {
    try {
      logIn=1
      const user=await GoogleSignin.signIn()
      const credential = firebase.auth.GoogleAuthProvider.credential(user.idToken)
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then((userData)=>{
          this.setState({loading:true})
          AsyncStorage.setItem('userData7',JSON.stringify({id:userData.user,login:'google'}))
          const user= firebase.auth().currentUser
           firebase.database().ref(`/users/${user.uid}`).on('value',(snapshot)=>{
             if(snapshot.val()){
               Actions.start()
             }else{
               Actions.info()
             }
          })
        })
      //this.setState({user})
    } catch (error) {
      if(error.code==='CANCELED'){
      }else{
      }
    }
  }

//render------------------------------------------------------------------------------
  render(){
    if(this.state.loading){
      return (
        <View style={{position: 'absolute',left: 0,right: 0,top: 0,bottom: 0,alignItems: 'center',justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>)
    }else{

    return(

      <KeyboardAvoidingView  behavior="position" >
     <View>
      <View style={styles.mainTextContainer}>
      <Text style={styles.mainText}>Lanpract</Text>
      <Text>English Speaking Practice </Text>
      </View>


      <View style={styles.socialButtonContainer}>
      <TouchableOpacity
      onPress={this.fbAuth}
      style={styles.socialButton}><Text style={styles.socialButtonText}><Icon size={18}  name="facebook"/>  Login with facebook</Text>
      </TouchableOpacity>

      </View>

       <View style={styles.googleButtonContainer}>
       <TouchableOpacity
       onPress={this.gAuth}
       style={styles.googleButton}><Text style={styles.googleButtonText}><Icon size={18}  name="google"/>  Login with google</Text>
       </TouchableOpacity>
       </View>

       </View>


         </KeyboardAvoidingView>
    )
    }

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

export default LoginForm
