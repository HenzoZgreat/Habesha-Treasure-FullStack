"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import HomeIcon from "@mui/icons-material/Home"

const OrderSuccess = ({ language, navigate }) => {
  const text = {
    EN: {
      success: "Order Submitted Successfully!",
      thankYou: "Thank you for your order",
      message:
        "Your order has been submitted and is pending payment verification. You will receive a confirmation email once your payment is approved.",
      orderNumber: "Order Number",
      nextSteps: "What happens next?",
      step1: "Our team will verify your payment receipt",
      step2: "You'll receive an email confirmation once approved",
      step3: "Your order will be processed and shipped",
      step4: "You'll receive tracking information via email",
      backToHome: "Back to Home",
      viewOrders: "View My Orders",
    },
    AMH: {
      success: "ትዕዛዝ በተሳካ ሁኔታ ተልኳል!",
      thankYou: "ለትዕዛዝዎ እናመሰግናለን",
      message: "ትዕዛዝዎ ተልኳል እና የክፍያ ማረጋገጫ በመጠባበቅ ላይ ነው። ክፍያዎ ከተፈቀደ በኋላ የማረጋገጫ ኢሜይል ይደርስዎታል።",
      orderNumber: "የትዕዛዝ ቁጥር",
      nextSteps: "ቀጥሎ ምን ይከሰታል?",
      step1: "ቡድናችን የክፍያ ደረሰኝዎን ያረጋግጣል",
      step2: "ከተፈቀደ በኋላ የማረጋገጫ ኢሜይል ይደርስዎታል",
      step3: "ትዕዛዝዎ ይሰራል እና ይላካል",
      step4: "የመከታተያ መረጃ በኢሜይል ይደርስዎታል",
      backToHome: "ወደ መነሻ ይመለሱ",
      viewOrders: "ትዕዛዞቼን ይመልከቱ",
    },
  }

  const currentText = text[language]
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-habesha_blue/20">
          {/* Success Icon */}
          <div className="bg-habesha_blue p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <CheckCircleIcon className="text-white text-5xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentText.success}</h1>
          <h2 className="text-xl text-habesha_blue mb-6">{currentText.thankYou}</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{currentText.message}</p>

          {/* Order Number */}
          <div className="bg-habesha_blue/10 p-6 rounded-xl mb-8 border border-habesha_blue/20">
            <p className="text-sm text-gray-600 mb-2">{currentText.orderNumber}</p>
            <p className="text-2xl font-bold text-habesha_blue">
              {orderNumber}
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentText.nextSteps}</h3>
            <div className="space-y-3">
              {[currentText.step1, currentText.step2, currentText.step3, currentText.step4].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-habesha_blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <HomeIcon />
              {currentText.backToHome}
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-habesha_blue text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingBagIcon />
              {currentText.viewOrders}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess