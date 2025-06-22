"use client"

import { useState, useEffect } from "react"
import CloseIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RefreshIcon from "@mui/icons-material/Refresh"
import CancelIcon from "@mui/icons-material/Cancel"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import ReceiptIcon from "@mui/icons-material/Receipt"
import userOrderService from "../../../service/userOrderService"

const OrderModal = ({ order, language, onClose, formatPrice, formatNumber }) => {
  const [proofImage, setProofImage] = useState(null)
  const [proofError, setProofError] = useState(null)
  const [proofLoading, setProofLoading] = useState(false)

  const text = {
    EN: {
      orderDetails: "Order Details",
      orderNumber: "Order Number",
      orderDate: "Order Date",
      orderStatus: "Status",
      totalAmount: "Total Amount",
      items: "Items",
      delivered: "Delivered",
      shipped: "Shipped",
      processing: "Processing",
      cancelled: "Cancelled",
      quantity: "Quantity",
      price: "Price",
      subtotal: "Subtotal",
      paymentProof: "Payment Proof",
      noProof: "No payment proof uploaded",
      loadingProof: "Loading payment proof...",
      proofError: "Failed to load payment proof",
    },
    AMH: {
      orderDetails: "የትዕዛዝ ዝርዝሮች",
      orderNumber: "የትዕዛዝ ቁጥር",
      orderDate: "የትዕዛዝ ቀን",
      orderStatus: "ሁኔታ",
      totalAmount: "ጠቅላላ መጠን",
      items: "እቃዎች",
      delivered: "ተደርሷል",
      shipped: "ተልኳል",
      processing: "በሂደት ላይ",
      cancelled: "ተሰርዟል",
      quantity: "ብዛት",
      price: "ዋጋ",
      subtotal: "ንዑስ ድምር",
      paymentProof: "የክፍያ ማረጋገጫ",
      noProof: "ምንም የክፍያ ማረጋገጫ አልተሰቀለም",
      loadingProof: "የክፍያ ማረጋገጫ በመጫን ላይ...",
      proofError: "የክፍያ ማረጋገጫ መጫን አልተሳካም",
    },
  }

  const currentText = text[language]

  useEffect(() => {
    const fetchProof = async () => {
      try {
        setProofLoading(true)
        setProofError(null)
        const response = await userOrderService.getOrderProof(order.id)
        if (response.status === 204) {
          setProofImage(null)
        } else {
          const imageUrl = URL.createObjectURL(response.data)
          setProofImage(imageUrl)
        }
      } catch (err) {
        setProofError(currentText.proofError)
      } finally {
        setProofLoading(false)
      }
    }
    fetchProof()
    return () => {
      if (proofImage) URL.revokeObjectURL(proofImage)
    }
  }, [order.id, currentText.proofError])

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
      case "shipped":
        return <LocalShippingIcon className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
      case "processing":
        return <RefreshIcon className="text-yellow-500 animate-spin w-5 h-5 sm:w-6 sm:h-6" />
      case "cancelled":
        return <CancelIcon className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-habesha_blue text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0">
                <CalendarTodayIcon className="text-lg sm:text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold truncate">{currentText.orderDetails}</h2>
                <p className="text-blue-100 text-sm sm:text-base">#{order.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors duration-200 flex-shrink-0 ml-2"
            >
              <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
          <div className="space-y-3 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-6 sm:space-y-0 mb-6 sm:mb-8">
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                <CalendarTodayIcon className="text-habesha_blue text-xl sm:text-3xl flex-shrink-0" />
                <div className="flex-1 sm:flex-none">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">
                    {currentText.orderDate}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-habesha_blue">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                <div className="flex-shrink-0">{getStatusIcon(order.status)}</div>
                <div className="flex-1 sm:flex-none">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">
                    {currentText.orderStatus}
                  </h3>
                  <div
                    className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusColor(order.status)}`}
                  >
                    {currentText[order.status]}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                <AttachMoneyIcon className="text-habesha_blue text-xl sm:text-3xl flex-shrink-0" />
                <div className="flex-1 sm:flex-none">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">
                    {currentText.totalAmount}
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-habesha_blue">
                    {language === 'EN' ? '$' : 'ETB '}{formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
              <div className="bg-habesha_blue p-2 rounded-xl">
                <span className="text-white font-bold text-sm sm:text-base">{formatNumber(order.items.length)}</span>
              </div>
              <span className="text-sm sm:text-xl">{currentText.items}</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:flex-1">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name[language]}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                          {item.name[language]}
                        </h4>
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:text-sm">
                      <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm">{currentText.quantity}:</span>
                          <span className="font-semibold text-sm">{formatNumber(item.quantity)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm">{currentText.price}:</span>
                          <span className="font-semibold text-sm">
                            {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.price)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 text-sm">{currentText.subtotal}:</span>
                          <span className="font-bold text-habesha_blue text-sm">
                            {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.quantity * item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block text-center md:text-left">
                        <span className="text-gray-600">{currentText.quantity}:</span>
                        <span className="font-semibold ml-2">{formatNumber(item.quantity)}</span>
                      </div>
                      <div className="hidden sm:block text-center md:text-left">
                        <span className="text-gray-600">{currentText.price}:</span>
                        <span className="font-semibold ml-2">
                          {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.price)}
                        </span>
                      </div>
                      <div className="hidden sm:block text-center md:text-left">
                        <span className="text-gray-600">{currentText.subtotal}:</span>
                        <span className="font-bold text-habesha_blue ml-2">
                          {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.quantity * item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-200">
              <div className="bg-gray-100 p-4 sm:p-6 rounded-xl border-2 border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">{currentText.totalAmount}</span>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-habesha_blue">
                      {language === 'EN' ? '$' : 'ETB '}{formatPrice(order.total)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">Final Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
              <div className="bg-habesha_blue p-2 rounded-xl">
                <ReceiptIcon className="text-white text-sm sm:text-base" />
              </div>
              <span className="text-sm sm:text-xl">{currentText.paymentProof}</span>
            </h3>
            {proofLoading ? (
              <div className="text-center text-gray-600">{currentText.loadingProof}</div>
            ) : proofError ? (
              <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center">{proofError}</div>
            ) : proofImage ? (
              <div className="flex justify-center">
                <img
                  src={proofImage}
                  alt="Payment Proof"
                  className="max-w-full max-h-96 rounded-xl border-2 border-gray-200 object-contain"
                />
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-xl text-center text-gray-600">
                {currentText.noProof}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderModal