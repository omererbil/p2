//import components
import React from 'react'
import {Text,View,Platform} from 'react-native'
//create components
const Header =(props) =>{
  const {textStyle,viewStyle}=styles
  return (
    <View style={viewStyle}>
    <Text style={textStyle}>{props.headerText}</Text>
    </View>
)}

const styles={
  viewStyle:{
    backgroundColor:'#F8F8F8',
    justifyContent:'center',
    alignItems:'center',
    height:60,
    paddingTop:15,
    shadowColor:'#000',
    shadowOffset:{width:0,height:20},
    ...Platform.select({
            ios:{
              shadowOpacity:0.2
            },
            android:{
                elevation:5

            },
        }),
        position:'relative'

  },
  textStyle:{
    fontSize:20
  }
}
//render components
export  {Header};
