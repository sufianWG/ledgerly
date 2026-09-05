"use client"

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import SlideBanner1 from "./HeroBanners/SlideBanner1";
import SlideBanner2 from "./HeroBanners/SlideBanner2";
import SlideBanner3 from "./HeroBanners/SlideBanner3";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSlider = () => {
    return (
        <Swiper className="hero-slider" modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        }} autoHeight observer observeParents>
            <SwiperSlide>
                <SlideBanner1></SlideBanner1>
            </SwiperSlide>
            <SwiperSlide>
                <SlideBanner2></SlideBanner2>
            </SwiperSlide>
            <SwiperSlide>
                <SlideBanner3></SlideBanner3>
            </SwiperSlide>
        </Swiper>
    );
};

export default HeroSlider;
