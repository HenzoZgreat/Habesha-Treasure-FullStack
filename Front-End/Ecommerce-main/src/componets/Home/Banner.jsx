import React, { useState } from 'react';
import Slider from "react-slick";
import bannerImgOne from '../../assets/images/bannerImgOne.jpeg';
import bannerImgTwo from '../../assets/images/bannerImgTwo.jpeg';
import bannerImgThree from '../../assets/images/bannerImgThree.jpeg';
import bannerImgFour from '../../assets/images/baneerImgFour.jpeg';
import bannerImgFive from '../../assets/images/bannerImgfive.jpeg';
import bannerImgSix from '../../assets/images/bannerImgSix.jpeg';

const Banner = () => {
  const [dotActive, setDotActive] = useState(0);
  
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => {
      setDotActive(next);
    },
    appendDots: dots => (
      <div
        style={{
          position: "absolute",
          top: '70%',
          left: "0",
          right: "0",
          margin: "0 auto",
          transform: "translate(-50%, -50%)",
          width: '210px'
        }}
      >
        <ul style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={
          i === dotActive
            ? {
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: '#131921',
                padding: '8px 0',
                cursor: 'pointer',
                border: '1px solid #f3a847',
              }
            : {
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#232F3E',
                padding: '8px 0',
                cursor: 'pointer',
                border: '1px solid #f3a847',
                color: 'white',
              }
        }
      >
        {i + 1}
      </div>
    ),
    responsive: [
      {
        breakpoint: 576,
        settings: {
          dots: true,
          appendDots: (dots) => (
            <div
              style={{
                position: "absolute",
                top: '70%',
                left: "45%",
                transform: "translate(-50%, -50%)",
                width: '210px'
              }}
            >
              <ul style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}> {dots} </ul>
            </div>
          ),
          customPaging: (i) => (
            <div
              style={i === dotActive
                ? {
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    background: '#131921',
                    padding: '8px 0',
                    cursor: 'pointer',
                    border: '1px solid #f3a847',
                    fontSize: '12px',
                  }
                : {
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#232F3E',
                    color: 'white',
                    padding: '8px 0',
                    cursor: 'pointer',
                    border: '1px solid white',
                    fontSize: '14px',
                  }
              }
            >
              {i + 1}
            </div>
          ),
        },
      },
    ],
  };

  return (
    <div className='w-full'>
      <div className='w-full h-full relative'>
        <Slider {...settings}>
          {/* First slide with three images side by side */}
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <img src={bannerImgOne} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgTwo} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgThree} alt="" style={{ width: '33%', height: 'auto' }} />
            </div>
            
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <img src={bannerImgFour} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgFive} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgSix} alt="" style={{ width: '33%', height: 'auto' }} />
            </div>
            
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <img src={bannerImgThree} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgSix} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgFour} alt="" style={{ width: '33%', height: 'auto' }} />
            </div>
            
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <img src={bannerImgThree} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgTwo} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgSix} alt="" style={{ width: '33%', height: 'auto' }} />
            </div>
            
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <img src={bannerImgFive} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgOne} alt="" style={{ width: '33%', height: 'auto' }} />
              <img src={bannerImgFour} alt="" style={{ width: '33%', height: 'auto' }} />
            </div>
            
          </div>

        </Slider>
      </div>
    </div>
  );
};

export default Banner;