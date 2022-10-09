import { forwardRef, useCallback, useMemo, useState } from "react";
import AudioControls from "../AudioControls";
import { Button, Title } from "../CardModal/styles";
import ProgressiveImage from "../ProgressiveImage";

import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import Video from "../CroppedVideo";
import { Youtube } from "../Youtube";
import usePrefetch from "./usePrefetch";

const LandscapeCard = ({ data: current }, ref) => {
  const id = useMemo(() => {
    if (!current) return null;
    const videos = current.videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [current]);

  const src = current?.images?.filePath;

  const original = src ? `https://image.tmdb.org/t/p/original/${src}` : null;
  const preview = src ? `https://image.tmdb.org/t/p/w300/${src}` : null;

  let [searchParams, setSearchParams] = useSearchParams();

  const [{ activated, expand }, dispatch] = useModalState();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";
  const { ref: prefetchRef, handlePrefetch } = usePrefetch({
    id: current?.id,
    whileInView: !desktop,
    enabled: current?.id && !desktop,
  });

  const handleClick = useCallback(() => {
    dispatch({
      type: "set modal",
      ...(!activated && { scroll: window.scrollY }),
    });
    setSearchParams({ mv: current.id });
  }, [activated, current?.id, dispatch, setSearchParams]);

  const {
    ref: elRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.95,
    rootMargin: "100px 0px 100px 0px",
  });

  const refcb = useCallback(
    (node) => {
      elRef(node);

      if (typeof ref === "function") {
        ref(node);
        return;
      }
      if (ref && ref.current) {
        ref.current = node;
      }
    },
    [elRef, ref]
  );

  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);

  const play = activated || expand;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "6px",
        overflow: "hidden",
      }}
      ref={prefetchRef}
    >
      <div
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "19/10",
          maxHeight: "min(800px,100vh))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          position: "relative",
        }}
        ref={refcb}
      >
        <ProgressiveImage
          style={{ borderRadius: "6px", zIndex: 1 }}
          original={original}
          preview={preview}
          alt={`${current?.title}`}
        />
        {id && (
          <div
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: "19/10",
              maxHeight: "800px",
              zIndex: 2,
              position: "absolute",
              backgroundColor: "transparent",
            }}
          >
            <Video show={show} crop={false}>
              <Youtube
                id={id}
                play={!play}
                light={false}
                audio={audio}
                cb={showCb}
                visible={inView}
              />
            </Video>
          </div>
        )}

        {show && (
          <Button
            style={{ bottom: 0, top: "auto", zIndex: 10 }}
            onClick={handleAudio}
          >
            <AudioControls audio={audio} />
          </Button>
        )}
        <button
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 3,
          }}
          onClick={handleClick}
        />
      </div>
      <Title>{current?.title}</Title>
    </div>
  );
};

export default forwardRef(LandscapeCard);
