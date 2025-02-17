import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";

const GoalsList = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const userId = user?.uid;
  const fetchGoals = async () => {
    try {
      const goalsCollection = collection(db, 'users', userId, 'goals'); // Adjust as needed
      const goalsSnapshot = await getDocs(goalsCollection);
      const goalsList = await Promise.all(goalsSnapshot.docs.map(async doc => {
        const goalData = doc.data();
        const milestonesSnapshot = await getDocs(collection(db, 'users', userId, 'goals', doc.id, 'milestones'));
        const tasksSnapshot = await getDocs(collection(db, 'users', userId, 'goals', doc.id, 'tasks'));
        const milestones = milestonesSnapshot.docs.map(doc => doc.data());
        const tasks = tasksSnapshot.docs.map(doc => doc.data());

        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = (completedTasks / tasks.length) * 100;

        return {
          id: doc.id,
          ...goalData,
          milestones,
          tasks,
          completedTasks,
          progress,
        };
      }));

      // Sort goals by closest deadline
      goalsList.sort((a, b) => a.dueDate.toDate() - b.dueDate.toDate());

      setGoals(goalsList);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGoals();
    }, [])
  );

  const filteredGoals = () => {
    switch (activeTab) {
      case 'In Progress':
        return goals.filter(goal => !goal.isGoalCompleted);
      case 'Completed':
        return goals.filter(goal => goal.isGoalCompleted);
      default:
        return goals;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals</Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'In Progress' && styles.activeTab]}
          onPress={() => setActiveTab('In Progress')}
        >
          <Text style={[styles.tabText, activeTab === 'In Progress' && styles.activeTabText]}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {filteredGoals().map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.goalItem}
            onPress={() => navigation.navigate('GoalDetailsScreen', { goalId: item.id, userId })}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              <MaterialIcons name="more-vert" size={24} color="#718096" />
            </View>
            <Text style={styles.goalDescription}>{item.description}</Text>
            <View style={styles.goalDetailRow}>
              <FontAwesome name="calendar" size={16} color="#718096" />
              <Text style={styles.goalDetail}>Deadline: {item.dueDate.toDate().toDateString()}</Text>
            </View>
            <View style={styles.goalDetailRow}>
              <FontAwesome name="tasks" size={16} color="#718096" />
              <Text style={styles.goalDetail}>Tasks: {item.tasks.length}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.goalDetail}>Progress: {item.completedTasks}/{item.tasks.length} tasks completed</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F8FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F8FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3748',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#3182CE',
  },
  tabText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFF',
  },
  goalItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  goalDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 10,
  },
  goalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalDetail: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 5,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#3182CE',
  },
});

export default GoalsList;