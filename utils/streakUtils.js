// Gemini Agent: Added this file for streak calculation logic.
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

/**
 * Calculates the user's meditation streak based on their session history
 * and updates the 'streak' field in their user document in Firestore.
 * @param {string} userId The ID of the user to update.
 */
export const updateUserStreak = async (userId) => {
  // Gemini Agent: Added this entire function to handle streak logic.
  if (!userId) {
    console.log("User ID not provided, skipping streak update.");
    return;
  }

  try {
    // 1. Fetch all of the user's meditation sessions, ordered by most recent first.
    const sessionsRef = collection(db, `users/${userId}/sessions`);
    const q = query(sessionsRef, orderBy("date", "desc"));
    const sessionsSnapshot = await getDocs(q);

    // 2. Get an array of valid dates from the sessions.
    // We filter out the 'current' session doc and any other docs without a valid date.
    const sessionDates = sessionsSnapshot.docs
      .filter(doc => doc.id !== 'current' && doc.data().date)
      .map(doc => doc.data().date.toDate()); // Convert Firestore Timestamps to JS Date objects.

    if (sessionDates.length === 0) {
      // If there are no sessions, the streak is 0.
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { streak: 0 });
      console.log(`Streak reset to 0 for user ${userId} due to no sessions.`);
      return;
    }

    // 3. Calculate the streak.
    let currentStreak = 0;
    const mostRecentSessionDate = sessionDates[0];

    // The streak can only be > 0 if the last session was today or yesterday.
    if (isToday(mostRecentSessionDate) || isYesterday(mostRecentSessionDate)) {
      currentStreak = 1; // Start with a streak of 1 for the most recent session.
      // Loop through the rest of the sessions to see if they are on consecutive days.
      for (let i = 1; i < sessionDates.length; i++) {
        const date1 = sessionDates[i - 1];
        const date2 = sessionDates[i];
        
        // Using date-fns to get the difference in calendar days.
        const diff = differenceInCalendarDays(date1, date2);

        if (diff === 1) {
          // This session was the day before the previous one, so we increment the streak.
          currentStreak++;
        } else if (diff > 1) {
          // There is a gap of more than one day, so the streak is broken.
          break;
        }
        // If diff is 0, it's a session on the same day, so we just continue.
      }
    }

    // 4. Save the newly calculated streak to the user's document in Firestore.
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      streak: currentStreak
    });

    console.log(`Streak updated for user ${userId}: ${currentStreak}`);

  } catch (error) {
    console.error("Error updating user streak:", error);
  }
};
