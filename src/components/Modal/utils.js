export const MAX_WIDTH = 850;
export const MOBILE_BREAKPOINT = 630;
export const GAP = 10;
export const FADE_SCALE = 0.8;
export const FADE_TRANSLATE = 3000;
export const PADDING_X = 16;
export const PADDING_Y = 36;
export const ASPECT_RATIO = 2 / 3;
export const MARGIN_MOBILE = 25;
export const MARGIN_DESKTOP = 40;

export const getScale = ({ width, height, finalWidth, finalHeight }) => {
  const scaleX = width / finalWidth;
  const scaleY = height / finalHeight;
  const scale = Math.min(scaleX, scaleY);

  return scale;
};

const clamp = (i, min, max) => Math.max(min, Math.min(i, max));

export const getHoverStyles = ({ parentRect }) => {
  const left = window.scrollX + parentRect.left;
  const top = window.scrollY + parentRect.top;

  const width = parentRect.width * 2 - parentRect.width / 2;
  const aspectRatio = parentRect.width / parentRect.height;

  const footerHeight = aspectRatio > 1 ? 100 : 46;
  const titleHeight = aspectRatio > 1 ? 100 : 0;
  const height = width / aspectRatio + titleHeight;

  const w = document.body.clientWidth;

  const translateLeft = left - (width - parentRect.width) / 2;
  const translateXMin = w <= MOBILE_BREAKPOINT ? MARGIN_MOBILE : MARGIN_DESKTOP;
  const translateXMax = w - width - translateXMin;
  const x = clamp(translateLeft, translateXMin, translateXMax) - left;
  const y = (parentRect.height - height) / 2;

  const from = {
    height: parentRect.height,
    width: parentRect.width,
    left,
    top,
    x: 0,
    y: 0,
    scaleY: 1,
    scaleX: 1,
    footerHeight,
  };

  const to = { x, y, height, width, left, top, footerHeight };

  return {
    from,
    to,
  };
};
export const collapseStyles = ({ parentRect, modalRect, currentY }) => {
  const w = document.body.clientWidth;

  const { y: topPadding } = updatedStyles({ width: w });
  const x = parentRect
    ? parentRect.left + parentRect.width / 2 - document.body.clientWidth / 2
    : 0;
  const scale = parentRect ? parentRect.width / modalRect.width : FADE_SCALE;
  const y = parentRect
    ? currentY + parentRect.top - topPadding
    : FADE_TRANSLATE;
  const height = parentRect ? parentRect.height / scale : "auto";
  const aspectRatio = parentRect
    ? parentRect?.width / parentRect?.height
    : null;
  const fromHeight = aspectRatio ? modalRect.width / aspectRatio : null;

  return {
    to: {
      x,
      y,
      scaleX: scale,
      scaleY: scale,
      height,
    },
    from: { height: fromHeight },
  };
};

export const updatedStyles = ({ width }) => {
  const clampedWidth =
    width >= MAX_WIDTH
      ? MAX_WIDTH
      : width <= MOBILE_BREAKPOINT
      ? width
      : width - 2 * PADDING_X;
  const topPadding = clampedWidth < MOBILE_BREAKPOINT ? 0 : PADDING_Y;

  return { width: clampedWidth, y: topPadding };
};
export const getExpandStyles = ({ miniRect, parentRect, scrollHeight }) => {
  const w = document.body.clientWidth;

  const { width: clampedWidth, y: topPadding } = updatedStyles({ width: w });

  if (!miniRect) {
    const from = {
      width: clampedWidth,
      scaleY: FADE_SCALE,
      scaleX: FADE_SCALE,
      x: 0,
      y: 0,
      top: 0,
    };

    const to = {
      width: clampedWidth,
      scaleY: 1,
      scaleX: 1,
      x: 0,
      y: topPadding,
      height: "auto",
    };

    return {
      from,
      to,
    };
  }

  const { width, left, top, height: miniHeight } = miniRect;

  const scale = width / clampedWidth;
  const translateX = left - w / 2 + width / 2;
  const translateY = topPadding - parentRect.top;
  const scaledHeight = scrollHeight * (1 - scale) + scrollHeight;
  const toHeight = Math.max(scaledHeight,2000);
  const from = {
    width: clampedWidth,
    scaleY: scale,
    scaleX: scale,
    top: parentRect.top,
    x: translateX,
    y: top - parentRect.top,
    height: miniHeight / scale,
  };

  const to = {
    width: clampedWidth,
    scaleY: 1,
    scaleX: 1,
    x: 0,
    y: translateY,
    height: toHeight,
  };
  return {
    from,
    to,
  };
};
