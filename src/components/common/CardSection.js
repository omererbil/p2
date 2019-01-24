import React from 'react'
import {View} from 'react-native'

const CardSection=(props)=>{
  return (
    <View style={styles.containerStyle}>
{props.children}
    </View>
  )
}
const styles={
   containerStyle:{
    padding:5,
    flexDirection:'row',
    position:'relative',
    justifyContent: 'center',
    alignItems: 'center'

  }
}

export  {CardSection}
