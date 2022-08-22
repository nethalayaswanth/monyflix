import styled, { css } from "styled-components";
import {RiInformationLine} from 'react-icons/ri'
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;
  padding: 0 25px 20px;
  text-align: left;
  z-index: 8;
  color: white;

  position: absolute;
  align-items: center;
  height: calc(100% - 102px);
  padding-left: 40px;
  padding-right: 40px;
`;

const Details = styled.div`
  text-align: left;
  position: relative;
  max-width: 370px;
`;

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 7px 0;
  word-wrap: break-word;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.34;
  opacity: 0.7;
`;

const ButtonText = styled.div`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.34;
`;
const Title = styled(Text)`
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.34;
  color: rgba(255, 255, 255, 1);
  white-space: normal;
  opacity: 1;
  letter-spacing: 0;
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
`;

const Button = styled.div`
  display: flex;
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
  margin-left:20px;
  padding:4px;
  padding-left: 10px;
  padding-right: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }
`;


const Description = ({ movie, genre }) => {

  let [searchParams, setSearchParams] = useSearchParams();
  const handleClick = useCallback(() => {
    setSearchParams({ mv: movie?.id });
    

    
  }, [movie, setSearchParams]);
  
  return (
    <Container>
      <Details>
        <Text>{genre.toUpperCase()}</Text>
        <Title>{movie.title}</Title>

        <Flex>
          <Text>{movie.adult ? "U/A 13+" : "U/A 18+"}</Text>
          <Button onClick={handleClick}>
            <RiInformationLine style={{height:'18px',width:'18px',marginRight:'8px'}}/>
            <ButtonText>More Info</ButtonText>
          </Button>
        </Flex>
      </Details>
    </Container>
  );
};

export default Description;
