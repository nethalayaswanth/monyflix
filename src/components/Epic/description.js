import { useCallback } from "react";
import { RiInformationLine } from 'react-icons/ri';
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails, getVideosById } from "../../requests/requests";

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;
  text-align: left;
  z-index: 8;
  color: white;

  align-items: center;
  height: calc(100% - 102px);
  padding: 0 25px;

  @media only screen and (min-width: 740px) {
    padding: 10vh 40px;
  }

  padding-bottom: 10vh;
`;

const Details = styled.div`
  text-align: left;
  position: relative;
  max-width: 370px;
  background-color:transparent;
`;

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 7px 0;
  word-wrap: break-word;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2.4rem;
  opacity: 0.7;
`;

const ButtonText = styled.div`
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 2rem;
  @media only screen and (min-width: 740px) {
    font-size: 1.6rem;
    font-weight: bold;
    line-height: 2.4rem;
  }
`;
const Title = styled(Text)`
  font-size: 1.6rem;
  font-weight: bold;
  line-height: 2.4rem;
  color: rgba(255, 255, 255, 1);
  white-space: normal;
  opacity: 1;
  letter-spacing: 0;
  @media only screen and (min-width: 740px) {
    font-size: 2.4rem;
    font-weight: 600;
    line-height: 1.34;
  }
`;

const Overview = styled(Text)`
  font-size: 17px;
  line-height: 1.29412;
  font-weight: 400;
  letter-spacing: 0;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  max-height: 44px;
  display: -webkit-box;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  @media only screen and (min-width: 740px) {
   margin-top:1.8rem
  }
`;

const Button = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #000;
  background-color: white;
  user-select: none;
  will-change: background-color, color;
  appearance: none;
  border: 0px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
  padding: 0.6rem;
  padding-left: 1.6rem;
  padding-right: 1.8rem;
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media only screen and (min-width: 740px) {
    padding: 0.8rem;
    padding-left: 2rem;
    padding-right: 2.4rem;
  }
`;


const Description = ({ movie, genre }) => {

  let [searchParams, setSearchParams] = useSearchParams();
  
  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    await queryClient.prefetchQuery(["movie", movie?.id], async () =>
      getMovieDetails({ id: movie?.id })
    );
    await queryClient.prefetchQuery(["videos", movie?.id, types], async () =>
      getVideosById({ id: movie?.id, types })
    );
  }, [movie, queryClient]);

  const handleClick = useCallback(() => {
    handlePrefetch()
    setSearchParams({ mv: movie?.id });
  }, [handlePrefetch, movie?.id, setSearchParams]);
  
  return (
    
      <Details>
        <Text>{genre?.toUpperCase()}</Text>
        <Title>{movie?.title}</Title>

        <Flex>
          <Text>{movie?.adult ? "U/A 13+" : "U/A 18+"}</Text>
          <Button onClick={handleClick}>
            <RiInformationLine style={{height:'18px',width:'18px',marginRight:'8px'}}/>
            <ButtonText>More Info</ButtonText>
          </Button>
        </Flex>
      </Details>
    
  );
};

export default Description;
