import React, { } from 'react';
import { useLoaderData } from 'react-router-dom';

import Banner from '../componets/Home/Banner';
import Product from '../componets/Home/Product';

const Home = () => {
  const data = useLoaderData();
  
  return (
    <div>
      <Banner />
      <div className="w-full -mt-10 xl:-mt-36 py-10">
        {data && data.data && Array.isArray(data.data) ? (<Product />) : (<p>Loading products...</p> )}
      </div>
    </div>
  );
};

export default Home;