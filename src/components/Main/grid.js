import styled from "styled-components";
import { FullLoader, Loader } from "../spinner";

import LandscapeCard from "../Cards/landscapeCard";
import { useInView } from "react-intersection-observer";

const Container = styled.div`
  margin-top: var(--nav-height);
  padding-top: var(--nav-height);
  min-height: 100vh;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px 10px;
  padding: 0 var(--metaData-padding);
  @media only screen and (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 10px;
  }

  @media only screen and (min-width: 740px) {
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px 10px;
  }

  @media only screen and (min-width: 1000px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media only screen and (min-width: 1320px) {
    grid-template-columns: repeat(7, 1fr);
  }
  @media only screen and (min-width: 1500px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

export default function Grid({
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
}) {
  const { ref: inViewRef } = useInView({
    threshold: 0.5,
    onChange: (inview) => {
      if (inview && hasNextPage) {
        console.log("nextpage");
        fetchNextPage();
      }
    },
  });

  console.log(data);

  
  return (
    <Container>
      <GridView>
        {data.map((movie, index) => {
          const loader = index === Math.max(0,data.length-10 ); 
          if(loader)console.log(index)
          return (
            <div
              key={index}
              {...(loader && { ref: inViewRef })}
              style={{ zIndex: 2 }}
            >
              <LandscapeCard
                data={movie}
                card={"potrait"}
                cardExpand={true}
                cardHover={true}
              />
            </div>
          );
        })}
      </GridView>
      {hasNextPage && <Loader key={"loader"} />}
    </Container>
  );
}
