"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ProfileHeader from "../../componets/users/UserProfile/ProfileHeader"
import PersonalInfoCard from "../../componets/users/UserProfile/PersonalInfoCard"
import AddressCard from "../../componets/users/UserProfile/AddressCard"
import AccountSettingsCard from "../../componets/users/UserProfile/AccountSettingsCard"
import OrderHistoryCard from "../../componets/users/UserProfile/OrderHistoryCard"
import PersonIcon from "@mui/icons-material/Person"
import SecurityIcon from "@mui/icons-material/Security"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import UserUserService from "../../service/UserUserService"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState({})
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const language = useSelector((state) => state.habesha.language)
  const navigate = useNavigate()

  const text = {
    EN: {
      title: "My Profile",
      subtitle: "Manage your account information and preferences",
      personalInfo: "Personal Information",
      accountSettings: "Account Settings",
      orderHistory: "Order History",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Address",
      street: "Street Address",
      city: "City",
      state: "State/Region",
      zipCode: "ZIP Code",
      country: "Country",
      language: "Language",
      notifications: "Notifications",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      pushNotifications: "Push Notifications",
      newsletter: "Newsletter Subscription",
      changePassword: "Change Password",
      memberSince: "Member Since",
      totalOrders: "Total Orders",
      favoriteItems: "Favorite Items",
      loading: "Loading profile...",
      error: "Failed to load profile",
      notLoggedIn: "Please sign in to view your profile",
      signIn: "Sign In",
      backToProducts: "Back to Products",
    },
    AMH: {
      title: "የእኔ መገለጫ",
      subtitle: "የመለያዎን መረጃ እና ምርጫዎች ያስተዳድሩ",
      personalInfo: "የግል መረጃ",
      accountSettings: "የመለያ ቅንብሮች",
      orderHistory: "የትዕዛዝ ታሪክ",
      firstName: "የመጀመሪያ ስም",
      lastName: "የአባት ስም",
      email: "የኢሜይል አድራሻ",
      phone: "የስልክ ቁጥር",
      address: "አድራሻ",
      street: "የመንገድ አድራሻ",
      city: "ከተማ",
      state: "ክልል",
      zipCode: "የፖስታ ኮድ",
      country: "ሀገር",
      language: "ቋንቋ",
      notifications: "ማሳወቂያዎች",
      emailNotifications: "የኢሜይል ማሳወቂያዎች",
      smsNotifications: "የኤስኤምኤስ ማሳወቂያዎች",
      pushNotifications: "የግፊት ማሳወቂዪዎች",
      newsletter: "የዜና ደብዳቤ ምዝገባ",
      changePassword: "የይለፍ ቃል ቀይር",
      memberSince: "አባል ከሆነ",
      totalOrders: "ጠቅላላ ትዕዛዞች",
      favoriteItems: "ተወዳጅ እቃዎች",
      loading: "መገለጫን በመጫን ላይ...",
      error: "መገለጫን መጫን አልተቻለም",
      notLoggedIn: "መገለጫዎን ለማየት እባክዎ ይግቡ",
      signIn: "ይግቡ",
      backToProducts: "ወደ ምርቶች ተመለስ",
    },
  }

  const currentText = text[language]

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }
      const response = await UserUserService.getUserProfile()
      const userData = {
        ...response.data,
        address: {
          street: response.data.street || "",
          city: response.data.city || "",
          state: response.data.region || "",
          zipCode: response.data.zipCode || "",
          country: response.data.country || "",
        },
        avatar: response.data.avatar || "/placeholder.svg",
        joinDate: response.data.joined,
        stats: {
          totalOrders: response.data.totalOrders || 0,
          favoriteItems: response.data.favoriteItems || 0,
        },
      }
      setUser(userData)
      setFormData(userData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error.response?.data?.message || currentText.error)
      setLoading(false)
    }
  }

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
  }

  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false })
    setFormData({ ...formData, [field]: user[field] })
  }

  const handleSave = async (field) => {
    try {
      setSaving(true)
      // Replace with actual API call
      setTimeout(() => {
        setUser({ ...user, [field]: formData[field] })
        setEditMode({ ...editMode, [field]: false })
        setSaving(false)
      }, 500)
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  const tabs = [
    { id: "personal", label: currentText.personalInfo, icon: PersonIcon },
    { id: "settings", label: currentText.accountSettings, icon: SecurityIcon },
    { id: "orders", label: currentText.orderHistory, icon: ShoppingBagIcon },
  ]

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg flex items-center justify-center">
            <PersonIcon className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{currentText.notLoggedIn}</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/SignIn")}
              className="bg-habesha_blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentText.signIn}
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-habesha_yellow text-habesha_blue px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2"
            >
              <ShoppingBagIcon />
              {currentText.backToProducts}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-habesha_blue mx-auto mb-4"></div>
          <p className="text-habesha_blue font-medium">{currentText.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={fetchUserProfile}
            className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-habesha_blue mb-2">{currentText.title}</h1>
          <p className="text-gray-600">{currentText.subtitle}</p>
        </div>

        <ProfileHeader user={user} currentText={currentText} />

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-habesha_blue text-habesha_blue"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="text-sm" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PersonalInfoCard
              user={user}
              formData={formData}
              editMode={editMode}
              saving={saving}
              currentText={currentText}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              onInputChange={handleInputChange}
            />
            <AddressCard
              user={user}
              formData={formData}
              editMode={editMode}
              saving={saving}
              currentText={currentText}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              onInputChange={handleInputChange}
            />
          </div>
        )}

        {/* {activeTab === "settings" && <AccountSettingsCard user={user} currentText={currentText} language={language} />} */}

        {activeTab === "orders" && <OrderHistoryCard currentText={currentText} />}
      </div>
    </div>
  )
}

export default ProfilePage