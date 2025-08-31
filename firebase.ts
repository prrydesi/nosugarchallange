// FIX: Import `FirebaseOptions` to correctly type the `firebaseConfig` object.
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { 
  getDatabase, 
  type Database,
  ref,
  onValue,
  set,
  push
} from "firebase/database";

// Re-export these so other files don't need to change their imports
export { ref, onValue, set, push };


// =================================================================================
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
// =================================================================================
// You can get this from your Firebase project settings.
// Go to Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config
//
// NOTE: Without a valid config, the app will not be able to connect to your database.
// =================================================================================
// FIX: Apply the FirebaseOptions type to firebaseConfig.
// This allows TypeScript to understand the shape of the object, even when it's empty,
// resolving the error when accessing `firebaseConfig.apiKey`.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAqSWeL2Q7wzTJRhR4lnKSHup2ZE3d_My0",
  authDomain: "nosugarchallenge-dbc44.firebaseapp.com",
  databaseURL: "https://nosugarchallenge-dbc44-default-rtdb.firebaseio.com",
  projectId: "nosugarchallenge-dbc44",
  storageBucket: "nosugarchallenge-dbc44.firebasestorage.app",
  messagingSenderId: "12695521417",
  appId: "1:12695521417:web:4b8e01ab0f9556d5ea5e58",
  measurementId: "G-VKZYB265F4"
};


// A simple check to see if the config is filled out.
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_"));

// Initialize Firebase and export db only if configured.
// This prevents Firebase errors on startup if the config is missing.
let db: Database | null = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.error("Error initializing Firebase. Please check your configuration.", e);
  }
}

export { db };