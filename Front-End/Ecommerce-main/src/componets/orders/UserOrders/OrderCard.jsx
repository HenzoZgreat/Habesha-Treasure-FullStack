"use client"

import { useState, useEffect } from "react"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RefreshIcon from "@mui/icons-material/Refresh"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import userOrderService from "../../../service/userOrderService"

const OrderCard = ({ order, language, onViewDetails, index, onCancel, formatPrice, formatNumber }) => {
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
      cancelOrder: "Cancel Order",
      cancelling: "Cancelling...",
      cancelSuccess: "Order cancelled successfully",
      cancelError: "Failed to cancel order",
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
      cancelOrder: "ትዕዛዝ መሰረዝ",
      cancelling: "በመሰረዝ ላይ...",
      cancelSuccess: "ትዕዛዝ በተሳካ ሁኔታ ተሰርዟል",
      cancelError: "ትዕዛዝ መሰረዝ አልተሳካም",
    },
  }

  const currentText = text[language]
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="text-green-500 w-4 h-4" />
      case "shipped":
        return <LocalShippingIcon className="text-blue-500 w-4 h-4" />
      case "processing":
        return <RefreshIcon className="text-yellow-500 animate-spin w-4 h-4" />
      case "cancelled":
        return <CancelIcon className="text-red-500 w-4 h-4" />
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

  const handleCancel = async () => {
    try {
      setCancelling(true)
      setError(null)
      setSuccess(null)
      await userOrderService.cancelOrder(order.id)
      setSuccess(currentText.cancelSuccess)
      onCancel()
    } catch (err) {
      setError(err.message || currentText.cancelError)
    } finally {
      setCancelling(false)
    }
  }

  const canCancel = ["processing"].includes(order.status)

  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden animate-in slide-in-from-bottom"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-gray-100 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <CalendarTodayIcon className="text-habesha_blue w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              {currentText.orderNumber} #{order.id}
            </h3>
            <p className="text-gray-600 text-sm">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:justify-start sm:gap-6">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-habesha_blue">
                {language === 'EN' ? '$' : 'ETB '}{formatPrice(order.total)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {formatNumber(order.itemCount)} {order.itemCount === 1 ? currentText.item : currentText.items}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusColor(order.status)} self-start sm:self-auto`}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span>{currentText[order.status]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 mb-4 sm:mb-6">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name[language]}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-1">{item.name[language]}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-600">Qty: {formatNumber(item.quantity)}</p>
                  <p className="text-sm font-semibold text-habesha_blue">
                    {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center bg-gray-100 rounded-xl p-3 border border-gray-200">
              <span className="text-habesha_blue font-semibold text-sm">
                +{formatNumber(order.items.length - 3)} more items
              </span>
            </div>
          )}
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-xl mb-4 text-sm text-center">
            {success}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onViewDetails}
            className="w-full bg-white border-2 border-habesha_blue text-habesha_blue py-2 sm:py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-habesha_blue hover:text-white transition-all duration-300 text-sm sm:text-base"
          >
            <VisibilityIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{currentText.viewDetails}</span>
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full bg-red-500 text-white py-2 sm:py-3 px-4 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? currentText.cancelling : currentText.cancelOrder}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCard