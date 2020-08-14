import React from 'react';
import {ImageBackground, Text, StyleSheet} from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyle from '../commonStyles';

export default props => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Text style={styles.title}>Tasks</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.secondary,
    fontSize: 70,
    marginBottom: 10,
  },
});
