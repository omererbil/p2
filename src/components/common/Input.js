import React from 'react'
import {TextInput,View,Text} from 'react-native'

const Input =({placeholder,label,value,onChangeText,secureTextEntry})=>{
  const {inpuStyle,labelStyle,containerStyle}=styles
return(
<View style={containerStyle}>
<Text style={labelStyle}>{label}</Text>
<TextInput
secureTextEntry={secureTextEntry}
placeholder={placeholder}
autoCorrect={false}
style={inpuStyle}
value={value}
onChangeText={onChangeText}
underlineColorAndroid='transparent'
/>
</View>
)
}

const styles={
  inpuStyle:{
    color:'#000',
    paddingRight:5,
    paddingLeft:5,
    fontSize:18,
    lineHeight:23,
    flex:2
  },
  labelStyle:{
    fontSize:18,
    paddingLeft:20,
    flex:1
  },
  containerStyle:{
    height:40,
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  }
}
export {Input}
