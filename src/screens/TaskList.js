import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';

import {server, showError} from '../common';
import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import AddTask from './AddTask';

export default props => {
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks, showDoneTasks, showAddTask, tasks]);

  useEffect(() => {
    const f = async () => {
      const stateString = await AsyncStorage.getItem('tasksState');
      const state = JSON.parse(stateString);

      if (!state) {
        return;
      }

      setShowDoneTasks(state.showDoneTasks);
    };

    f();
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTasks,
      }),
    );
  }, [showDoneTasks]);

  async function loadTasks() {
    try {
      const maxDate = moment().format('YYYY-MM-DD 23:59:59');

      const res = await axios.get(`${server}/tasks?date=${maxDate}`);

      setTasks(res.data);
    } catch (e) {
      showError(e);
    }
  }

  function toggleFilter() {
    setShowDoneTasks(!showDoneTasks);
  }

  const filterTasks = useCallback(() => {
    let _visibleTasks = null;

    if (showDoneTasks) {
      _visibleTasks = [...tasks];
    } else {
      const pedding = task => task.doneAt === null;
      _visibleTasks = tasks.filter(pedding);
    }

    setVisibleTasks(_visibleTasks);
  }, [showDoneTasks, tasks]);

  async function toggleTask(taskId) {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);

      loadTasks();
    } catch (e) {
      showError(e);
    }
  }

  async function addTask(newTask) {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada!');
      return;
    }

    try {
      await axios.post(`${server}/tasks`, {
        desc: newTask.desc,
        estimateAt: newTask.date,
      });

      setShowAddTask(false);

      loadTasks();
    } catch (e) {
      showError(e);
    }
  }

  async function deleteTask(taskId) {
    try {
      await axios.delete(`${server}/tasks/${taskId}`);

      loadTasks();
    } catch (e) {
      showError(e);
    }
  }

  const today = moment()
    .locale('pt-br')
    .format('ddd, D [de] MMMM');

  return (
    <View style={styles.container}>
      <AddTask
        isVisible={showAddTask}
        onCancel={() => setShowAddTask(false)}
        onSave={addTask}
      />
      <ImageBackground style={styles.background} source={todayImage}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={toggleFilter}>
            <Icon
              name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <FlatList
          data={visibleTasks}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <Task {...item} onToggleTask={toggleTask} onDelete={deleteTask} />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={() => setShowAddTask(true)}>
        <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
