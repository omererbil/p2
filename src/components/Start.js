import React,{Component} from 'react'
import {YellowBox,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity,AppState} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK,{AccessToken,LoginManager} from 'react-native-fbsdk'
import {Button,Card,CardSection,Input,Spinner} from './common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import PushController from './PushController';
import PushNotification from 'react-native-push-notification';
import OneSignal from 'react-native-onesignal'; // Import package from node modules





class Start extends Component{

constructor(){
  super()

  this.state={
    userid:null,
    loading:true,
    logoutCheck:null
  }


  this.handleAppStateChange = this.handleAppStateChange.bind(this);
  OneSignal.init("d0fe1071-0ba4-4733-ba4c-8a25f12e45f7");
  OneSignal.addEventListener('received', this.onReceived);
  OneSignal.addEventListener('opened', this.onOpened);
  OneSignal.addEventListener('ids', this.onIds);
  this._retrieveData();

}


componentDidMount(){
  AppState.addEventListener('change', this.handleAppStateChange);

}
componentWillMount(){
  YellowBox.ignoreWarnings(['Setting a timer']);
  const _console = _.clone(console);
  console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
    }
  };

}

_retrieveData=async () => {
  try{
      const data=await AsyncStorage.getItem('userData7')
      if(data){

      const userid=JSON.parse(data).id.uid
       logoutCheck=JSON.parse(data).login
      firebase.database().ref(`/users/${userid}`)
      .on('value',(snapshot)=>{
        if(snapshot.val()){
        this.setState({userid:userid,loading:false,logoutCheck:logoutCheck})

    }else{
      Actions.info()
    }
    })
    }else{

      this.setState({userid:null,loading:false})
      Actions.login()
    }

  }catch{
// ADD THIS THROW error
throw error;
};

}

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
   OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);

   }

   onReceived(notification) {
   console.log("Notification received: ", notification);
 }

 onOpened(openResult) {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
}

onIds(device) {
   console.log('Device info: ', device);
 }
 handleAppStateChange(appState) {
   if (appState === 'background') {
     console.log('background')
     let date = new Date(Date.now() + (72*60*60*1000));
     if (Platform.OS === 'ios') {
       date = date.toISOString();
     }

     PushNotification.localNotificationSchedule({
       title: "English Speaking Practice",
       message: "You should talk 30 minutes everyday for improving English Speaking",
       playSound: false,
       color:'#134ac1',
       date,
     });
   }
   if (appState === 'active') {
PushNotification.cancelAllLocalNotifications()
 }
 }

  render(){
return(
  <View>
  {this.state.loading?
    <View style={{marginTop:200}}>
    <View style={{alignItems:'center'}}>
    <Text style={{fontSize:20,fontWeight:'bold'}}>Lanpract </Text>
    <Text style={{fontSize:17}}>English speaking practice </Text>
    </View>
    <ActivityIndicator size='large'/>
    </View>
  :
  <View>
  <View style={{flexDirection:'row',backgroundColor:'#0c2e66'}}>

  <View style={{flex:20,alignItems:'flex-end'}}>
  <Text style={{padding:8,color:'white',fontSize:33,fontWeight:'bold'}}>Lanpract </Text>
  </View>


  <View style={{flex:9,alignItems:'flex-end'}}>
  <TouchableOpacity onPress={()=>Actions.logout({logoutCheck:this.state.logoutCheck})}>
  <Text style={{marginRight:8,marginTop:12,padding:8,color:'white',fontWeight:'bold'}}><Icon size={22}  name="menu"/></Text>
  </TouchableOpacity>
  </View>

  </View>
  <View style={{marginTop:40}}>

  <View style={{alignItems:'center',marginBottom:10}}>
  <Text style={{fontSize:17}}>English speaking practice </Text>
  </View>

  <View style={{alignItems:'center',marginBottom:15}}>
  <Text style={{fontSize:16,color:'#014cc4'}}>Talk and do activities with other people</Text>
  <Text style={{fontSize:16,color:'#014cc4'}}> around the world</Text>
  </View>


<CardSection>
<TouchableOpacity
 style={styles.btnStart}
 onPress={Actions.chat}
 >
<Text style={styles.textStart}>Start</Text>
</TouchableOpacity>
  </CardSection>



    </View>
    </View>
}
</View>
)

}
}

const styles={
  btnStart:{
    alignSelf:'center',
    backgroundColor:'#32bc00',
    borderRadius:50,
    marginLeft:10,
    marginRight:10,
  },
  textStart:{
    alignSelf:'center',
    color:'#ffffff',
    fontSize:18,
    padding:8,
    paddingLeft:30,
    paddingRight:30,
    fontWeight:'bold',
  }
}

export default Start
