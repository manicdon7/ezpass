import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function Connect({ setUserEmail }) {
  const [user, setUser] = useState(null);

  const firebaseConfig = {
    apiKey: "AIzaSyBms2fayouqba8Vv99je1p5JyQVMBdZDpI",
    authDomain: "ticket2-b1147.firebaseapp.com",
    projectId: "ticket2-b1147",
    storageBucket: "ticket2-b1147.appspot.com",
    messagingSenderId: "489534606397",
    appId: "1:489534606397:web:85753ab54dd4321d462e54",
    measurementId: "G-GVY1NLSX1F"
   };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [auth, setUserEmail]);

  const connectWallet = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setUserEmail(result.user.email);
      console.log(result);
    } catch (error) {
      console.error('Google authentication error:', error.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserEmail(null);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className='pt-2'>
      {user ? (
        <button className='bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-red-800 items-center text-black  py-2 px-3 text-2xl font-semibold rounded-lg' onClick={disconnectWallet}>Logout</button>
      ) : (
        <button className='bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-red-800 items-center text-black py-2 px-3 text-2xl font-semibold rounded-lg' onClick={connectWallet}>Sign Up</button>
      )}
    </div>
  );
}

export default Connect;
