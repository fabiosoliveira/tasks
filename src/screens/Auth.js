import React, {useState} from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyle from '../commonStyles';
import AuthInput from '../components/AuthInput';

export default props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stageNew, setStageNew] = useState(false);

  function signInOrSignUp() {
    if (stageNew) {
      Alert.alert('Sucesso!', 'Criar conta');
    } else {
      Alert.alert('Sucesso!', 'Logar');
    }
  }

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
        <TouchableOpacity onPress={signInOrSignUp}>
          <View style={styles.button}>
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
