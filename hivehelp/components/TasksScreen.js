import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../supabase'; // Import supabase client
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeProvider.js';
import uuid from 'uuid-js';

const TasksScreen = () => {
  const { colorScheme } = useTheme(); 
  const navigation = useNavigation(); 

  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const currentID = user.id
      const { data, error } = await supabase.from('tasks').select('*').eq('id', currentID);
      if (error) {
        throw error;
      }
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const toggleCompletion = async (index) => {
    try {
      const updatedTasks = [...tasks];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      setTasks(updatedTasks);

      const { error } = await supabase
        .from('tasks')
        .update({ completed: updatedTasks[index].completed })
        .eq('id', updatedTasks[index].id);
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  const addTask = async () => {
  try {
    if (newTaskName.trim() !== "" && newTaskDueDate.trim() !== "") {
      const newTaskId = uuid.create().toString(); // Generate a UUID
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          id: newTaskId,
          name: newTaskName,
          description: newTaskDescription,
          dueDate: newTaskDueDate,
          completed: false,
        }]);
      
      if (error) {
        throw error;
      }
      setTasks([...tasks, ...data]);
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setShowAddTask(false);
    }
  } catch (error) {
    console.error('Error adding task:', error.message);
  }
};
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
      <View style={[styles.header, { backgroundColor: colorScheme.primaryRich }]}>
        <Text style={[styles.title, { color: colorScheme.text }]}>Tasks</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowAddTask(!showAddTask)}
        >
          <View style={[styles.hexagonInner, { backgroundColor: colorScheme.tertiary }]} />
          <View style={[styles.hexagonBefore, { borderBottomColor: colorScheme.tertiary }]} />
          <View style={[styles.hexagonAfter, { borderTopColor: colorScheme.tertiary }]} />
          <AntDesign
            name="plus"
            size={24}
            color={colorScheme.text}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </View>

      {showAddTask && (
        <View style={styles.addTaskSection}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text }]}>Add Task</Text>
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Task Name"
            value={newTaskName}
            onChangeText={setNewTaskName}
          />
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Task Description"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
          />
          <TextInput
            style={[styles.input, { color: colorScheme.text }]}
            placeholder="Due Date"
            value={newTaskDueDate}
            onChangeText={setNewTaskDueDate}
          />
          <TouchableOpacity style={[styles.addButton, {backgroundColor: colorScheme.primary}, {color: colorScheme.text}, {borderBottomWidth: 5},{borderRightWidth: 5}, {borderColor: colorScheme.primaryRich}]} onPress={addTask}>
            <Text style={[styles.addButtonText, {color: colorScheme.text}]}>Add</Text>
          </TouchableOpacity>
        </View>
      )}


      <FlatList
        data={showCompletedTasks ? completedTasks : tasks.filter(task => !task.completed)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleTaskPress(item)}>
            <View style={styles.task}>
              <TouchableOpacity
                onPress={() => toggleCompletion(index)}
                style={styles.completeButton}
              >
                <View style={[styles.hexagonInner, { backgroundColor: colorScheme.tertiaryLite }]} />
                <View style={[styles.hexagonBefore, { borderBottomColor: colorScheme.tertiaryLite }]} />
                <View style={[styles.hexagonAfter, { borderTopColor: colorScheme.tertiaryLite }]} />
              </TouchableOpacity>
              <View style={styles.taskDetails}>
                <Text
                  style={[
                    styles.taskName, {color: colorScheme.text},
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={[styles.taskDescription, {color: colorScheme.text}]}>{item.description}</Text>
                <Text style={[styles.dueDate, {color: colorScheme.text}]}>Due Date: {item.dueDate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.showCompletedButton, {backgroundColor: colorScheme.secondary}, {borderBottomWidth: 5},{borderRightWidth: 5}, {borderColor: colorScheme.secondaryRich}]}
        onPress={() => setShowCompletedTasks(!showCompletedTasks)}
      >
        <Text style={[styles.showCompletedButtonText, {color: colorScheme.text}]}>
          {showCompletedTasks ? "Hide Completed Tasks" : "Show Completed Tasks"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 30,
  },
  plusButton: {
    width: 50,
    height: 29,
    position: "relative",
  },
  hexagonInner: {
    width: "100%",
    height: "100%",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -13,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderTopWidth: 13,
  },
  hexagonBefore: {
    position: "absolute",
    top: -13,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderBottomWidth: 13,
  },
  plusIcon: {
    position: "absolute",
    top: 3,
    left: 14,
  },
  addTaskSection: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: 'center',
    width: '40%',
  },
  addButtonText: {
    fontWeight: "bold",
  },
  task: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginRight: 20,
    paddingBottom: 15,
  },
  taskDetails: {
    flex: 1,
    marginLeft: 20,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    fontStyle: 'bold',
  },
  completeButton: {
    width: 50,
    height: 29,
    position: "relative",
  },
  completedTask: {
    textDecorationLine: "line-through",
  },
  showCompletedButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: "center",
    marginBottom: 50,
    width: '60%',
    marginHorizontal: 20,
  },
  showCompletedButtonText: {
    fontWeight: "bold",
  },
})

export default TasksScreen

