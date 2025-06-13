const choice = [
  {
    id: 0,
    title: { EN: "👘 Traditional Clothing", AMH: "👘 ባህላዊ ልብሶች" },
    items: [
      {
        category: { EN: "Women", AMH: "ሴቶች" },
        subItems: [
          { label: { EN: "Women’s Wear", AMH: "የሴቶች ልብስ" }, link: "/" },
          { label: { EN: "Netela", AMH: "ነጠላ" }, link: "/" },
        ],
      },
      {
        category: { EN: "Men", AMH: "ወንዶች" },
        subItems: [
          { label: { EN: "Shamma", AMH: "ሻማ" }, link: "/" },
          { label: { EN: "Kaba", AMH: "ቃባ" }, link: "/" },
        ],
      },
      {
        category: { EN: "Kids", AMH: "ልጆች" },
        subItems: [
          { label: { EN: "Casual", AMH: "ተራ ልብስ" }, link: "/" },
          { label: { EN: "Cultural Wear", AMH: "ባህላዊ ልብስ" }, link: "/" },
        ],
      },
      {
        category: { EN: "Scarves", AMH: "ሻርፎች" },
        subItems: [
          { label: { EN: "Cultural Scarves", AMH: "ባህላዊ ሻርፎች" }, link: "/" },
          { label: { EN: "Shawls (Fota)", AMH: "ሻውሎች (ፎጣ)" }, link: "/" },
        ],
      },
      {
        category: { EN: "Accessories", AMH: "መለዋወጫዎች" },
        subItems: [
          { label: { EN: "Belts", AMH: "ቀበቶዎች" }, link: "/" },
          { label: { EN: "Jewelry", AMH: "ጌጣጌጥ" }, link: "/" },
          { label: { EN: "Sandals", AMH: "ሳንዳሎች" }, link: "/" },
        ],
      },
    ],
  },
  {
    id: 1,
    title: { EN: "🍲 Kitchenware & Pottery", AMH: "🍲 የወጥ ቤት እቃዎች እና ሸክላ" },
    items: [
      { label: { EN: "Jebena (Coffee pots)", AMH: "ጀበና (የቡና ማፍያዎች)" }, link: "/" },
      { label: { EN: "Mitad (Injera stove)", AMH: "ምጣድ (የእንጀራ ምድጃ)" }, link: "/" },
      { label: { EN: "Clay Pots", AMH: "የሸክላ ማሰሮዎች" }, link: "/" },
      { label: { EN: "Mortar & Pestle (Mukecha & Zenezena)", AMH: "ሙክቻ እና ዜንዜና" }, link: "/" },
      { label: { EN: "Sahan (Serving dishes)", AMH: "ሳህን (የማቅረቢያ ዲሽ)" }, link: "/" },
      { label: { EN: "Cultural Utensils", AMH: "ባህላዊ እቃዎች" }, link: "/" },
    ],
  },
  {
    id: 2,
    title: { EN: "🌶️ Spices & Traditional Food", AMH: "🌶️ ቅመሞች እና ባህላዊ ምግቦች" },
    items: [
      { label: { EN: "Berbere", AMH: "በርበሬ" }, link: "/" },
      { label: { EN: "Mitmita", AMH: "ሚጥሚጣ" }, link: "/" },
      { label: { EN: "Shiro Powder", AMH: "ሽሮ ዱቄት" }, link: "/" },
      { label: { EN: "Niter Kibbeh (Spiced butter)", AMH: "ንጥር ቅቤ (ቅመም ቅቤ)" }, link: "/" },
      { label: { EN: "Teff", AMH: "ጤፍ" }, link: "/" },
      { label: { EN: "Korerima (Ethiopian cardamom)", AMH: "ኮረሪማ (የኢትዮጵያ ካርዳሞም)" }, link: "/" },
      { label: { EN: "Traditional Coffee Beans", AMH: "ባህላዊ የቡና ፍሬ" }, link: "/" },
    ],
  },
  {
    id: 3,
    title: { EN: "🧺 Handicrafts & Home Decor", AMH: "🧺 የእጅ ሥራዎች እና የቤት ማስጌጫ" },
    items: [
      { label: { EN: "Mesob (woven baskets)", AMH: "መሶብ (የተሸመኑ ቅርጫቶች)" }, link: "/" },
      { label: { EN: "Hand-carved Stools (Berchuma)", AMH: "በእጅ የተቀረጹ ሰኮናዎች (በርቹማ)" }, link: "/" },
      { label: { EN: "Wall Hangings & Woven Mats", AMH: "የግድግዳ ማስጌጫዎች እና የተሸመኑ ምንጣፎች" }, link: "/" },
      { label: { EN: "Handmade Cushions & Covers", AMH: "በእጅ የተሰሩ ትራስ እና ሽፋኖች" }, link: "/" },
      { label: { EN: "Coffee Ceremony Sets", AMH: "የቡና ሥነ ሥርዓት ስብስቦች" }, link: "/" },
    ],
  },
  {
    id: 4,
    title: { EN: "🎶 Musical Instruments", AMH: "🎶 የሙዚቃ መሣሪያዎች" },
    items: [
      { label: { EN: "Krar (String instrument)", AMH: "ክራር (የአውታር መሣሪያ)" }, link: "/" },
      { label: { EN: "Masinko", AMH: "ማሲንቆ" }, link: "/" },
      { label: { EN: "Kebero (Drum)", AMH: "ከበሮ (ከበሮ)" }, link: "/" },
      { label: { EN: "Washint (Flute)", AMH: "ዋሽንት (ፍሌት)" }, link: "/" },
    ],
  },
  {
    id: 5,
    title: { EN: "Help & Settings", AMH: "እገዛ እና ቅንብሮች" },
    items: [
      { label: { EN: "Your Account", AMH: "መለያህ" }, link: "/" },
      { label: { EN: "Customer Service", AMH: "የደንበኞች አገልግሎት" }, link: "/" },
      { label: { EN: "Sign In", AMH: "ግባ" }, link: "/SignIn" },
    ],
  },
];

export default choice;