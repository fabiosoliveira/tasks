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

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';

import {server, showError} from '../common';
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
  }, [loadTasks]);

  useEffect(() => {
    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTasks,
      }),
    );
  }, [showDoneTasks]);

  const loadTasks = useCallback(async () => {
    try {
      const maxDate = moment()
        .add({days: props.daysAhead})
        .format('YYYY-MM-DD 23:59:59');

      const res = await axios.get(`${server}/tasks?date=${maxDate}`);

      setTasks(res.data);
    } catch (e) {
      showError(e);
    }
  }, [props.daysAhead]);

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

  function getImage() {
    switch (props.daysAhead) {
      case 0:
        return todayImage;
      case 1:
        return tomorrowImage;
      case 7:
        return weekImage;
      default:
        return monthImage;
    }
  }

  function getColor() {
    switch (props.daysAhead) {
      case 0:
        return commonStyles.colors.today;
      case 1:
        return commonStyles.colors.tomorrow;
      case 7:
        return commonStyles.colors.week;
      default:
        return commonStyles.colors.month;
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
      <ImageBackground style={styles.background} source={getImage()}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
            <Icon name="bars" size={20} color={commonStyles.colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFilter}>
            <Icon
              name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secondary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{props.title}</Text>
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
        style={[styles.addButton, {backgroundColor: getColor()}]}
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
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
