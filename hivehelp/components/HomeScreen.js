import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewComponent} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from './Theme';
import * as FileSystem from 'expo-file-system';
import {TaskList} from './TaskList.json'
import Calendar from './CalendarScreen';

const ColorScheme = Theme.lightA;

const HomeScreen = ({}) => {
  const navigation = useNavigation();

  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const readJsonFile = async () => {
      try {
        const filePath = FileSystem.documentDirectory + TaskList;
        const result = await FileSystem.readAsStringAsync(filePath);
        setJsonData(JSON.parse(result));
      } catch (error) {
        console.error('Error reading JSON file:', error);
      }
    };

    readJsonFile();
  }, []);

  const [displayText, setDisplayText] = useState('Remeber to always do what you love!');

  const changeTextL = () => {
    setDisplayText('Remeber to always do what you love!');
  };
  const changeTextR = () => {
    setDisplayText("It\'s okay to make mistakes\! \nYour mistakes don\'t define you.");
  };
  const goToTemplatePage = () => {
    navigation.navigate('SignIn'); // 'Template' should match the name of the stack or screen you want to navigate to
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.titleText} >Welcome</Text>
      <View style={styles.backgroundBox}></View>
      <View style={[styles.yellowBox, { borderColor: ColorScheme.tertiaryRich }]}>
          <TouchableOpacity style={styles.button} onPress={changeTextL}>
            <Text style={styles.buttonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{displayText}</Text>
          {/* Button on the right side */}
          <TouchableOpacity style={styles.button} onPress={changeTextR}>
            <Text style={styles.buttonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.container}>
        <View style={styles.column}>
          {/* Pinned Guide */}
          <TouchableOpacity style={[styles.box, { backgroundColor: ColorScheme.primary }, { borderColor: ColorScheme.primaryRich }]} onPress={goToTemplatePage}>
            <Text style={styles.buttonText}>Pinned Guide</Text>
          </TouchableOpacity>
          {/* Suggested Guide */}
          <TouchableOpacity style={[styles.box, { backgroundColor: ColorScheme.primary }, { borderColor: ColorScheme.primaryRich }]} onPress={goToTemplatePage}>
            <View>
              </View><Text style={[styles.buttonText, { paddingTop: 10 }]} >Suggested</Text>
            <Text style={[styles.buttonText]}>Guide</Text>
          </TouchableOpacity>
        </View>
        {/* Tasks */}
        <View style={[styles.column]}>
        <TouchableOpacity style={[styles.box, { backgroundColor: ColorScheme.secondaryLite }, { borderColor: ColorScheme.secondaryRich }]} onPress={goToTemplatePage}>
          <View style={[styles.boxHeader, { backgroundColor: ColorScheme.secondary }, { borderBottomEndRadius: 0 }]}>
            <Text style={styles.buttonText}>Tasks</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>
 {/* Calendar */}
 <View style={styles.calendarWidget}>
        <TouchableOpacity style={[styles.box, { backgroundColor: ColorScheme.tertiary }, { borderColor: ColorScheme.tertiaryRich }]} onPress={goToTemplatePage}>
          <View style={[styles.boxHeader, { backgroundColor: ColorScheme.tertiaryRich }, { borderBottomEndRadius: 0 }]}>
            <Text style={styles.buttonText}>This Week</Text>
            {/*<Calendar/>*/}
          </View>
        </TouchableOpacity>
      </View>
        <View>
      <Text>JSON Data:</Text>
      <Text>{JSON.stringify(jsonData, null, 2)}</Text>
    </View>
      </View>

  //  </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: ColorScheme.secondaryRich,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align to the left
    paddingTop: 170
  },
  container: {
  //  flex: 1,
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 30
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 8
  },
  box: {
    flex: 1,
    borderRadius: 20,
    margin: 8,
    borderBottomWidth: 5,
    borderRightWidth: 5
  },
  boxHeader: {
    height: '20%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  backgroundBox: {
    backgroundColor: ColorScheme.background,
    borderRadius: 20,
    paddingHorizontal: 215,
    paddingVertical: 500,
    position: 'absolute',
    top: 200,
    left: 0
  },
  titleText: {
    fontSize: 40,
    position: 'absolute',
    top: 100,
    left: 20
  },
  yellowBox: {
    backgroundColor: ColorScheme.tertiaryLite,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    position: 'absolute',
    top: 150,
    left: 20
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 12
  },
  calendarWidget: {
    height: '40%'

  },
});

export default HomeScreen;