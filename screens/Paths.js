import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";


const Paths = () => {
    const activePaths = [
        {
          id: "1",
          name: "Build Confidence",
          progress: "60%",
          nextStep: "Watch: How to Overcome Self-Doubt",
        },
        {
          id: "2",
          name: "Master Time Management",
          progress: "40%",
          nextStep: "Read: The Power of Prioritization",
        },
      ];
    
      // Sample data for suggested paths
      const suggestedPaths = [
        {
          id: "1",
          title: "Improve Communication",
          description: "Learn to express yourself effectively.",
          details: "5 Milestones, 3 Resources",
        },
        {
          id: "2",
          title: "Develop Emotional Intelligence",
          description: "Understand and manage emotions better.",
          details: "4 Milestones, 2 Resources",
        },
        {
          id: "3",
          title: "Build Financial Discipline",
          description: "Master budgeting and saving.",
          details: "3 Milestones, 3 Resources",
        },
      ];
    
      return (
        <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Paths</Text>
            <Text style={styles.subtitle}>
              Track your goals, take action, and achieve your aspirations.
            </Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Discover New Paths</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Create New Path</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        {/* Active Paths Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Paths</Text>
            <TouchableOpacity style={styles.seeMore}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
  
          {activePaths.length > 0 ? (
            <>
              {activePaths.map((path) => (
                <View style={styles.activePathCard} key={path.id}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.activePathName}>{path.name}</Text>
                    <Text style={styles.activePathProgress}>{path.progress}</Text>
                  </View>

                  <View style={styles.analyticsContainer}>
              <Text style={styles.analyticsTitle}>Progress</Text>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Milestones</Text>
                <Text style={styles.analyticsValue}>5/8</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Time Spent</Text>
                <Text style={styles.analyticsValue}>3 hrs</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Time Remaining</Text>
                <Text style={styles.analyticsValue}>2 hrs</Text>
              </View>
            </View>

                  <Text style={styles.nextStep}>Next Step:</Text>
                  <Text style={styles.nextStepDetail}>{path.nextStep}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.cardActionButton}>
                      <FontAwesome
                        name="info-circle"
                        size={20}
                        color="#2D3748"
                        style={styles.cardActionIcon}
                      />
                      <Text style={styles.cardActionText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardActionButton}>
                      <FontAwesome
                        name="edit"
                        size={20}
                        color="#2D3748"
                        style={styles.cardActionIcon}
                      />
                      <Text style={styles.cardActionText}>Edit Path</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardActionButton}>
                      <FontAwesome
                        name="play-circle"
                        size={20}
                        color="#2D3748"
                        style={styles.cardActionIcon}
                      />
                      <Text style={styles.cardActionText}>Resume Path</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardActionButtonComplete}>
                      <FontAwesome
                        name="check-circle"
                        size={20}
                        color="#FFF"
                        style={styles.cardActionIcon}
                      />
                      <Text style={styles.cardActionText}>Complete Path</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.noActivePaths}>
              <Text style={styles.noPathsText}>
                No active paths yet. Start your journey by creating a new goal.
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Discover New Paths</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
  
        {/* Suggested Paths Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested Paths</Text>
            <TouchableOpacity style={styles.seeMore}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedPathsContainer}
          >
            {suggestedPaths.map((item) => (
              <View style={styles.suggestedCard} key={item.id}>
                <Text style={styles.suggestedTitle}>{item.title}</Text>
                <Text style={styles.suggestedDescription}>
                  {item.description}
                </Text>
                <Text style={styles.suggestedDetails}>{item.details}</Text>
                <TouchableOpacity style={styles.startPathButton}>
                  <Text style={styles.startPathText}>Start Path</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
  
        {/* Spacer at the bottom */}
        <View style={styles.bottomSpacer}></View>
      </ScrollView>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F8FB",
      //paddingHorizontal: 20,
      //paddingVertical: 10,
    },
    header: {
      backgroundColor: "#EF798A",
      //backgroundColor: "#3182CE",
      padding: 40,
      borderRadius: 10,
      marginBottom: 20,
    },
    headerContent: {
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#FFF",
      fontFamily: 'RobotoSlabSemiBold'
    },
    subtitle: {
      fontSize: 16,
      color: "#E2E8F0",
      marginTop: 5,
      textAlign: "center",
      fontFamily: 'PoppinsRegular'
    },
    quickActions: {
      flexDirection: "row",
      marginTop: 15,
    },
    ctaButton: {
      backgroundColor: "#FFF",
      padding: 12,
      borderRadius: 8,
      marginRight: 10,
    },
    ctaButtonText: {
      color: "#3182CE",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    secondaryButton: {
      backgroundColor: "#E2E8F0",
      padding: 12,
      borderRadius: 8,
      fontFamily: 'PoppinsRegular'
    },
    secondaryButtonText: {
      color: "#3182CE",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    section: {
      marginTop: 20,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#2D3748",
      flex: 1, // Ensures that the title takes up space before the "See More" button
      fontFamily: 'PoppinsRegular'
    },
    seeMore: {
      paddingHorizontal: 10,
      alignItems: "flex-end", // Ensures the button aligns with the end of the container
    },
    seeMoreText: {
      fontSize: 15,
      color: "#3182CE",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    activePathCard: {
      backgroundColor: "#FFF",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    activePathName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#2D3748",
      fontFamily: 'PoppinsRegular'
    },
    activePathProgress: {
      fontSize: 16,
      color: "#38A169",
    },
    nextStep: {
      fontSize: 14,
      color: "#718096",
      marginTop: 10,
      fontFamily: 'PoppinsRegular'
    },
    nextStepDetail: {
      fontSize: 16,
      color: "#2D3748",
      marginBottom: 10,
      fontFamily: 'PoppinsRegular'
    },
    cardActions: {
      marginTop: 10,
    },
    cardActionButton: {
      backgroundColor: "#E2E8F0",
      padding: 10,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    cardActionIcon: {
      marginRight: 10,
    },
    cardActionText: {
      color: "#2D3748",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    cardActionButtonComplete: {
      backgroundColor: "#38A169",
      padding: 10,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    noActivePaths: {
      alignItems: "center",
      marginTop: 20,
    },
    noPathsText: {
      fontSize: 16,
      color: "#A0AEC0",
      textAlign: "center",
      marginBottom: 15,
      fontFamily: 'PoppinsRegular'
    },
    actionButton: {
      backgroundColor: "#3182CE",
      padding: 10,
      borderRadius: 8,
    },
    actionButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    suggestedPathsContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    suggestedCard: {
      backgroundColor: "#FFF",
      padding: 15,
      borderRadius: 10,
      marginRight: 15,
      width: 220,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    suggestedTitle: {
      fontSize: 17,
      fontWeight: "bold",
      color: "#2D3748",
      fontFamily: 'PoppinsRegular'
    },
    suggestedDescription: {
      fontSize: 13,
      color: "#718096",
      marginTop: 10,
      fontFamily: 'PoppinsRegular'
    },
    suggestedDetails: {
      fontSize: 13,
      color: "#4A5568",
      marginTop: 5,
      fontFamily: 'PoppinsRegular'
    },
    startPathButton: {
      backgroundColor: "#3182CE",
      padding: 10,
      borderRadius: 5,
      marginTop: 15,
      alignItems: "center",
    },
    startPathText: {
      color: "#FFF",
      fontWeight: "bold",
      fontFamily: 'PoppinsRegular'
    },
    bottomSpacer: {
      height: 50,
    },

    analyticsContainer: {
        marginTop: 15,
        backgroundColor: "#F7FAFC",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
      },
      analyticsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2D3748",
      },
      analyticsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
      },
      analyticsLabel: {
        fontSize: 14,
        color: "#718096",
      },
      analyticsValue: {
        fontSize: 14,
        color: "#2D3748",
      },
  });

export default Paths;
