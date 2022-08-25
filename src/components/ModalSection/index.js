import React from "react";

import styled from "styled-components";

import ModalCarousel from "../Carousel/modalCarousel";
import Divider from "../Divider";
import Header from "../Header";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;
`;

export default function ModalSection({
  title,
  data,
  loading,
  hasMore,
  isFetching,
  fetchMore,
  children,
}) {
  return (
    <Container>
      <Header title={title} />
      <ModalCarousel
        data={data}
        loading={loading}
        hasMore={hasMore}
        isFetching={isFetching}
        fetchMore={fetchMore}
        type={title}
        children={children}
      />
      <Divider />
    </Container>
  );
}
