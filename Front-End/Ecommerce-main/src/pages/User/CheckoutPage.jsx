"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { resetCart } from "../../redux/HabeshaSlice"
import CheckoutSummary from "../../componets/CheckOut/CheckoutSummary"
import PaymentInstructions from "../../componets/CheckOut/PaymentInstructions"
import ReceiptUpload from "../../componets/CheckOut/ReceiptUpload"
import OrderSuccess from "../../componets/CheckOut/OrderSuccess"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import SecurityIcon from "@mui/icons-material/Security"
import userOrderService from "../../service/userOrderService"
import UserSettingsService from "../../service/UserSettingsService"

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedReceipt, setUploadedReceipt] = useState(null)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const language = useSelector((state) => state.habesha.language)
  const cartProducts = useSelector((state) => state.habesha.cartProducts)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [exchangeRate, setExchangeRate] = useState(150); // Default value

  const formatPrice = (value) => {
    const price = language === 'EN' ? value : value * exchangeRate
    return price.toLocaleString(language === 'AMH' ? 'am-ET' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const cartItems = cartProducts.length > 0 ? cartProducts.map(item => ({
    ...item,
    name: typeof item.title === 'string' ? { [language]: item.title } : item.title,
    price: item.price
  })) : []

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const total = subtotal + shipping

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
      reviewOrder: "Review Your Order",
      cartEmpty: "Your cart is empty",
      pleaseUpload: "Please upload your payment receipt to continue",
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
      reviewOrder: "ትዕዛዝዎን ይገምግሙ",
      cartEmpty: "ጋሪዎ ባዶ ነው",
      pleaseUpload: "ለመቀጠል የክፍያ ደረሰኝዎን ይላኩ",
    },
  }

  const currentText = text[language]

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (cartItems.length === 0) {
        setError(currentText.cartEmpty)
        return
      }
      try {
        setLoading(true)
        const createResponse = await userOrderService.createOrder()
        if (createResponse.data.orderId) {
          setOrderId(createResponse.data.orderId)
          const orderResponse = await userOrderService.getOrderById(createResponse.data.orderId)
          setOrderDetails(orderResponse.data)
          dispatch(resetCart())
          setCurrentStep(2) // Move to Payment Instructions
          setError(null)
        }
      } catch (err) {
        setError(err.message || currentText.cartEmpty)
      } finally {
        setLoading(false)
      }
    } else if (currentStep === 2) {
      setCurrentStep(3) // Move to Upload Receipt
    }
  }

  const handleSubmitOrder = async () => {
    if (!uploadedReceipt || !orderId) {
      setError(currentText.pleaseUpload)
      return
    }

    setLoading(true)
    try {
      await userOrderService.uploadProof(orderId, uploadedReceipt)
      setOrderSubmitted(true) // Move to Order Success
    } catch (err) {
      setError(err.message || 'Failed to submit order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings();
        setExchangeRate(response.data.storeInfo.exchangeRate || 150);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setExchangeRate(150); // Fallback to default
      }
    };
    fetchSettings();
  }, []);

  if (orderSubmitted) {
    return <OrderSuccess language={language} navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-top duration-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-habesha_blue p-3 rounded-2xl shadow-lg">
              <ShoppingCartIcon className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-habesha_blue">
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
                      ? "bg-habesha_blue text-white"
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
                      step < currentStep ? "bg-habesha_blue" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              cartItems={currentStep === 1 ? cartItems : (orderDetails?.items || []).map(item => ({
                ...item,
                name: { [language]: item.name },
              }))}
              subtotal={currentStep === 1 ? subtotal : (orderDetails?.totalPrice || 0) - shipping}
              shipping={shipping}
              total={currentStep === 1 ? total : (orderDetails?.totalPrice || 0)}
              language={language}
              formatPrice={formatPrice}
            />
          </div>

          {/* Right Column - Steps */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-habesha_blue/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentText.reviewOrder}</h2>
                <div className="space-y-4 mb-8">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={typeof item.name === "object" && item.name !== null ? item.name[language] : item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {typeof item.name === "object" && item.name !== null
                            ? item.name[language]
                            : item.name}
                        </h3>
                        <p className="text-gray-600">
                          Qty: {item.quantity} × {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-habesha_blue">
                          {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.quantity * item.price)}
                        </p>
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
                    disabled={loading}
                    className="flex-1 bg-habesha_blue text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : currentText.proceedToPayment}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <PaymentInstructions
                bankDetails={bankDetails}
                total={orderDetails?.totalPrice || total}
                language={language}
                onNext={handleNextStep}
                formatPrice={formatPrice}
              />
            )}

            {currentStep === 3 && (
              <ReceiptUpload
                uploadedReceipt={uploadedReceipt}
                setUploadedReceipt={setUploadedReceipt}
                onSubmit={handleSubmitOrder}
                loading={loading}
                language={language}
                orderId={orderId}
                total={orderDetails?.totalPrice || total}
                formatPrice={formatPrice}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage