import React, { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import img from "../assets/concert.avif";
import Head from "../Components/Head";
import img1 from '../assets/home.png';

// Import your Firebase configuration and initialize the app
import { initializeApp } from "firebase/app";
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
const storage = getStorage(app);

const bg = {
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
};

const Host = ({ userEmail }) => {
  const [user, setUser] = useState(null);
  const [host, setHost] = useState({
    name: "",
    location: "",
    totaltickets: "",
    price: "",
    date: "",
    time: "",
    image: null,
  });
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setHost((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setHost((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleTimePeriodChange = (event) => {
    const { value } = event.target;
    setHost((prevHost) => ({
      ...prevHost,
      timePeriod: value,
    }));
  };

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowSignInPopup(false);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };  

  const addHost = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      }

      // Get the user's email
      const userEmail = currentUser.email;
      console.log("User email:", userEmail);

      // Get the ID token (Bearer token)
      const idToken = await currentUser.getIdToken();

      // Include the token in the Authorization header
      const headers = {
        Authorization: `Bearer ${idToken}`
      };

      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `images/${host.name}-${Date.now()}`);
      await uploadBytes(imageRef, host.image);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Image URL:", imageUrl);

      // Create a FormData object to send the event data
      const formData = new FormData();
      formData.append("name", host.name);
      formData.append("location", host.location);
      formData.append("totaltickets", host.totaltickets);
      formData.append("price", host.price);
      formData.append("date", host.date);
      formData.append("time", host.time);
      formData.append("imageUrl", imageUrl);
      formData.append("email", userEmail);

      const response = await fetch("http://localhost:5000/api/host", {
        method: "POST",
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });

      if (response.ok) {
        setTransactionStatus("Successfully submitted!");
        setHost({
          name: "",
          location: "",
          totaltickets: "",
          price: "",
          date: "",
          time: "",
          image: null,
        });
      } else {
        setTransactionStatus("Hosting failed. Please try again.");
      }
    } catch (error) {
      console.error("Error hosting event:", error);
      setTransactionStatus("Hosting failed. Please try again.");
    }
  };

  return (
    <div className="poppins-font bg-black h-full flex-col px-10 md:px-60 py-11 text-white font-medium" style={bg}>
      <Head
        title="Ezpass hosting"
        description="Host your show here"
        image={img1}
      />
      <h1 className=" text-2xl md:text-3xl">Event Cover Image
        <input type="file" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" name="image" onChange={handleChange} />
      </h1>
      <h1 className=" text-2xl md:text-3xl">Event Name
        <input type="text" className=" block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="event name" required name="name" value={host.name} onChange={handleChange} />
      </h1>
      <h1 className=" text-2xl md:text-3xl pt-6">Venue
        <input type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="location" name="location" value={host.location} onChange={handleChange} />
      </h1>
      <h1 className="text-2xl md:text-3xl pt-6">Number of Passes
        <input type="number" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="total Passes" name="totaltickets" value={host.totaltickets} onChange={handleChange} />
      </h1>
      <h1 className=" text-2xl md:text-3xl pt-6"> Price per Pass
        <input type="number" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="price" name="price" value={host.price} onChange={handleChange} />
      </h1>
      <div className=" space-x-6 pt-6">
        <h1 className=" text-2xl md:text-3xl ">Date
          <input type="date" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="date" name="date" value={host.date} onChange={handleChange} />
        </h1>
        {/* <h1 className=" text-2xl md:text-3xl">Date to
          <input type="number" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200" placeholder="date" name="date" value={host.date} onChange={handleChange} /></h1> */}
      </div>
      <h1 className="text-2xl md:text-3xl pt-6 pb-6">
  Time
  <div className="flex items-center">
    <input
      type="time"
      className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-white"
      placeholder="time"
      name="time"
      value={host.time}
      onChange={handleChange}
    />
    <select
      className="ml-2 py-2.5 px-3 text-sm text-black rounded-lg border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-white dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer placeholder-gray-200"
      value={host.timePeriod}
      onChange={handleTimePeriodChange}
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</h1>
      <button className=" w-24 text-2xl rounded-full py-2 hover:scale-105 bg-yellow-300 text-black hover:bg-black border-2 hover:border-yellow-400 hover:text-white " onClick={addHost}>HOST</button>
      {transactionStatus && (
        <div className={transactionStatus === "Successfully submitted!" ? "text-green-500" : "text-red-500"}>
          {transactionStatus}
        </div>
      )}
      {showSignInPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Sign in to host an event</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4" onClick={signInWithGoogle}>Sign in with Google</button>
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" onClick={() => setShowSignInPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Host;
