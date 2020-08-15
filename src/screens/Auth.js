import React, {useState} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyle from '../commonStyles';
import AuthInput from '../components/AuthInput';

import {server, showError, showSuccess} from '../common';

export default props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stageNew, setStageNew] = useState(false);

  function clearState() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setStageNew(false);
  }

  function signInOrSignUp() {
    if (stageNew) {
      signup();
    } else {
      signin();
    }
  }

  async function signup() {
    try {
      await axios.post(`${server}/signup`, {
        name,
        email,
        password,
        confirmPassword,
      });

      showSuccess('Usuário cadastrado!');
      clearState();
    } catch (e) {
      showError(e);
    }
  }

  async function signin() {
    try {
      const res = await axios.post(`${server}/signin`, {
        email,
        password,
      });

      axios.defaults.headers.common.Authorization = `bearer ${res.data.token}`;
      props.navigation.navigate('Home');
    } catch (e) {
      showError(e);
    }
  }

  const validation = [];
  validation.push(email && email.includes('@'));
  validation.push(password && password.length >= 6);

  if (stageNew) {
    validation.push(name && name.trim().length >= 3);
    validation.push(password === confirmPassword);
  }

  const validForm = validation.reduce((t, a) => t && a);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>
          {stageNew ? 'Cria a sua conta' : 'Informe seus dados'}
        </Text>
        {stageNew && (
          <AuthInput
            icon="user"
            placeholder="Nome"
            value={name}
            style={styles.input}
            onChangeText={text => setName(text)}
          />
        )}
        <AuthInput
          icon="at"
          placeholder="E-mail"
          value={email}
          style={styles.input}
          onChangeText={text => setEmail(text)}
        />
        <AuthInput
          icon="lock"
          placeholder="Senha"
          value={password}
          style={styles.input}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        {stageNew && (
          <AuthInput
            icon="asterisk"
            placeholder="Confirmação de Senha"
            value={confirmPassword}
            style={styles.input}
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        )}
        <TouchableOpacity onPress={signInOrSignUp} disabled={!validForm}>
          <View
            style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
            <Text style={styles.buttonText}>
              {stageNew ? 'Registrar' : 'Entrar'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{padding: 10}}
        onPress={() => setStageNew(!stageNew)}>
        <Text style={styles.buttonText}>
          {stageNew ? 'Já pussui conta?' : 'Ainda não possui conta?'}
        </Text>
      </TouchableOpacity>
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
  subtitle: {
    fontFamily: commonStyle.fontFamily,
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    width: '90%',
  },
  input: {
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  buttonText: {
    fontFamily: commonStyle.fontFamily,
    color: '#FFF',
    fontSize: 20,
  },
});
