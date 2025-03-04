import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; 

const SuccessPage = () => {
  const isLockerEmpty = false; // Replace this with actual data from the ultra sonic sensor
  const navigate = useNavigate();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activity logs from database when component mounts
  useEffect(() => {
    axios.get("http://localhost:5000/api/logs") // Replace with your API URL
      .then(response => {
        setActivityLogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      });
  }, []);

  const handleLockDoor = async () => {
    const timestamp = new Date().toLocaleString();
  
    try {
      // Send request to ESP32 to lock the door
      const response = await axios.post("http://10.22.54.116/lock");
  
      if (response.status === 200 && response.data === "Locked") {
        // Log the activity only if the locker was successfully locked
        await logActivity("locked", timestamp);
  
        Swal.fire({
          title: "Success!",
          text: "Locker door is locked.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire("Error", "Failed to lock the door. Try again.", "error");
      }
    } catch (error) {
      console.error("Error locking door:", error);
      Swal.fire("Error", "Could not connect to the locker. Try again.", "error");
    }
  };
  

  // Function to log activity to the database
  const logActivity = async (action, timestamp) => {
    try {
      const newLog = { action, timestamp };

      // Send log to database
      await axios.post("http://localhost:5000/api/logs", newLog); // Replace with your API URL
      
      // Update local state
      setActivityLogs((prevLogs) => [newLog, ...prevLogs]);
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  const getActionStyle = (action) => {
    switch (action) {
      case "unlocked":
        return "bg-green-100 text-green-700 border border-green-600";
      case "wrong password":
        return "bg-red-100 text-red-700 border border-red-600";
      case "locked":
        return "bg-yellow-100 text-yellow-700 border border-yellow-600";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-600";
    }
  };

  return (
    <div className="text-center bg-blue-50 p-10 rounded-3xl shadow-lg">
      <h1 className="text-3xl font-bold text-green-500">
        Locker Unlocked Successfully!
      </h1>

      <div className="mt-4 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isLockerEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center text-xl text-gray-700"
            >
              <FaBoxOpen className="mr-4 text-red-500 text-4xl" />
              <p className="font-semibold text-2xl">The locker is empty.</p>
            </motion.div>
          ) : (
            <motion.div
              key="occupied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center text-xl text-gray-700"
            >
              <FaBox className="mr-4 text-green-500 text-4xl" />
              <p className="font-semibold text-2xl">The locker is occupied.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lock Door Button */}
      <div className="mt-6">
        <button
          onClick={handleLockDoor}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Lock Door
        </button>
      </div>

      {/* Activity Log Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Activity Log</h2>
        <div className="overflow-x-auto p-4">
          {loading ? (
            <p className="text-gray-600">Loading logs...</p>
          ) : (
            <table className="mt-4 table-auto bg-white rounded-lg w-[800px] mx-auto shadow-md">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-center text-gray-600">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-center text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-gray-700">{log.timestamp}</td>
                    <td className="px-4 py-2 text-xs">
                      <span
                        className={`inline-block px-3 py-1 rounded-2xl ${getActionStyle(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
