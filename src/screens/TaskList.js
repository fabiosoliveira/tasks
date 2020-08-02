import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import AddTask from './AddTask';

export default props => {
  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: Math.random(),
      desc: 'Comprar Livro',
      estimateAt: new Date(),
      doneAt: new Date(),
    },
    {
      id: Math.random(),
      desc: 'Ler Livro',
      estimateAt: new Date(),
      doneAt: null,
    },
  ]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks, showDoneTasks, tasks]);

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

  function toggleTask(taskId) {
    const _tasks = [...tasks];
    _tasks.forEach(task => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });

    setTasks(_tasks);
  }

  const today = moment()
    .locale('pt-br')
    .format('ddd, D [de] MMMM');

  return (
    <View style={styles.container}>
      <AddTask isVisible={showAddTask} onCancel={() => setShowAddTask(false)} />
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
          renderItem={({item}) => <Task {...item} toggleTask={toggleTask} />}
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
