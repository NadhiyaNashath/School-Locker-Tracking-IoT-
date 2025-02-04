import React, { useState } from "react";
import { FaBoxOpen, FaBox } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

const SuccessPage = () => {
  const isLockerEmpty = false; 
  const navigate = useNavigate(); 

  // State to store activity logs with dummy data
  const [activityLogs, setActivityLogs] = useState([
    { action: "unlocked", timestamp: "2025-02-04 10:00 AM" },
    { action: "item added", timestamp: "2025-02-04 10:15 AM" },
    { action: "wrong password", timestamp: "2025-02-04 10:20 AM" },
    { action: "locked", timestamp: "2025-02-04 10:30 AM" },
  ]);

  const handleLockDoor = () => {
    const timestamp = new Date().toLocaleString();
    logActivity("Locker door is locked", timestamp);
    navigate("/"); 
  };

  // Function to log activity with timestamp
  const logActivity = (action, timestamp) => {
    setActivityLogs((prevLogs) => [
      { action, timestamp },
      ...prevLogs,
    ]);
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
    <div className="">
      <div className="text-center bg-blue-50 p-10 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-500">Locker Unlocked Successfully!</h1>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto h-[200px] flex items-center justify-center ">
          {isLockerEmpty ? (
            <div className="flex items-center justify-center text-xl text-gray-700">
              <FaBoxOpen className="mr-4 text-red-500 text-4xl" />
              <p className="font-semibold text-2xl">The locker is empty.</p>
            </div>
          ) : (
            <div className="flex items-center justify-center text-xl text-gray-700">
              <FaBox className="mr-4 text-green-500 text-4xl" />
              <p className="font-semibold text-2xl">The locker is occupied.</p>
            </div>
          )}
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
                <div className="mt-8 ">
        <h2 className="text-2xl font-semibold text-gray-800">Activity Log</h2>
        <div className="overflow-x-auto p-4">
            <table className="mt-4 table-auto bg-white rounded-lg w-[800px] mx-auto rounded-lg shadow-md ">
            <thead>
                <tr className="border-b">
                <th className="px-4 py-2 text-center text-gray-600">Timestamp</th>
                <th className="px-4 py-2 text-center text-gray-600">Action</th>
                </tr>
            </thead>
            <tbody>
                {activityLogs.map((log, index) => (
                <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-gray-700">{log.timestamp}</td>
                    <td className="px-4 py-2 text-xs">
                    <span
                        className={`inline-block px-3 py-1 rounded-2xl ${getActionStyle(log.action)}`}
                    >
                        {log.action}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;
