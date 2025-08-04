
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLinkedinStatusHistoryThunk,
  fetchUpworkStatusHistoryThunk,
  fetchCombinedStatusHistoryThunk
} from "../slices/jobsSlice";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const STATUS_TYPES = [
  "not_engaged",
  "applied",
  "engaged",
  "interview",
  "offer",
  "rejected",
  "archived",
];
const STATUS_LABELS = {
  not_engaged: "Not Engaged",
  applied: "Applied",
  engaged: "Engaged",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};
const USER_LIST = ["khubaib", "taha", "basit", "huzaifa", "abdulrehman"];
const STATUS_COLORS = {
  not_engaged: "#FF6B6B", // Red
  applied: "#4ECDC4",     // Teal
  engaged: "#FFD93D",     // Yellow
  interview: "#1A535C",   // Dark Blue
  offer: "#FF6F91",       // Pink
  rejected: "#5F27CD",    // Purple
  archived: "#00B894",    // Green
};


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    linkedinStatusHistory,
    linkedinStatusLoading,
    linkedinStatusError,
    upworkStatusHistory,
    upworkStatusLoading,
    upworkStatusError,
    combinedStatusHistory,
    combinedStatusLoading,
    combinedStatusError

  } = useSelector((state) => state.jobs);

  // Filters
  const [platform, setPlatform] = useState("linkedin");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateType, setDateType] = useState("today");
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [singleDate, setSingleDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch data on filter change
  useEffect(() => {
    const start =
      dateType === "range"
        ? dateRange[0].startDate.toISOString().slice(0, 10)
        : undefined;
    const end =
      dateType === "range"
        ? dateRange[0].endDate.toISOString().slice(0, 10)
        : undefined;
    const date = dateType === "today" ? singleDate : undefined;

    if (platform === "linkedin") {
      dispatch(fetchLinkedinStatusHistoryThunk({ date, start, end }));
    } else if (platform === "upwork") {
      dispatch(fetchUpworkStatusHistoryThunk({ date, start, end }));
    } else if (platform === "all") {
      dispatch(fetchCombinedStatusHistoryThunk({ date, start, end }));
    }
  }, [platform, dateType, singleDate, dateRange, dispatch]);

  // Get the correct data
  const statusHistory =
  platform === "linkedin"
    ? linkedinStatusHistory
    : platform === "upwork"
    ? upworkStatusHistory
    : combinedStatusHistory;

const statusLoading =
  platform === "linkedin"
    ? linkedinStatusLoading
    : platform === "upwork"
    ? upworkStatusLoading
    : combinedStatusLoading;

const statusError =
  platform === "linkedin"
    ? linkedinStatusError
    : platform === "upwork"
    ? upworkStatusError
    : combinedStatusError;

  // Prepare data for each status graph
  function getStatusTrendData(status) {
    const dailyTotals = statusHistory?.dailyTotals || [];
    if (selectedUser === "all") {
      // Sum for all users (or use top-level if present)
      return dailyTotals.map((day) => {
        let value = 0;
        if (typeof day[status] === "number") {
          value = day[status];
        } else if (Array.isArray(day.users)) {
          value = day.users.reduce(
            (sum, u) => sum + (u.statuses?.[status] || 0),
            0
          );
        }
        return { date: day.date, value };
      });
    } else {
      // Find user for each day (case-insensitive match)
      return dailyTotals.map((day) => {
        // Defensive: log available usernames for debugging
        if (Array.isArray(day.users)) {
          // Uncomment for debugging:
          // console.log("Available users for", day.date, ":", day.users.map(u => u.username));
        }
        const user = (day.users || []).find(
          (u) =>
            u.username &&
            u.username.toLowerCase() === selectedUser.toLowerCase()
        );
        // Defensive: log if user is not found
        // if (!user) console.log(`User ${selectedUser} not found for date ${day.date}`);
        const value = user?.statuses?.[status] || 0;
        return { date: day.date, value };
      });
    }
  }
  const SummaryTable = ({ usersData }) => (
    <div className="overflow-x-auto rounded-lg shadow bg-white mt-12">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
            {STATUS_TYPES.map((status) => (
              <th key={status} className="px-4 py-2 text-center font-semibold text-gray-700">
                {STATUS_LABELS[status]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {USER_LIST.map((user) => {
            // Find user in API data (case-insensitive)
            const apiUser = usersData.find(
              (u) => u.username && u.username.toLowerCase() === user.toLowerCase()
            );
            return (
              <tr key={user} className="border-b last:border-b-0">
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">{user}</td>
                {STATUS_TYPES.map((status) => (
                  <td key={status} className="px-4 py-2 text-center">
                    {apiUser?.statuses?.[status] || 0}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-end">
          {/* Platform */}
          <div>
            <label className="block font-semibold mb-1">Platform</label>
            <select
              className="border rounded px-2 py-1"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
                <option value="all">All</option>
              <option value="linkedin">LinkedIn</option>
              <option value="upwork">Upwork</option>
              
            </select>
          </div>
          {/* User */}
          <div>
            <label className="block font-semibold mb-1">User</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="all">All Users</option>
              {USER_LIST.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          {/* Date Type */}
          <div>
            <label className="block font-semibold mb-1">Date Type</label>
            <select
              className="border rounded px-2 py-1"
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
            >
              <option value="today">Single Date</option>
              <option value="range">Date Range</option>
            </select>
          </div>
          {/* Date Picker */}
          {dateType === "today" ? (
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
          ) : (
            <div>
              <label className="block font-semibold mb-1">Date Range</label>
              <button
                className="border rounded px-2 py-1 bg-white"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {dateRange[0].startDate.toISOString().slice(0, 10)} to{" "}
                {dateRange[0].endDate.toISOString().slice(0, 10)}
              </button>
              {showDatePicker && (
                <div className="absolute z-10">
                  <DateRangePicker
                    ranges={dateRange}
                    onChange={(item) => setDateRange([item.selection])}
                    maxDate={new Date()}
                  />
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Status Graphs */}
        {statusLoading ? (
          <div className="text-center py-16">Loading...</div>
        ) : statusError ? (
          <div className="text-red-500">{statusError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {STATUS_TYPES.map((status) => (
  <div
    key={status}
    className="bg-white rounded shadow p-4 flex flex-col items-center"
  >
    <h2 className="font-semibold mb-2">
      {STATUS_LABELS[status]}
      {selectedUser !== "all" && (
        <span className="text-xs text-gray-500 ml-2">
          ({selectedUser})
        </span>
      )}
    </h2>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={getStatusTrendData(status)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="step"
          dataKey="value"
          stroke={STATUS_COLORS[status]}
          strokeWidth={3}
          dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          name={STATUS_LABELS[status]}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
))}
</div>

        )}
        <SummaryTable usersData={statusHistory?.users || []} />
      </div>
    </div>
  );
};

export default AdminDashboard;

