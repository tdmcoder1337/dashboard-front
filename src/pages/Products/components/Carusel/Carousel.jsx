import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



import "./Carousel.css";

const images = [
  "https://picsum.photos/2130/630",
  "https://picsum.photos/2130/630",
  "https://picsum.photos/2130/630",
];

function Carousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation
      className="mySwiper"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img src={img} alt={`Slide ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Carousel;