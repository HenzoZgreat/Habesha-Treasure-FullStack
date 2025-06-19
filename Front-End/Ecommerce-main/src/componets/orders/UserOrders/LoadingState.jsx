const LoadingState = ({ language }) => {
  const text = {
    EN: {
      loading: "Loading your orders...",
    },
    AMH: {
      loading: "ትዕዛዞችዎን በመጫን ላይ...",
    },
  }

  const currentText = text[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-habesha_blue mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-habesha_blue to-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="bg-gradient-to-r from-habesha_blue to-blue-400 bg-clip-text text-transparent font-semibold text-xl">
          {currentText.loading}
        </p>
      </div>
    </div>
  )
}

export default LoadingState
