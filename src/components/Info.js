import React,{Component} from 'react'
import {KeyboardAvoidingView,Keyboard,Text,Picker,View} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import {Button,Card,CardSection,Input,Spinner} from './common'
import countries from '../files/Countries.json'

Keyboard.dismiss()


class Info extends Component {
constructor(){
  super()
  this.state={
    firstName:'',
    secondName:'',
    gender:'male',
    country:'AF',
    reports:0,
    qc:0
  }
  console.ignoredYellowBox = ['Setting a timer'];
}
updateGender=(gender)=>{
  this.setState({gender:gender})
}
updateCountry=(country)=>{
  this.setState({country:country})
}

finish=()=>{
  Keyboard.dismiss()
  if(this.state.firstName.length==0){
    alert('please enter the first name')
  }else{
  const {currentUser}=firebase.auth();
firebase.database().ref(`/users/${currentUser.uid}`)
.set({
  firstName:this.state.firstName,
  secondName:this.state.secondName,
  gender:this.state.gender,
  country:this.state.country,
  reports:this.state.reports,
  points:0,
  beginner:0,
  intermediate:0,
  advance:0
})
.then(()=>{
  Actions.start()
})
.catch((error)=>{
  alert(error)
})
}
}


  render(){
    return(
      <KeyboardAvoidingView  behavior="position" >
     <View>
     <View style={{backgroundColor:'#0c2e66',marginBottom:10,alignItems:'center'}}>
     <Text style={{padding:8,color:'white',fontSize:33,alignItems:'center',fontWeight:'bold'}}>Lanpract</Text>
     </View>
     <View style={{marginTop:20,marginBottom:40}}>
     <CardSection>
     <Input
     placeholder="First Name"
     label="First Name"
     onChangeText={firstName=>this.setState({firstName})}
       />
     </CardSection>
     <CardSection>
     <Input
     placeholder="Second Name"
     label="Second Name"
     onChangeText={secondName=>this.setState({secondName})}
       />
     </CardSection>
     <View style={{width:200,marginLeft:18}}>
     <Picker  selectedValue={this.state.gender} onValueChange={this.updateGender}>
       <Picker.Item label="male" value="male" />
       <Picker.Item label="female" value="female" />
     </Picker>
     <Picker  selectedValue={this.state.country} onValueChange={this.updateCountry}>
     {countries.map((country)=>{
       return  <Picker.Item key={country.label} label={country.label} value={country.value} />
     })}
     </Picker>
     </View>
     <CardSection>
     <Button onPress={this.finish}>Finish </Button>
     </CardSection>
     </View>
     </View>
     </KeyboardAvoidingView>
    )
  }
}

export default Info
