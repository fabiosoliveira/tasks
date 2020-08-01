import React, {useState} from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import commonStyles from '../commonStyles';

export default props => {
  const [desc, setDesc] = useState('');

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}
      animationType="slide">
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova tarefa</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a Descrição..."
          value={desc}
          onChangeText={texto => setDesc(texto)}
        />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={props.onCancel}>
            <Text style={styles.button}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.button}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: 40,
    margin: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
});
