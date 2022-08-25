import React, {
  forwardRef
} from "react";
import { SwiperSlide as Slide } from "swiper/react";

const Index = ({ styles, index, children }, ref) => {
  return (
    <Slide ref={ref} style={styles} index={index}>
      {children}
    </Slide>
  );
};

const SwiperSlide = forwardRef(Index);

export default SwiperSlide;
