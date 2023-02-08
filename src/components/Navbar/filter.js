import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { genreIds, movieTypes, sortingTypes } from "../../requests/requests";
import ToolTip from "../toolTip";

const text = css`
  font-size: 15px;
  line-height: 1.41667;
`;

export const textTruncate = css`
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
`;

const Select = styled.div`
  position: relative;
  text-align: left;

  &:hover .label {
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    outline: none;
  }

  & div.label {
    appearance: none;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 3px;
    box-sizing: border-box;
    color: white;
    display: inline-block;
    font-size: 15px;
    font-weight: 500;

    letter-spacing: 1px;
    padding-left: 10px;
    padding-right: 30px;
    position: relative;
    ${text}
    ${textTruncate}
  }
`;

export const ToolButtonWrapper = styled.div`
  flex-basis: auto;
  flex-grow: 0;

  margin: 0 10px 0 0;

  @media only screen and (min-width: 740px) {
    margin: 0 30px;
  }
  &:first-child {
    margin-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }
`;

export const Arrow = styled.div`
  border-color: rgba(255, 255, 255, 0.7) transparent transparent;
  border-style: solid;
  border-width: 5px 5px 0;
  height: 0;
  position: absolute;
  right: 10px;
  top: 44%;
  width: 0;
`;

const Header = styled.div`
  min-height: var(--nav-height);
  padding: 0 var(--metaData-padding);
  align-items: center;
  display: flex;
  justify-content: center;
  ${text}

  & > div {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  @media only screen and (min-width: 740px) {
    justify-content: flex-start;

    & > div {
      justify-content: flex-start;
      width: auto;
    }
  }
`;

export const Menu = styled.div`
  ${text};
  display: flex;
  flex-direction: column;

  & button {
    padding: 10px;
    text-align: left;
  }

  & button:disabled {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const Scroller = styled.div`
  &::-webkit-scrollbar {
    width: 3px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: grey;
    border-radius: 3px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
`;

export const Genres = styled(Scroller)`
  max-width: 260px;
  width: 100%;
  height: 100%;
  padding: 10px;
  flex-direction: column;

  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 10px;
    margin-top: 10px;
  }
  .reset {
    display: flex;
    justify-content: flex-end;
    color: #007aff;
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
    ${text};
  }
`;

export const GenreItem = styled.button`
  ${text};
  padding: 6px;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  cursor: pointer;

  ${({ selected }) =>
    selected
      ? css`
          background-color: #007aff;
          color: white;
          border: none;
        `
      : css`
          background-color: transparent;
          color: black;
        `}
`;

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genresParam = searchParams.get("genres");
  const typeParam = searchParams.get("type") ?? "Popular";
  const sortByParam = searchParams.get("sort_by") ?? "Popularity";
  const genres = genresParam ? genresParam.split(",") : [];
  const [genresSelected, selectGenre] = useState(new Set(genres));
  const [type, selectType] = useState(typeParam);
  const [sortBy, selectSortType] = useState(sortByParam);

  const handleSelect = ({ type, id }) => {
    switch (type) {
      case "genre": {
        let genres;
        if (genresSelected.has(id)) {
          genresSelected.delete(id);
          genres = new Set([...genresSelected]);
          selectGenre(genres);
          if (genres.size < 1) {
            searchParams.delete("genres");
            setSearchParams(searchParams);
          } else {
            searchParams.set("genres", [...genres]);
            setSearchParams(searchParams);
          }
        } else {
          genres = new Set([...genresSelected, id]);
          selectGenre(genres);
          searchParams.set("genres", [...genres]);
          setSearchParams(searchParams);
        }
        break;
      }
      case "movieType": {
        selectType(id);
        searchParams.set("type", id);
        setSearchParams(searchParams);
        break;
      }
      case "sort": {
        selectSortType(id);
        searchParams.set("sortBy", id);
        setSearchParams(searchParams);
        break;
      }

      default: {
      }
    }
  };

  const handleReset = () => {
    searchParams.delete("genres");
    setSearchParams(searchParams);
    selectGenre(new Set());
  };

  return (
    <Header>
      <div>
        <ToolButtonWrapper>
          <ToolTip
            style={{}}
            button={
              <Select>
                <div className="label">
                  {type}
                  <Arrow />
                </div>
              </Select>
            }
          >
            <Menu>
              {Object.keys(movieTypes).map((movieType, index) => {
                const selected = movieType === type;
                return (
                  <button
                    key={movieType}
                    disabled={selected}
                    onClick={() =>
                      handleSelect({ type: "movieType", id: movieType })
                    }
                  >
                    {movieType}
                  </button>
                );
              })}
            </Menu>
          </ToolTip>
        </ToolButtonWrapper>
        <ToolButtonWrapper>
          <ToolTip
            style={{
              backgroundColor: "white",
            }}
            button={
              <Select>
                <div className="label">
                  Genres
                  <Arrow />
                </div>
              </Select>
            }
          >
            <Genres>
              <div className="reset">
                <p onClick={handleReset}>Reset</p>
              </div>
              <div className="grid">
                {Object.keys(genreIds).map((genre) => {
                  const selected = genresSelected.has(genre);

                  return (
                    <GenreItem
                      selected={selected}
                      key={genre}
                      onClick={() => handleSelect({ type: "genre", id: genre })}
                    >
                      {genre}
                    </GenreItem>
                  );
                })}
              </div>
            </Genres>
          </ToolTip>
        </ToolButtonWrapper>
        <ToolButtonWrapper>
          <ToolTip
            style={{}}
            button={
              <Select>
                <div className="label">
                  {sortBy}
                  <Arrow />
                </div>
              </Select>
            }
          >
            <Menu>
              {Object.keys(sortingTypes).map((sortType, index) => {
                const selected = sortType === sortBy;
                return (
                  <button
                    disabled={selected}
                    key={sortType}
                    onClick={() => handleSelect({ type: "sort", id: sortType })}
                  >
                    {sortType}
                  </button>
                );
              })}
            </Menu>
          </ToolTip>
        </ToolButtonWrapper>
      </div>
    </Header>
  );
}
