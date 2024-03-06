import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { workData } from './WorkGuidesData';
import { Theme } from './Theme';
import { useTheme } from './ThemeProvider';

const WorkGuides = () => {
    const { colorScheme } = useTheme();

    const [work, setWork] = useState(workData);
    const [expandedGuide, setExpandedGuide] = useState(null);
    const [favorite, setFavorite] = useState([]);
    const navigation = useNavigation(); // Get navigation object using useNavigation hook

    const handlePress = (index) => {
        setExpandedGuide(index === expandedGuide ? null : index);
    };

    const handleFavorite = (title) => {
        navigation.navigate('FavoriteGuidesScreen', { title: title })
    }

    const renderSections = (sections) => {
        return sections.map((section, index) => (
            <View key={index}>
                <Text style={[styles.sectionHeading, { color: colorScheme.text }]}>
                    {section.heading}
                </Text>
                <Text style={[styles.sectionContent, { color: colorScheme.text }]}>
                    {section.content}
                </Text>
            </View>
        ));
    };

    const renderItem = ({ item, index }) => {
        const isExpanded = index === expandedGuide;

        return (
            <TouchableOpacity onPress={() => handlePress(index)}>
                <View style={styles.itemContainer}>
                    <Text style={[styles.title, { color: colorScheme.text }, {color: colorScheme.secondaryRich}]}>
                        {item.title}
                    </Text>
                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            {renderSections(item.sections)}
                            <TouchableOpacity onPress={() => handleFavorite(item.title)} style={styles.backButton}>
                               <Text style={styles.backButtonText}>Would you like to favorite this guide?</Text> 
                                </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, {backgroundColor: colorScheme.background}]}>
            <Text style={[styles.heading, { color: colorScheme.text}]}>
                Work Guides
            </Text>
            <FlatList
                data={work}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, {backgroundColor: colorScheme.tertiary}]}>
                <Text style={[styles.backButtonText, {color: colorScheme.text}]}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40,
    },
    itemContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    expandedContent: {
        marginLeft: 10,
    },
    sectionHeading: {
        fontWeight: 'bold',
        marginBottom: 3,
        fontSize: 20,
    },
    sectionContent: {
        marginBottom: 10,
        fontSize: 18,
    },
    backButton: {
        justifyConten: 'center',
        marginBottom: 80,
        padding: 10,
        padding: 10,
        borderRadius: 10, // Back button background color

    },
    backButtonText: {
        textAlign: 'center'
    },
});

export default WorkGuides;
