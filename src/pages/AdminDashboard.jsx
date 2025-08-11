import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import {
  fetchLinkedinStatusHistoryThunk,
  fetchUpworkStatusHistoryThunk,
  fetchCombinedStatusHistoryThunk,
} from "../slices/jobsSlice"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { DateRangePicker } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

const STATUS_TYPES = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"]

const STATUS_LABELS = {
  not_engaged: "Not Engaged",
  applied: "Applied",
  engaged: "Engaged",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  onboard: "onboard",
}

const USER_LIST = ["khubaib", "taha", "basit", "huzaifa", "abdulrehman"]

const STATUS_COLORS = {
  not_engaged: "#FF6B6B", // Red
  applied: "#4ECDC4", // Teal
  engaged: "#FFD93D", // Yellow
  interview: "#1A535C", // Dark Blue
  offer: "#FF6F91", // Pink
  rejected: "#5F27CD", // Purple
  onboard: "#00B894", // Green
}

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const {
    linkedinStatusHistory,
    linkedinStatusLoading,
    linkedinStatusError,
    upworkStatusHistory,
    upworkStatusLoading,
    upworkStatusError,
    combinedStatusHistory,
    combinedStatusLoading,
    combinedStatusError,
  } = useSelector((state) => state.jobs)
  const navigate = useNavigate();

  // Filters
  const [platform, setPlatform] = useState("linkedin")
  const [selectedUser, setSelectedUser] = useState("all")
  const [dateType, setDateType] = useState("today")
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }])
  const [singleDate, setSingleDate] = useState(new Date().toISOString().slice(0, 10))
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Fetch data on filter change
  useEffect(() => {
    const start = dateType === "range" ? dateRange[0].startDate.toISOString().slice(0, 10) : undefined
    const end = dateType === "range" ? dateRange[0].endDate.toISOString().slice(0, 10) : undefined
    const date = dateType === "today" ? singleDate : undefined

    if (platform === "linkedin") {
      dispatch(fetchLinkedinStatusHistoryThunk({ date, start, end }))
    } else if (platform === "upwork") {
      dispatch(fetchUpworkStatusHistoryThunk({ date, start, end }))
    } else if (platform === "all") {
      dispatch(fetchCombinedStatusHistoryThunk({ date, start, end }))
    }
  }, [platform, dateType, singleDate, dateRange, dispatch])

  // Get the correct data
  const statusHistory =
    platform === "linkedin"
      ? linkedinStatusHistory
      : platform === "upwork"
        ? upworkStatusHistory
        : combinedStatusHistory

  const statusLoading =
    platform === "linkedin"
      ? linkedinStatusLoading
      : platform === "upwork"
        ? upworkStatusLoading
        : combinedStatusLoading

  const statusError =
    platform === "linkedin" ? linkedinStatusError : platform === "upwork" ? upworkStatusError : combinedStatusError

  // Helper function to ensure line visibility for single date
  const ensureLineVisibility = (data) => {
    if (!data || data.length === 0) return []

    if (data.length === 1) {
      // For single date, create additional points to show a line
      const singlePoint = data[0]
      const date = new Date(singlePoint.fullDate)

      // Create previous day point with same value
      const prevDate = new Date(date)
      prevDate.setDate(date.getDate() - 1)

      // Create next day point with same value
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      return [
        {
          ...singlePoint,
          date: prevDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: prevDate.toISOString().slice(0, 10),
          isHelper: true, // Mark as helper point
        },
        {
          ...singlePoint,
          isHelper: false, // Mark as actual data point
        },
        {
          ...singlePoint,
          date: nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: nextDate.toISOString().slice(0, 10),
          isHelper: true, // Mark as helper point
        },
      ]
    }

    return data
  }

  // Prepare data for each status graph with zigzag line chart
  function getStatusTrendData(status) {
    const dailyTotals = statusHistory?.dailyTotals || []
    let data = []

    if (selectedUser === "all") {
      // Show aggregated data for all users from dailyTotals
      data = dailyTotals.map((day) => ({
        date: new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: day[status] || 0,
        fullDate: day.date,
        isHelper: false,
      }))
    } else {
      // For individual user, we need to extract their data from the users array
      // Since dailyTotals doesn't have per-user breakdown, we'll use the user's total status count
      // and distribute it across the available dates (this is a limitation of the current API structure)
      const users = statusHistory?.users || []
      const selectedUserData = users.find((u) => u.username && u.username.toLowerCase() === selectedUser.toLowerCase())

      if (selectedUserData && selectedUserData.statuses) {
        const userStatusValue = selectedUserData.statuses[status] || 0

        // If we have daily data, distribute the user's total across the days
        // This is an approximation since the API doesn't provide daily breakdown per user
        if (dailyTotals.length > 0) {
          data = dailyTotals.map((day, index) => ({
            date: new Date(day.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            // For now, show the total value on the last day, 0 on others
            // This could be improved with better API data structure
            value: index === dailyTotals.length - 1 ? userStatusValue : 0,
            fullDate: day.date,
            isHelper: false,
          }))
        } else {
          // If no daily data, create a single point for today
          data = [
            {
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              value: userStatusValue,
              fullDate: new Date().toISOString().slice(0, 10),
              isHelper: false,
            },
          ]
        }
      } else {
        // User not found or no data
        data = dailyTotals.map((day) => ({
          date: new Date(day.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          value: 0,
          fullDate: day.date,
          isHelper: false,
        }))
      }
    }

    return ensureLineVisibility(data)
  }

  // Prepare combined data for all statuses overview
  function getCombinedStatusData() {
    const dailyTotals = statusHistory?.dailyTotals || []

    if (selectedUser === "all") {
      // Show aggregated data for all users
      const data = dailyTotals.map((day) => {
        const dataPoint = {
          date: new Date(day.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          fullDate: day.date,
          isHelper: false,
        }

        STATUS_TYPES.forEach((status) => {
          dataPoint[status] = day[status] || 0
        })

        return dataPoint
      })

      // Ensure line visibility for combined data
      if (data.length === 1) {
        const singlePoint = data[0]
        const date = new Date(singlePoint.fullDate)

        const prevDate = new Date(date)
        prevDate.setDate(date.getDate() - 1)

        const nextDate = new Date(date)
        nextDate.setDate(date.getDate() + 1)

        const prevPoint = {
          ...singlePoint,
          date: prevDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: prevDate.toISOString().slice(0, 10),
          isHelper: true,
        }

        const nextPoint = {
          ...singlePoint,
          date: nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: nextDate.toISOString().slice(0, 10),
          isHelper: true,
        }

        return [prevPoint, { ...singlePoint, isHelper: false }, nextPoint]
      }

      return data
    } else {
      // For individual user, get their data from users array
      const users = statusHistory?.users || []
      const selectedUserData = users.find((u) => u.username && u.username.toLowerCase() === selectedUser.toLowerCase())

      if (selectedUserData && selectedUserData.statuses) {
        // Create data points based on available daily dates
        const data =
          dailyTotals.length > 0
            ? dailyTotals.map((day, index) => {
                const dataPoint = {
                  date: new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                  fullDate: day.date,
                  isHelper: false,
                }

                STATUS_TYPES.forEach((status) => {
                  // Show user's total values on the last day, 0 on others
                  // This is a limitation of current API structure
                  dataPoint[status] = index === dailyTotals.length - 1 ? selectedUserData.statuses[status] || 0 : 0
                })

                return dataPoint
              })
            : [
                {
                  date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                  fullDate: new Date().toISOString().slice(0, 10),
                  isHelper: false,
                  ...STATUS_TYPES.reduce((acc, status) => {
                    acc[status] = selectedUserData.statuses[status] || 0
                    return acc
                  }, {}),
                },
              ]

        // Ensure line visibility
        if (data.length === 1) {
          const singlePoint = data[0]
          const date = new Date(singlePoint.fullDate)

          const prevDate = new Date(date)
          prevDate.setDate(date.getDate() - 1)

          const nextDate = new Date(date)
          nextDate.setDate(date.getDate() + 1)

          const prevPoint = {
            ...singlePoint,
            date: prevDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fullDate: prevDate.toISOString().slice(0, 10),
            isHelper: true,
          }

          const nextPoint = {
            ...singlePoint,
            date: nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            fullDate: nextDate.toISOString().slice(0, 10),
            isHelper: true,
          }

          return [prevPoint, { ...singlePoint, isHelper: false }, nextPoint]
        }

        return data
      } else {
        // User not found, return empty data
        return dailyTotals.map((day) => {
          const dataPoint = {
            date: new Date(day.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            fullDate: day.date,
            isHelper: false,
          }

          STATUS_TYPES.forEach((status) => {
            dataPoint[status] = 0
          })

          return dataPoint
        })
      }
    }
  }

  // Custom tooltip that handles helper points
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Check if this is a helper point
      const isHelperPoint = payload[0]?.payload?.isHelper

      if (isHelperPoint) {
        return null // Don't show tooltip for helper points
      }

      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom dot component that hides helper points
  const CustomDot = (props) => {
    const { payload } = props
    if (payload?.isHelper) {
      return null // Don't render dots for helper points
    }
    return <circle {...props} />
  }

  // Custom active dot component
  const CustomActiveDot = (props) => {
    const { payload } = props
    if (payload?.isHelper) {
      return null // Don't render active dots for helper points
    }
    return <circle {...props} />
  }

  const SummaryTable = ({ usersData }) => {
    // Filter users based on selection
    const filteredUsers =
      selectedUser === "all"
        ? USER_LIST.map((user) => {
            const apiUser = usersData.find((u) => u.username && u.username.toLowerCase() === user.toLowerCase())
            return { username: user, data: apiUser }
          })
        : USER_LIST.filter((user) => user.toLowerCase() === selectedUser.toLowerCase()).map((user) => {
            const apiUser = usersData.find((u) => u.username && u.username.toLowerCase() === user.toLowerCase())
            return { username: user, data: apiUser }
          })

    return (
      <div className="overflow-x-auto rounded-lg shadow bg-white mt-12">
        <h2 className="text-xl font-bold p-4 bg-gray-50 border-b">
          User Summary Table -{" "}
          {selectedUser === "all" ? "All Users" : selectedUser.charAt(0).toUpperCase() + selectedUser.slice(1)}
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              {STATUS_TYPES.map((status) => (
                <th key={status} className="px-4 py-3 text-center font-semibold text-gray-700">
                  {STATUS_LABELS[status]}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(({ username, data: apiUser }) => {
              const total = STATUS_TYPES.reduce((sum, status) => sum + (apiUser?.statuses?.[status] || 0), 0)

              return (
                <tr key={username} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 capitalize">{username}</td>
                  {STATUS_TYPES.map((status) => (
                    <td key={status} className="px-4 py-3 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded text-sm font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[status]}20`,
                          color: STATUS_COLORS[status],
                        }}
                      >
                        {apiUser?.statuses?.[status] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-gray-900">{total}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (

       
    <div className="min-h-screen bg-gray-50 p-6">
      
      <div className="max-w-7xl mx-auto">
      <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Jobs
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="linkedin">LinkedIn</option>
                <option value="upwork">Upwork</option>
              </select>
            </div>

            {/* User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="all">All Users</option>
                {USER_LIST.map((user) => (
                  <option key={user} value={user}>
                    {user.charAt(0).toUpperCase() + user.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
            ) : (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <button
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  {dateRange[0].startDate.toISOString().slice(0, 10)} to{" "}
                  {dateRange[0].endDate.toISOString().slice(0, 10)}
                </button>
                {showDatePicker && (
                  <div className="absolute z-20 mt-1">
                    <DateRangePicker
                      ranges={dateRange}
                      onChange={(item) => setDateRange([item.selection])}
                      maxDate={new Date()}
                    />
                    <div className="bg-white p-2 border-t">
                      <button
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply Range
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading/Error States */}
        {statusLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading dashboard data...</span>
          </div>
        ) : statusError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <p className="mt-1 text-sm text-red-700">{statusError}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Combined Overview Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Status Overview -{" "}
                {selectedUser === "all" ? "All Users" : selectedUser.charAt(0).toUpperCase() + selectedUser.slice(1)}(
                {platform === "all" ? "All Platforms" : platform.toUpperCase()})
              </h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getCombinedStatusData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    {STATUS_TYPES.map((status) => (
                      <Line
                        key={status}
                        type="monotone"
                        dataKey={status}
                        stroke={STATUS_COLORS[status]}
                        strokeWidth={3}
                        dot={<CustomDot r={5} strokeWidth={2} />}
                        activeDot={<CustomActiveDot r={7} strokeWidth={2} />}
                        name={STATUS_LABELS[status]}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Status Line Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {STATUS_TYPES.map((status) => (
                <div key={status} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{STATUS_LABELS[status]}</h3>
                    {selectedUser !== "all" && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedUser}</span>
                    )}
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getStatusTrendData(status)} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis tick={{ fontSize: 10 }} axisLine={{ stroke: "#e5e7eb" }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#fff",
                            border: `2px solid ${STATUS_COLORS[status]}`,
                            borderRadius: 8,
                            fontSize: "12px",
                          }}
                          content={<CustomTooltip />}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={STATUS_COLORS[status]}
                          strokeWidth={3}
                          dot={<CustomDot r={4} fill={STATUS_COLORS[status]} strokeWidth={2} stroke="#fff" />}
                          activeDot={
                            <CustomActiveDot r={6} fill={STATUS_COLORS[status]} strokeWidth={2} stroke="#fff" />
                          }
                          name={STATUS_LABELS[status]}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Table */}
            <SummaryTable usersData={statusHistory?.users || []} />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard



