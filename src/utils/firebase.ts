import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_cz3Ebh0L7xH1ET3KqqFobtB_3Dlzl2Q",
  authDomain: "ai-travel-agent-670c9.firebaseapp.com",
  projectId: "ai-travel-agent-670c9",
  storageBucket: "ai-travel-agent-670c9.firebasestorage.app",
  messagingSenderId: "29686065850",
  appId: "1:29686065850:web:a2b09f342e43b01ea4f083",
  measurementId: "G-DQCFX6LT4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;