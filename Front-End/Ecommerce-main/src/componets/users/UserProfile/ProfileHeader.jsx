import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { useSelector } from "react-redux"

const ProfileHeader = ({ user, currentText }) => {
  const language = useSelector((state) => state.habesha.language)
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-habesha_yellow">
            <img src={user.avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-habesha_yellow text-habesha_blue p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors">
            <PhotoCameraIcon className="text-sm" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarTodayIcon className="text-xs" />
              {currentText.memberSince} {new Date(user.joinDate).toLocaleDateString(language === "AMH" ? "am-ET" : "en-US")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-habesha_blue">{user.stats.totalOrders}</div>
            <div className="text-xs text-gray-600">{currentText.totalOrders}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-habesha_blue">{user.stats.favoriteItems}</div>
            <div className="text-xs text-gray-600">{currentText.favoriteItems}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader