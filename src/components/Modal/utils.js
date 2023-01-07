export const getScale = ({ width, height, finalWidth, finalHeight }) => {
  const scaleX = width / finalWidth;
  const scaleY = height / finalHeight;
  const scale = Math.min(scaleX, scaleY);

  return scale;
};

const clamp = (i, min, max) => Math.max(min, Math.min(i, max));

export const getStyles = ({ parent}) => {
  const { height, width, top, left, right } = parent;
  const l = window.scrollX + left;
  const t = window.scrollY + top;
  const scroll = window.scrollY + window.innerHeight;
  const scrollTopPadding = window.scrollY + 20;

  const boxwidth = width * 2 - width / 2;
  const boxHeight = (boxwidth * 149.82) / 100;

  const w = document.body.clientWidth;

  const scaleLeft = l - (boxwidth - width) / 2;
  const leftMin = w <= 630 ? 25 : 40;
  const LeftMax = document.body.clientWidth - boxwidth - leftMin;
  const finalLeft = clamp(scaleLeft, leftMin, LeftMax);
  const translateLeft = finalLeft - l;

  const scaleTop = t - (boxHeight - height) / 2;

  const translateTop = scaleTop - t;

  return {
    fromHeight: height,
    fromWidth: width,
    toWidth: boxwidth,
    toHeight: boxHeight,
    fromTop: t,
    fromLeft: l,
    X: translateLeft,
    Y: translateTop,
  };
};

export const collapseStyles = ({ parent,expandWidth}) => {
const { height, width, top, left, right } = parent;
  const collapseX = left - document.body.clientWidth / 2 ;
};

export const getExpandStyles = ({
  miniWidth,
  miniHeight,
  miniLeft,
  miniRight,
  miniTop,
}) => {
  const w = document.body.clientWidth;
  const lastWidth = w >= 850 ? 850 : w<=630?w: w-2*16;
  const lastHeight = 850;
  const scale=miniWidth/lastWidth
  const translateX = miniLeft - document.body.clientWidth / 2 + miniWidth / 2;
 
  const translateY = 36 - miniTop;

  return {
    height: lastHeight,
    width: lastWidth,
    scaleY: scale,
    scaleX: scale,
    x: translateX,
    y: translateY,
  };
};


