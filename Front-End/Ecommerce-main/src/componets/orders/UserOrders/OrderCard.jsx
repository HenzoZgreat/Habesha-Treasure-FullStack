"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RefreshIcon from "@mui/icons-material/Refresh"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"

const OrderCard = ({ order, language, onViewDetails, index }) => {
  const text = {
    EN: {
      orderNumber: "Order",
      items: "items",
      item: "item",
      viewDetails: "View Details",
      delivered: "Delivered",
      shipped: "Shipped",
      processing: "Processing",
      cancelled: "Cancelled",
    },
    AMH: {
      orderNumber: "ትዕዛዝ",
      items: "እቃዎች",
      item: "እቃ",
      viewDetails: "ዝርዝሮችን ይመልከቱ",
      delivered: "ተደርሷል",
      shipped: "ተልኳል",
      processing: "በሂደት ላይ",
      cancelled: "ተሰርዟል",
    },
  }

  const currentText = text[language]

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="text-green-500" />
      case "shipped":
        return <LocalShippingIcon className="text-blue-500" />
      case "processing":
        return <RefreshIcon className="text-yellow-500 animate-spin" />
      case "cancelled":
        return <CancelIcon className="text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-in slide-in-from-bottom"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-habesha_blue/5 to-habesha_blue/15 px-6 py-4 border-b border-habesha_blue/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <CalendarTodayIcon className="text-habesha_blue" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {currentText.orderNumber} #{order.id}
              </h3>
              <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-habesha_blue">${order.total}</p>
              <p className="text-sm text-gray-600">
                {order.itemCount} {order.itemCount === 1 ? currentText.item : currentText.items}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                {currentText[order.status]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 flex-1 min-w-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name[language]}
                className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate text-sm">{item.name[language]}</h4>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center bg-gradient-to-r from-habesha_blue/10 to-habesha_blue/20 rounded-xl p-3 min-w-[100px] border border-habesha_blue/30">
              <span className="bg-gradient-to-r from-habesha_blue to-blue-400 bg-clip-text text-transparent font-semibold">
                +{order.items.length - 3} more
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="relative w-full overflow-hidden bg-white border-2 border-habesha_blue text-habesha_blue py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 group-hover:scale-[1.02] transform transition-all duration-300 hover:text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-habesha_blue to-blue-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          <VisibilityIcon className="relative z-10" />
          <span className="relative z-10">{currentText.viewDetails}</span>
        </button>
      </div>
    </div>
  )
}

export default OrderCard
