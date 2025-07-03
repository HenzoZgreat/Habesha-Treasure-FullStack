"use client"

import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useState, useEffect } from "react";
import UserSettingsService from "../../service/UserSettingsService"

const PaymentInstructions = ({ bankDetails, total, language, onNext, formatPrice }) => {
  const [copiedField, setCopiedField] = useState("")
  const [settingsBankDetails, setSettingsBankDetails] = useState(null)

  const text = {
    EN: {
      paymentInstructions: "Payment Instructions",
      step1: "Transfer the exact amount to the account below",
      step2: "Take a screenshot of your payment receipt",
      step3: "Upload the receipt in the next step",
      bankDetails: "Bank Details",
      accountNumber: "Account Number",
      bankName: "Bank Name",
      accountHolder: "Account Holder",
      branch: "Branch",
      amountToPay: "Amount to Pay",
      copy: "Copy",
      copied: "Copied!",
      important: "Important Notes",
      note1: "Transfer the exact amount shown above",
      note2: "Include your order reference in the transfer description if possible",
      note3: "Keep your receipt safe - you'll need to upload it",
      note4: "Your order will be processed after payment verification",
      continueToUpload: "Continue to Upload Receipt",
    },
    AMH: {
      paymentInstructions: "የክፍያ መመሪያዎች",
      step1: "ትክክለኛውን መጠን ወደ ታች ወዳለው መለያ ያስተላልፉ",
      step2: "የክፍያ ደረሰኝዎን ቅጽበታዊ ምስል ያንሱ",
      step3: "በሚቀጥለው ደረጃ ደረሰኙን ይላኩ",
      bankDetails: "የባንክ ዝርዝሮች",
      accountNumber: "የመለያ ቁጥር",
      bankName: "የባንክ ስም",
      accountHolder: "የመለያ ባለቤት",
      branch: "ቅርንጫፍ",
      amountToPay: "የሚከፈል መጠን",
      copy: "ቅዳ",
      copied: "ተቀድቷል!",
      important: "አስፈላጊ ማስታወሻዎች",
      note1: "ከላይ የተመለከተውን ትክክለኛ መጠን ያስተላልፉ",
      note2: "በሚቻል መጠን የትዕዛዝ ማጣቀሻዎን በማስተላለፊያ መግለጫ ውስጥ ያካትቱ",
      note3: "ደረሰኝዎን በደህንነት ይያዙ - ለመላክ ያስፈልግዎታል",
      note4: "ክፍያዎ ከተረጋገጠ በኋላ ትዕዛዝዎ ይሰራል",
      continueToUpload: "ደረሰኝ ለመላክ ይቀጥሉ",
    },
  }

  const currentText = text[language]

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
  }

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await UserSettingsService.getSettings();
        setSettingsBankDetails(response.data.payment || {});
      } catch (err) {
        console.error('Failed to fetch bank details:', err);
        setSettingsBankDetails({});
      }
    };
    fetchBankDetails();
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-habesha_blue/20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <AccountBalanceIcon className="text-habesha_blue text-3xl" />
        {currentText.paymentInstructions}
      </h2>

      {/* Steps */}
      <div className="mb-8">
        <div className="space-y-4">
          {[currentText.step1, currentText.step2, currentText.step3].map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-habesha_blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amount to Pay */}
      <div className="mb-8 p-6 bg-habesha_blue/10 rounded-xl border-2 border-habesha_blue/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentText.amountToPay}</h3>
        <div className="text-4xl font-bold text-habesha_blue">
          {language === 'EN' ? '$' : 'ETB '}{formatPrice(total)}
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentText.bankDetails}</h3>
        <div className="space-y-4">
          {[
            { label: currentText.accountNumber, value: settingsBankDetails?.accountNumber || bankDetails.accountNumber, key: "account" },
            { label: currentText.bankName, value: settingsBankDetails?.bankName || bankDetails.bankName, key: "bank" },
            { label: currentText.accountHolder, value: settingsBankDetails?.accountName || bankDetails.accountHolder, key: "holder" },
            { label: currentText.branch, value: settingsBankDetails?.branch || bankDetails.branch, key: "branch" },
          ].map((detail) => (
            <div key={detail.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">{detail.label}</p>
                <p className="font-semibold text-gray-800">{detail.value}</p>
              </div>
              <button
                onClick={() => copyToClipboard(detail.value, detail.key)}
                className="flex items-center gap-2 px-3 py-2 bg-habesha_blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                {copiedField === detail.key ? (
                  <>
                    <CheckCircleIcon className="text-sm" />
                    {currentText.copied}
                  </>
                ) : (
                  <>
                    <ContentCopyIcon className="text-sm" />
                    {currentText.copy}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          {currentText.important}
        </h3>
        <ul className="space-y-2">
          {[currentText.note1, currentText.note2, currentText.note3, currentText.note4].map((note, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-yellow-600 mt-1">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full bg-habesha_blue text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg"
      >
        {currentText.continueToUpload}
      </button>
    </div>
  )
}

export default PaymentInstructions