import React, { Component } from 'react';
import firebase from 'firebase'
import {ButtonEnd,Header,Card,CardSection,Button,Spinner} from './common'
import {Actions } from 'react-native-router-flux';
import InCallManager from 'react-native-incall-manager';
import Image2 from 'react-native-scalable-image';
import * as Progress from 'react-native-progress';
import KeepAwake from 'react-native-keep-awake';




import {
  Image,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ListView,
  Dimensions,
  StatusBar,
  YellowBox,
  Alert,
  ScrollView,
  FlatList,
  Picker,
  AsyncStorage,
  ActivityIndicator,
  AppState
} from 'react-native';


const { width, height } = Dimensions.get('window')
import io from 'socket.io-client';
import _ from 'lodash'
const socket = io.connect('http://socket-govan.c9users.io', {transports: ['websocket']});
import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
//defines-----------------------------------------------------------------------------
let container
let username
let incallwith = ""
let connectedUser
let pc
var stream
var partner1
var partner2
var myGender
var myName
var myPoint
var hisName
var hisGender
var hisPoint
var female=0
var genderCheck
var answerGender
var userid
var userId
var logoutCheck
var histopicArray
var hisImage
var myTopic
var callerID
var calleeID

var rates=['beginner','intermediate','advance']
//Random--------------------------------------------------------------------------------

//icons---------------------------------------------------------------------------------------
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';




getUserMedia({
          audio: true,
          video: false

      }, (mystream) => {
        stream=mystream
      }, error => {
          console.log('Oops, we getting error', error.message);
          throw error;

  });

function onLogin(data){
  _this.setState({showAll:true})
  container.setState({currScreen:'loading'})

       username = data.username;
       answerGender=data.genderChoose


}

//onAnswer-------------------------------------------------------------------------------------
function onAnswer(data){
  hisName=data.hisName
  hisGender=data.hisGender
  hisPoint=data.hisPoint
  hisTopic=data.hisTopic
  _this.setState({showAll:true,firstName:data.hisName,secondName:myName,hisName:data.hisName,hisGender:data.hisGender})
  container.setState({currScreen:'chat'})

               connectedUser=data.callername
              calleeID=data.callername
               partner2=connectedUser
               pc.setRemoteDescription(new RTCSessionDescription(data.offer))
               pc.createAnswer(function(answer){
                   pc.setLocalDescription(answer)
                 socket.send({
                  type:"call_accepted",
                  answer:answer,
                  name:data.callername,
                  from:username,
                  answerGender:answerGender

                })
               },function(error){
                   throw error
               })
           }

function handleCandidate(data){
  pc.addIceCandidate(new RTCIceCandidate(data.candidate))
}

//onResponse---------------------------------------------------------------------------
function onResponse(data){
  _this.setState({showAll:true})
  container.setState({currScreen:'chat'})
    pc.setRemoteDescription(new RTCSessionDescription(data.answer))

}

//room message-------------------------------------------------------------------------
socket.on('roommessage', function(message){
            var data = message;
            switch(data.type) {
                 case "login":
                        console.log("New user : "+data.username);
                        break;
                 case "disconnect":
                   console.log("User disconnected : "+data.username);
                 break;
                default:
                    break;
            }
        })


//start chat---------------------------------------------------------------------------
      function start_chat(data){

        histopicArray=data.histopicArray
        hisImage=data.hisImage
        container.setState({topicArray:histopicArray,topicArrayLoad:false,image:hisImage,imageLoad:false})
        _this.setState({firstName:myName,secondName:data.hisName,hisName:data.hisName,hisGender:data.hisGender})
        hisName=data.hisName
        hisGender=data.hisGender
        hisPoint=data.hisPoint
       callerID = data.callerID;
         username=data.username
         partner1=callerID


         if (callerID == "") {
           alert('Please start again');
         } else {

               connectedUser=callerID
               pc.createOffer(function(offer){
                    socket.send({
                        type: "call_user",
                        offer:offer,
                        name: callerID,
                        callername: data.username,
                        myName:myName,
                        myGender:myGender,
                        myPoint:myPoint,
                        myTopic:myTopic
                      })
                      pc.setLocalDescription(offer)
                   },function(error){
                       throw error
            })
         }
       }




    function handleEnd(){
      if(_this.state.show){
      _this.setState({showAll:false})
    }
      container.setState({currScreen:'rate',remoteAudio:null})
        connectedUser=null;


        pc.close();
        pc.onicecandidate=null;
        pc.onaddstream=null

    }

    //message-----------------------------------------------------------------------

socket.on('message', function(message){
            var data = message;
            container.setState({ callResponse: "" })
            switch(data.type) {

              case 'start_chat':
                    start_chat(data);
                    break
              case 'receive' :
                   onLogin(data);
                   break;
                case "answer":
                      console.log("getting called");
                        onAnswer(data);
                        break;
                case "call_response":
                        onResponse(data);
                      break;
                 case 'candidate':
                        handleCandidate(data);
                        break;
                  case 'end_talk':
                       handleEnd();
                       break;
                default:
                    break;
            }
    })


    //class chat===============================================================================
const User=0
    class Chat extends Component {
      _isMounted = false
      constructor(){
        super()
        console.ignoredYellowBox = [
        'Setting a timer'
        ];
        this.state={
          showAll:false,
          show:true,
          userid:null,
          myName:null,
          myGender:null,
          myPoint:null,
          loading:true,
          logoutCheck:null,
          firstName:null,
          secondName:null,
          hisName:null,
          hisGender:''
        }
  }



      componentDidMount= async () => {
        this._isMounted = true;
        try{
            const data=await AsyncStorage.getItem('userData7')
            if(data){

            const userid=JSON.parse(data).id.uid
             logoutCheck=JSON.parse(data).login
            firebase.database().ref(`/users/${userid}`)
            .once('value',(snapshot)=>{
              if(snapshot.val()){
                if (this._isMounted) {

              myGender=  snapshot.val().gender
              myName=  snapshot.val().firstName
              myPoint=  snapshot.val().points
              this.setState({userid:userid,myName:myName,myGender:myGender,myPoint:myPoint,loading:false,logoutCheck:logoutCheck})
}
          }else{
            Actions.info()
          }
          })
          }else{

            this.setState({userid:null,loading:false})
            Actions.login()
          }

        } catch {
console.log('There has been a problem with your fetch operation: ' + error.message);
 // ADD THIS THROW error
  throw error;
};
         _this=this
      }

      componentWillUnmount() {
         this._isMounted = false;
       }



  end_talk(){
    if(partner1){
     socket.send({
         type:'end_talk',
         name:partner1
     })
   }else{
     socket.send({
         type:'end_talk',
         name:partner2
     })

     }
      if(pc){
      container.setState({remoteAudio:null,connectedUser:null})
      pc.close();
      pc.onicecandidate=null;
      pc.onaddstream=null
    }
      Actions.start()

 }





      render(){
        if(this.state.loading){
        return (
          <View style={{position: 'absolute',left: 0,right: 0,top: 0,bottom: 0,alignItems: 'center',justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>)
        }else{


        if(this.state.showAll){

        return(
          <View style={{flex:1}}>
          <View style={{backgroundColor:'#0e3e8c',marginBottom:20,alignItems:'center'}}>
          <Text style={{padding:8,color:'white',fontSize:33,alignItems:'center',fontWeight:'bold'}}>Lanpract</Text>
          </View>

         <Home {...this.state} handlechange={this.handlechange}/>
        </View>
        )
      } else{
        return(
          <View style={{flex:1}}>
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



          <Home {...this.state} handlechange={this.handlechange} />

          </View>
        )
        }
      }
      }
    }


//home====================================================================================\


class Home extends Component {
  constructor(props) {
     super(props);
     this.handleAppStateChange = this.handleAppStateChange.bind(this);
     console.ignoredYellowBox = [
     'Setting a timer'
     ];
     this.state = {
       currScreen: 'loading',
       message : '',
       callResponse : '',
       remoteAudio:null,
       genderChoose:'All',
       speaker:true,
       lesson:'',
       lessonLoad:true,
       timeFinish:false,
       waiting:true,
       topicArray:'',
       topicArrayLoad:true,
       image:'',
       imageLoad:true,
       wordArray:'',
       wordLoad:true,
       active:null,
       num:0



     }

  }


  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange);
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
      }
    };
    container = this;
      this.fetchLesson()
      this.fetchTopics()
      this.fetchWords()
      this.phoneSpeaker()

      this.intervalID = setInterval(
                () => this.tick(),
                1000
              );
  }
componentWillUnmount(){
  AppState.removeEventListener('change', this._handleAppStateChange);
  clearInterval(this.intervalID);

}
tick() {
     newNum=this.state.num+0.015
     if(newNum>1.05){
       this.setState({timeFinish:true,waiting:false})
     }
    this.setState({
      num:newNum
    });
  }

handleAppStateChange(appState) {
  if (appState === 'background') {
        if(this.state.currScreen==='chat'){
          this.end_talk()
        }
        if(this.state.currScreen==='loading'){
          socket.send({
            type:'deleteMe',
            name:this.props.userid
          })
          Actions.start()
        }

  }}
//check--------------------------------------------------------------------------------
   check(){
     const userId=this.props.userid
     var configuration = { "iceServers":
                      [{"url":"stun:w2.xirsys.com"},
                      {"username":"57166234-aed6-11e8-bb99-88042bd89887","url":"turn:w2.xirsys.com:80?transport=udp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"},
                      {"username":"57166234-aed6-11e8-bb99-88042bd89887","url":"turn:w2.xirsys.com:3478?transport=udp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"},{"username":"57166234-aed6-11e8-bb99-88042bd89887","url":"turn:w2.xirsys.com:80?transport=tcp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"},{"username":"57166234-aed6-11e8-bb99-88042bd89887",
                      "url":"turn:w2.xirsys.com:3478?transport=tcp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"},{"username":"57166234-aed6-11e8-bb99-88042bd89887","url":"turns:w2.xirsys.com:443?transport=tcp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"},{"username":"57166234-aed6-11e8-bb99-88042bd89887","url":"turns:w2.xirsys.com:5349?transport=tcp","credential":"571662ac-aed6-11e8-891e-8cbbeec05544"}]
                       }


     pc=new RTCPeerConnection(configuration)
                 pc.addStream(stream)
                 pc.onaddstream=function(e){
                   container.setState({
                     remoteAudio:e.stream.toURL()
                   })
                 }
               pc.onicecandidate=function(event){
                 if(event.candidate){
                     socket.send({
                         type:'candidate',
                         candidate:event.candidate,
                         name:connectedUser
                     })
                     console.log('candidate '+event.candidate)
                 }
             }
            socket.send({
                type:'check',
                name:this.props.userid,
                myGender:this.props.myGender,
                myPoint:this.props.myPoint,
                myName:this.props.myName,
                genderChoose:this.state.genderChoose,
                mytopicArray:this.state.topicArray,
                myImage:this.state.image
            })


}

//end talk----------------------------------------------------------------------------
             end_talk(){
               if(_this.state.show){
               _this.setState({showAll:false})
             }

               if(partner1){
                socket.send({
                    type:'end_talk',
                    name:partner1
                })
              }else{
                socket.send({
                    type:'end_talk',
                    name:partner2
                })

                }
                handleEnd()
            }


             handleEnd(){
                this.setState({currScreen:'rate',remoteAudio:null,connectedUser:null})
                pc.close();
                pc.onicecandidate=null;
                pc.onaddstream=null
            }


            updateGender=(genderChoose)=>{
              this.setState({genderChoose:genderChoose})
            }



        phoneSpeaker(){
        this.setState({speaker:true})
        InCallManager.setSpeakerphoneOn(true)
        InCallManager.setForceSpeakerphoneOn(true)
        }

        phoneSpeakerOff(props){
        this.setState({speaker:false})
        InCallManager.setSpeakerphoneOn(false)
        InCallManager.setForceSpeakerphoneOn(false)
        }

       fetchLesson(){
         fetch('https://socket-govan.c9users.io/lesson')
          .then((response) => response.json())
          .then((lesson) => {
            this.setState({lesson:lesson,lessonLoad:false})
          })
          .catch((error) => {
            console.error(error);
          });
       }

       fetchTopics(){
         fetch('https://socket-govan.c9users.io/topics')
          .then((response) => response.json())
          .then((topicArray) => {
            this.setState({topicArray:topicArray,topicArrayLoad:false})
            this.fetchImage()

          })
          .catch((error) => {
            console.error(error);
          });
       }

       fetchImage(){
         fetch('https://socket-govan.c9users.io/images')
          .then((response) => response.json())
          .then((image) => {
            this.setState({image:image.i,imageLoad:false})
            this.check()
          })
          .catch((error) => {
            console.error(error);
          });
       }

       fetchWords(){
         fetch('https://socket-govan.c9users.io/words')
          .then((response) => response.json())
          .then((wordArray) => {
            this.setState({wordArray:wordArray,wordLoad:false})
          })
          .catch((error) => {
            console.error(error);
          });
       }


      refresh(){
        this.setState({timeFinish:false,waiting:true,num:0})
        this.fetchLesson()
        this.fetchTopics()

      }






    //login----------------------------------------------------------------------------
  renderLoading(){

    return(
        <View style={{flex:1}}>
      {this.state.waiting?
      <View style={{flexDirection:'column'}}>
      <View style={{marginBottom:4,alignItems:'center'}}>
      <Text style={{fontSize:20}}>please wait</Text>
      <Text style={{fontSize:18}}>until someone connects</Text>
      <KeepAwake />
      </View>
      <View style={{alignItems:'center',marginBottom:10}}>
      <Progress.Circle progress={this.state.num} size={70} showsText={true}  borderWidth={2}/>
      </View>

      </View>
           :
           <View >
           <View style={{alignItems:'center'}}>
           <Text style={{color:'red'}}>Nobody joined </Text>
           </View>
           <CardSection>
           <TouchableOpacity
            style={styles.btnRefresh}
            onPress={this.refresh.bind(this)}
            >
           <Text style={styles.textRefresh}>refresh</Text>
           </TouchableOpacity>
           </CardSection>
           </View>
         }
        <ScrollView style={{marginTop:20,marginBottom:5,marginLeft:5,marginRight:5}}>
        <View>
        {this.state.lessonLoad?
          <View>
          </View>
        :
        <View>
        {this.state.lesson.map((lesson,j)=>{
          return(

            <View key={j}>
            <Text style={{fontSize:16}}>{lesson}</Text>
            </View>
          )}
        )}
        </View>
      }

        </View>


      </ScrollView>
        </View>
      )



}
//chat----------------------------------------------------------------------------------------------------------
renderChat(){

    return(

        <View style={{paddingBottom:1,flex:1}}>
      <ScrollView style={{marginBottom:5,marginLeft:5,marginRight:5}}>

      <View style={{flexDirection:'row', flexWrap:'wrap'}} >
      <Text style={{fontSize:16,margin:5}}><Text style={{fontSize:18,fontWeight:'bold',color:'#1d911b'}}>{this.props.myName} </Text> and <Text style={{fontSize:18,fontWeight:'bold',color:'#1d911b'}}> {this.props.hisName} </Text> are now connected  </Text>
      </View>

      <View style={{marginTop:10,borderBottomColor:'grey',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',color:'#1559c6'}}>activity 1</Text>
        <KeepAwake />
        <Text style={{fontSize:15,margin:5}}>lets talk about one of these topics</Text>
        {this.state.topicArrayLoad?
          <View>
          </View>
        :
        <View>
        {this.state.topicArray.map((topic,j)=>{
          return(

            <View style={{flexDirection:'row', flexWrap:'wrap'}} key={j}>
            <Text style={styles.dot}></Text><Text style={{fontSize:16,fontWeight:'bold'}}>{topic}</Text>

            </View>
          )}
        )}
        </View>
      }
        </View>
        <View style={{marginTop:10,borderBottomColor:'grey',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',color:'#1559c6'}}>activity 2</Text>
        <Text style={{fontSize:15,margin:5}}>find the differences between two images :</Text>
        <View style={{marginBottom:10}}>
         <Text style={{backgroundColor:'#fbffd8',fontSize:14,padding:9,borderRadius:15}}>Note:if you don't know any words you can get help from each other</Text>
        </View>
        <View style={{flexDirection:'row', flexWrap:'wrap'}} >
        <Text style={{fontSize:15,margin:5}}>first <Text style={{fontSize:16,fontWeight:'bold'}}>{this.props.firstName}</Text> , second <Text style={{fontSize:16,fontWeight:'bold'}}>{this.props.secondName}</Text> and so on:</Text>
        </View>

        {this.state.imageLoad?
          <View>
          </View>
        :
        <View>
            <View style={{flexDirection:'row', flexWrap:'wrap'}} >
            <Image2 width={Dimensions.get('window').width} source={{uri: 'http://socket-govan.c9users.io/'+this.state.image}} />


          </View>
        </View>
      }

        </View>

        <View style={{marginTop:10,borderBottomColor:'grey',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',color:'#1559c6'}}>activity 3</Text>
        <Text style={{fontSize:15,margin:5}}>Describe one of the words without saying it</Text>
        {this.state.wordLoad?
          <View>
          </View>
        :
        <View>
        {this.state.wordArray.map((word,j)=>{
          return(

            <View style={{flexDirection:'row', flexWrap:'wrap'}} key={j}>
            <Text style={styles.dot}></Text><Text style={{fontSize:16,fontWeight:'bold'}}>{word}</Text>

            </View>
          )}
        )}
        </View>
      }

        <View style={{flexDirection:'row', flexWrap:'wrap'}} >
        <Text style={{fontSize:15,margin:5}}>for example discribe the word <Text style={{fontSize:16,fontWeight:'bold',color:'#1d5ec6'}}>Sky</Text>  :</Text>
       </View>
        <Text style={{fontSize:15,margin:5}}>1-the word has three letters </Text>
        <Text style={{fontSize:15,margin:5}}>2-at the day the color is blue </Text>

        </View>
      </ScrollView>

      <View style={{height:54,backgroundColor:'#cae2f1'}}>
      <View style={{alignItems:'center',flex:1,flexDirection:'row'}}>
      <View style={{flex:20,alignItems:'center',marginTop:6}}>
      {this.state.speaker?
      <TouchableOpacity onPress={this.phoneSpeakerOff.bind(this)} style={{backgroundColor:'white',borderRadius:10,marginBottom:10}} >
      <Text style={{padding:6,color:'#0eb725'}}><Icon2 size={22}  name="volume-up"/></Text>
      </TouchableOpacity>
      :
      <TouchableOpacity onPress={this.phoneSpeaker.bind(this)} style={{backgroundColor:'white',borderRadius:10,marginBottom:10}} >
      <Text style={{padding:6}}><Icon2 size={22}  name="volume-up"/></Text>
      </TouchableOpacity>
    }
    </View>
    <View style={{flex:12,alignItems:'flex-start'}}>
      <ButtonEnd
      onPress={this.end_talk}>
        <Icon size={22}  name="phone-hangup"/>
      </ButtonEnd>
      </View>
      </View>
      </View>
        </View>
      )



}

renderRate(){
  return(
    <View style={{alignItems:'center',marginTop:30}}>
    {this.props.hisGender=='male'?
    <Text style={{fontSize:18,margin:5,fontWeight:'bold'}}>please rate his english level</Text>
  :
      <Text style={{fontSize:18,margin:5,fontWeight:'bold'}}>please rate her english level</Text>
     }
    <View>
    {rates.map((rate,j)=>{
      return(

        <View key={j}>
       { this.state.active==j?
        <TouchableOpacity style={styles.btn}>
        <Image style={styles.img} source={{uri:'https://cdn4.iconfinder.com/data/icons/proglyphs-editor/512/Radio_Button_-_Checked-512.png'}} />
          <Text style={{fontWeight:'bold',fontSize:18}}>{rate}</Text>
        </TouchableOpacity>
        :
        <View style={{margin:3}}>
        <TouchableOpacity onPress={()=>{
             this.setState({active:j,activeLoad:true})

             }} style={styles.btn}>
        <Image style={styles.img} source={{uri:'https://cdn3.iconfinder.com/data/icons/materia-interface-vol-2/24/008_083_radio_button_unchecked_control-512.png'}} />
         <Text style={{fontSize:16}}>{rate}</Text>
        </TouchableOpacity>
       </View>
      }

        </View>
      )

    })}
    </View>
    <View style={{marginTop:20}}>
    <CardSection>
  <TouchableOpacity onPress={this.submit.bind(this)} style={styles.btnRate}>
  <Text style={styles.textRate}>submit </Text>
  </TouchableOpacity>
  </CardSection>
    <View style={{marginTop:200,alignItems:'center'}}>
          <CardSection>
          <TouchableOpacity
           style={styles.btnReport}
           onPress={this.reportUser.bind(this)}
           >
          <Text style={styles.textReport}>report user</Text>
          </TouchableOpacity>
          </CardSection>
          </View>
          </View>
        </View>
  )
}

submit(){
  if(callerID){


    var beginner=null
    var intermediate=null
    var advance=null
    var k=this.state.active


    firebase.database().ref('/users/'+callerID)
    .once('value',(snapshot)=>{
      if(k==0){
       beginner=snapshot.val().beginner+1
       firebase.database().ref('/users/'+callerID)
       .update({beginner:beginner})
       Actions.start()
      }if(k==1){
       intermediate=snapshot.val().intermediate+1
       firebase.database().ref('/users/'+callerID)
       .update({intermediate:intermediate})
       Actions.start()
      }if(k==2){
       advance=snapshot.val().advance+1
       firebase.database().ref('/users/'+callerID)
       .update({advance:advance})
       Actions.start()
     }
  })
  }else{

    var beginner=null
    var intermediate=null
    var advance=null
    var k=this.state.active


    firebase.database().ref('/users/'+calleeID)
    .once('value',(snapshot)=>{
      if(k==0){
       beginner=snapshot.val().beginner+1
       firebase.database().ref('/users/'+calleeID)
       .update({beginner:beginner})
       Actions.start()
      } if(k==1){
       intermediate=snapshot.val().intermediate+1
       firebase.database().ref('/users/'+calleeID)
       .update({intermediate:intermediate})
       Actions.start()
      } if(k==2){
       advance=snapshot.val().advance+1
       firebase.database().ref('/users/'+calleeID)
       .update({advance:advance})
       Actions.start()
     }
  })
  }
}

reportUser(){
  var reports
  if(callerID){
    firebase.database().ref('/users/'+callerID)
    .once('value',(snapshot)=>{
       reports=snapshot.val().reports+1
         firebase.database().ref('/users/'+callerID)
         .update({reports:reports})
         Actions.start()
    })

   }
  if(calleeID){
    firebase.database().ref('/users/'+calleeID)
    .once('value',(snapshot)=>{
       reports=snapshot.val().reports+1
         firebase.database().ref('/users/'+calleeID)
         .update({reports:reports})
         Actions.start()
    })

   }


 }
//render-----------------------------------------------------------------------------

  render() {
    switch (this.state.currScreen) {
        case 'loading':
        return this.renderLoading();
        break;
        case 'chat' :
        return this.renderChat();
        break;
        case 'rate' :
        return this.renderRate();
        break;
      default:

    }


  }

}



const styles = {
  img:{
    width:20,
    height:20,
    marginRight:20
    },
  btn:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  rowContainer: {
  flex: 1,
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  toolbar:{
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 55,
        color:'#fff',
        textAlign:'center'
    },
    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1
    },
    btnRate:{
      alignSelf:'stretch',
      backgroundColor:'#2b5dad',
      borderRadius:5,
      marginLeft:5,
      marginRight:5,
    },
    btnRefresh:{
      alignSelf:'stretch',
      backgroundColor:'#2b5dad',
      borderRadius:5,
      marginLeft:5,
      marginRight:5,
    },
    textRate:{
      alignSelf:'center',
      color:'#ffffff',
      fontSize:18,
      padding:10,
      fontWeight:'bold',
    },
    textRefresh:{
      alignSelf:'center',
      color:'#ffffff',
      fontSize:18,
      padding:10,
      fontWeight:'bold',
    },
    btnReport:{
      alignSelf:'stretch',
      backgroundColor:'#ce2f2f',
      borderRadius:5,
      marginLeft:5,
      marginRight:5,
    },
    textReport:{
      alignSelf:'center',
      color:'#ffffff',
      fontSize:16,
      padding:6,
      fontWeight:'bold',
    },
    btnQuizeDisable:{
      alignSelf:'stretch',
      backgroundColor:'#abd9f4',
      borderRadius:5,
      marginLeft:5,
      marginRight:5,


    },
    textQuizeDisable:{
      alignSelf:'center',
      color:'#8c9193',
      fontSize:19,
      padding:10,
      fontWeight:'bold',
    },
    image:{
      alignItems:'center',
      width:170,
      height:170,
      marginTop:10,
    },
    hisImage:{
      alignItems:'center',
      width:70,
      height:70,
      marginTop:10,
    },
    btnEnd:{
      backgroundColor:'red',
      borderRadius:5,
    },
    textEnd:{
      alignSelf:'center',
      color:'#ffffff',
      padding:4
    },
    dot:{
      width:5,
      height:5,
      backgroundColor:'black',
      borderRadius:50,
      alignItems:'center',
      margin:10
    }
}


export default Chat
