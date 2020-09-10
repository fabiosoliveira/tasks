import React from 'react';
import {ScrollView, View, Text, StyleSheet, Platform} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {Gravatar} from 'react-native-gravatar';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default props => {
  const logaout = () => {
    delete axios.defaults.headers.common.Authorization;
    AsyncStorage.removeItem('userData');
    props.navigation.navigate('AuthOrApp');
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.header}>
        <Gravatar
          style={styles.avatar}
          options={{
            email: props.navigation.getParam('email'),
            secure: true,
          }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
          <Text style={styles.email}>{props.navigation.getParam('email')}</Text>
        </View>
        <TouchableOpacity onPress={logaout}>
          <View style={styles.logoutIcon}>
            <Icon name="sign-out" size={30} color="#800" />
          </View>
        </TouchableOpacity>
      </View>
      <DrawerItems {...props} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  title: {
    color: '#000',
    fontFamily: commonStyles.fontFamily,
    fontSize: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 30,
    margin: 10,
    backgroundColor: '#222',
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.mainText,
    marginBottom: 5,
  },
  email: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    color: commonStyles.colors.subText,
    marginBottom: 10,
  },
  logoutIcon: {
    marginLeft: 10,
    marginBottom: 10,
  },
});
