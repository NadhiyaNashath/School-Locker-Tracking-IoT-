import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { FaDoorOpen } from 'react-icons/fa';

const LockerDashboard = () => {
  const [password, setPassword] = useState("");
  const [lockerStatus, setLockerStatus] = useState("Locked");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DUMMY_PASSWORD = "1234"; // Dummy password stored in the file
  const navigate = useNavigate();

  const handleUnlock = () => {
    setErrorMessage("");
    setIsLoading(true);

    if (password !== DUMMY_PASSWORD) {
      setErrorMessage("Incorrect Password. Please try again.");
      setIsLoading(false);
      return;
    }

    setLockerStatus("Unlocked");
    setIsUnlocking(true);

    // Display SweetAlert on successful unlock
    Swal.fire({
      title: "Success!",
      text: "Locker unlocked successfully.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/success");
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/locker-image.jpg')" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Student Locker System</h1>
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Locker Number: 
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-white font-semibold text-lg ml-2">
            3
          </span>
        </h3>

        <p className="text-xl font-semibold mb-4">
          Locker Status: 
          <span
            className={`inline-block px-4 py-2 ml-2 rounded-full ${
              lockerStatus === "Unlocked" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {lockerStatus}
          </span>
        </p>


        <input
          type="password"
          className="w-full p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        <button
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          onClick={handleUnlock}
        >
          Unlock Locker
        </button>
      </div>
    </div>
  );
};

export default LockerDashboard;
