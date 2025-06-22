"use client"

import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import { useRef } from "react"

const ReceiptUpload = ({ uploadedReceipt, setUploadedReceipt, onSubmit, loading, language, orderId, total, formatPrice }) => {
  const fileInputRef = useRef(null)

  const text = {
    EN: {
      uploadReceipt: "Upload Payment Receipt",
      uploadInstructions: "Upload a clear photo or screenshot of your payment receipt",
      dragDrop: "Drag and drop your receipt here, or click to browse",
      supportedFormats: "Supported formats: JPG, PNG, PDF (Max 5MB)",
      uploadedFile: "Uploaded File",
      removeFile: "Remove File",
      submitOrder: "Submit Order",
      submitting: "Submitting Order...",
      pleaseUpload: "Please upload your payment receipt to continue",
      requirements: "Receipt Requirements",
      req1: "Clear and readable image",
      req2: "Shows the exact amount transferred",
      req3: "Shows the recipient account details",
      req4: "Shows the transaction date and time",
      amountPaid: "Amount Paid",
    },
    AMH: {
      uploadReceipt: "የክፍያ ደረሰኝ ይላኩ",
      uploadInstructions: "የክፍያ ደረሰኝዎን ግልጽ ፎቶ ወይም ቅጽበታዊ ምስል ይላኩ",
      dragDrop: "ደረሰኝዎን እዚህ ይጎትቱ እና ይጣሉ፣ ወይም ለማሰስ ይጫኑ",
      supportedFormats: "የሚደገፉ ቅርጸቶች: JPG, PNG, PDF (ከ5MB በታች)",
      uploadedFile: "የተላከ ፋይል",
      removeFile: "ፋይል አስወግድ",
      submitOrder: "ትዕዛዝ ላክ",
      submitting: "ትዕዛዝ በመላክ ላይ...",
      pleaseUpload: "ለመቀጠል የክፍያ ደረሰኝዎን እባክዎ ይላኩ",
      requirements: "የደረሰኝ መስፈርቶች",
      req1: "ግልጽ እና ሊነበብ የሚችል ምስል",
      req2: "የተላለፈውን ትክክለኛ መጠን ያሳያል",
      req3: "የተቀባይ መለያ ዝርዝሮችን ያሳያል",
      req4: "የግብይት ቀን እና ሰዓት ያሳያል",
      amountPaid: "የተከፈለ መጠን",
    },
  }

  const currentText = text[language]

  const handleFileSelect = (file) => {
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setUploadedReceipt(file)
    } else {
      alert("File size must be less than 5MB")
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-habesha_blue/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <CloudUploadIcon className="text-habesha_blue text-3xl" />
        {currentText.uploadReceipt}
      </h2>

      <p className="text-gray-600 mb-8">{currentText.uploadInstructions}</p>

      {/* Amount Paid */}
      <div className="mb-8 p-6 bg-habesha_blue/10 rounded-xl border-2 border-habesha_blue/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentText.amountPaid}</h3>
        <div className="text-4xl font-bold text-habesha_blue">
          {language === 'EN' ? '$' : 'ETB '}{formatPrice(total)}
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        {!uploadedReceipt ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-habesha_blue/30 rounded-xl p-12 text-center cursor-pointer hover:border-habesha_blue/50 hover:bg-habesha_blue/5 transition-all duration-300"
          >
            <CloudUploadIcon className="text-habesha_blue text-6xl mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800 mb-2">{currentText.dragDrop}</p>
            <p className="text-gray-600">{currentText.supportedFormats}</p>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="text-green-500 text-3xl" />
                <div>
                  <p className="font-semibold text-gray-800">{currentText.uploadedFile}</p>
                  <p className="text-gray-600">{uploadedReceipt.name}</p>
                  <p className="text-sm text-gray-500">{(uploadedReceipt.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => setUploadedReceipt(null)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileInput} className="hidden" />
      </div>

      {/* Requirements */}
      <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">ℹ️</span>
          {currentText.requirements}
        </h3>
        <ul className="space-y-2">
          {[currentText.req1, currentText.req2, currentText.req3, currentText.req4].map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <CheckCircleIcon className="text-green-500 text-sm mt-1" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={!uploadedReceipt || loading || !orderId}
        className="w-full bg-habesha_blue text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            {currentText.submitting}
          </>
        ) : (
          currentText.submitOrder
        )}
      </button>

      {!uploadedReceipt && <p className="text-center text-red-500 mt-4 text-sm">{currentText.pleaseUpload}</p>}
    </div>
  )
}

export default ReceiptUpload