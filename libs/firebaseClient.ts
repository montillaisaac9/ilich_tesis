import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyB4MYPqwAiU_k-DErSO0Of309YmUC542gY",
  authDomain: "urbanatlete.firebaseapp.com",
  projectId: "urbanatlete",
  storageBucket: "urbanatlete.appspot.com",
  messagingSenderId: "348470071852",
  appId: "1:348470071852:web:9210037149fd377ccbb789",
  measurementId: "G-KNSNYHY404"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
