import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default props => {
  useEffect(() => {
    async function getUserData() {
      const userDataJson = await AsyncStorage.getItem('userData');
      let userData = null;

      try {
        userData = JSON.parse(userDataJson);
      } catch (e) {}

      if (userData && userData.token) {
        axios.defaults.headers.common.Authorization = `bearer ${
          userData.token
        }`;
        props.navigation.navigate('Home', userData);
      } else {
        props.navigation.navigate('Auth');
      }
    }

    getUserData();
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
