import React from "react";
import { useLatestMovie } from "../../requests/requests";

import Carousel from "../Carousel";

const Landing = ({ queryEnabled }) => {
  const movieData = useLatestMovie({});

  const data = movieData?.data;

  return (
    <Carousel
      longSwipesRatio={0.05}
      longSwipesMs={10}
      long
      data={data}
      card={"landing"}
      cardHover={false}
      dark
      noPadding
      effectFade
      crop
    ></Carousel>
  );
};
export default Landing;
