/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth:{
        'container': '1440px',
      },
      screens: {
        xs: '320px',
        sm: '375px',
        sm1: '500px',
        md: '667px',
        md1: '768px',
        lg: '960px',
        lg1: '1024px',
        xl: '1280px',
      },
      fontFamily:{
        titleFont:"Roboto",
        bodyFont:"Poppins",
      },
      colors:{
        habesha_blue:"#131921",
        habesha_light:"#232F3E",
        habesha_yellow:"#febd69",
        habesha_white:"#ffffff",
        lightText:"#ccc",
        quantity_box:"#F0F2F2",
        fotterBottom:"#131A22",

        '1D3F93': '#1D3F93',
        'D0D2DB': '#D0D2DB',
        'FFEDED': '#FFEDED',
      },
      boxShadow:{
        textShadow:"0 0 32px 1px rgba(199, 199,199, 1)",
        habeshaInput:"0 0  3px 2px rgba(228, 121 17 / 50%)",
      },
    },
  },
  plugins: [],
}

