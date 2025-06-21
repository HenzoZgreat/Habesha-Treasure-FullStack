"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import CheckoutSummary from "../../componets/CheckOut/CheckoutSummary"
import PaymentInstructions from "../../componets/CheckOut/PaymentInstructions"
import ReceiptUpload from "../../componets/CheckOut/ReceiptUpload"
import OrderSuccess from "../../componets/CheckOut/OrderSuccess"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import SecurityIcon from "@mui/icons-material/Security"

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedReceipt, setUploadedReceipt] = useState(null)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const language = useSelector((state) => state.habesha.language)
  const cartProducts = useSelector((state) => state.habesha.cartProducts)
  const navigate = useNavigate()

  // Demo cart data (replace with actual cart)
  const demoCartItems = [
    {
      id: 1,
      name: { EN: "Traditional Ethiopian Coffee", AMH: "ባህላዊ የኢትዮጵያ ቡና" },
      image: "/placeholder.svg?height=80&width=80",
      quantity: 2,
      price: 24.99,
    },
    {
      id: 2,
      name: { EN: "Berbere Spice Blend", AMH: "በርበሬ ቅመም ድብልቅ" },
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      price: 12.99,
    },
  ]

  const cartItems = cartProducts.length > 0 ? cartProducts : demoCartItems
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const total = subtotal + shipping

  // Bank account details (this would come from your backend)
  const bankDetails = {
    accountNumber: "1000-2345-6789-0123",
    bankName: "Commercial Bank of Ethiopia",
    accountHolder: "Habesha Store Ltd",
    branch: "Bole Branch",
  }

  const text = {
    EN: {
      title: "Checkout",
      subtitle: "Complete your order",
      step1: "Review Order",
      step2: "Payment",
      step3: "Upload Receipt",
      secureCheckout: "Secure Checkout",
      proceedToPayment: "Proceed to Payment",
      submitOrder: "Submit Order",
      backToCart: "Back to Cart",
      orderSubmitted: "Order Submitted Successfully!",
    },
    AMH: {
      title: "ክፍያ",
      subtitle: "ትዕዛዝዎን ያጠናቅቁ",
      step1: "ትዕዛዝ ይገምግሙ",
      step2: "ክፍያ",
      step3: "ደረሰኝ ይላኩ",
      secureCheckout: "ደህንነቱ የተጠበቀ ክፍያ",
      proceedToPayment: "ወደ ክፍያ ይሂዱ",
      submitOrder: "ትዕዛዝ ይላኩ",
      backToCart: "ወደ ጋሪ ይመለሱ",
      orderSubmitted: "ትዕዛዝ በተሳካ ሁኔታ ተልኳል!",
    },
  }

  const currentText = text[language]

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmitOrder = async () => {
    if (!uploadedReceipt) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setOrderSubmitted(true)
      setLoading(false)
    }, 2000)
  }

  if (orderSubmitted) {
    return <OrderSuccess language={language} navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top duration-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-habesha_blue to-blue-400 p-3 rounded-2xl shadow-lg">
              <ShoppingCartIcon className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-habesha_blue to-blue-400 bg-clip-text text-transparent">
                {currentText.title}
              </h1>
              <p className="text-gray-600 text-lg">{currentText.subtitle}</p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <SecurityIcon className="text-green-500" />
            <span>{currentText.secureCheckout}</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-habesha_blue to-blue-400 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <span className={`ml-2 font-medium ${step <= currentStep ? "text-habesha_blue" : "text-gray-500"}`}>
                  {currentText[`step${step}`]}
                </span>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded transition-all duration-300 ${
                      step < currentStep ? "bg-gradient-to-r from-habesha_blue to-blue-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              language={language}
            />
          </div>

          {/* Right Column - Steps */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-habesha_blue/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-8">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image || "/placeholder.svg"}
alt={typeof item.name === "object" && item.name !== null ? item.name[language] : item.name}                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
<h3 className="font-semibold text-gray-800">
  {typeof item.name === "object" && item.name !== null
    ? item.name[language]
    : item.name}
</h3>                        <p className="text-gray-600">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-habesha_blue">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    {currentText.backToCart}
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-habesha_blue to-blue-400 text-white py-3 px-6 rounded-xl hover:from-blue-400 hover:to-habesha_blue transition-all duration-300 font-semibold"
                  >
                    {currentText.proceedToPayment}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <PaymentInstructions
                bankDetails={bankDetails}
                total={total}
                language={language}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <ReceiptUpload
                uploadedReceipt={uploadedReceipt}
                setUploadedReceipt={setUploadedReceipt}
                onSubmit={handleSubmitOrder}
                loading={loading}
                language={language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
