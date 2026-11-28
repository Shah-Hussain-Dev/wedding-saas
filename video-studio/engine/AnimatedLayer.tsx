import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { AnimationType } from '../types';

interface AnimatedLayerProps {
  animation: AnimationType;
  durationFrames: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function AnimatedLayer({
  animation,
  durationFrames = 30,
  children,
  style = {},
}: AnimatedLayerProps) {
  const frame = useCurrentFrame();

  if (animation === 'none') {
    return <div style={style}>{children}</div>;
  }

  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const animatedStyle: React.CSSProperties = { ...style };

  switch (animation) {
    case 'fadeIn':
      animatedStyle.opacity = progress;
      break;
    case 'slideUp':
      animatedStyle.opacity = progress;
      animatedStyle.translate = `0px ${interpolate(progress, [0, 1], [40, 0])}px`;
      break;
    case 'slideDown':
      animatedStyle.opacity = progress;
      animatedStyle.translate = `0px ${interpolate(progress, [0, 1], [-40, 0])}px`;
      break;
    case 'slideLeft':
      animatedStyle.opacity = progress;
      animatedStyle.translate = `${interpolate(progress, [0, 1], [50, 0])}px 0px`;
      break;
    case 'slideRight':
      animatedStyle.opacity = progress;
      animatedStyle.translate = `${interpolate(progress, [0, 1], [-50, 0])}px 0px`;
      break;
    case 'zoomIn':
      animatedStyle.opacity = progress;
      animatedStyle.scale = `${interpolate(progress, [0, 1], [0.8, 1])}`;
      break;
    case 'zoomOut':
      animatedStyle.opacity = progress;
      animatedStyle.scale = `${interpolate(progress, [0, 1], [1.2, 1])}`;
      break;
    case 'goldShimmer':
      animatedStyle.opacity = interpolate(frame % 45, [0, 22, 45], [0.8, 1, 0.8]);
      animatedStyle.scale = `${interpolate(progress, [0, 1], [0.95, 1])}`;
      break;
    case 'bounce':
      animatedStyle.opacity = progress;
      animatedStyle.scale = `${interpolate(frame, [0, durationFrames * 0.6, durationFrames], [0.5, 1.08, 1], {
        extrapolateRight: 'clamp',
      })}`;
      break;
  }

  return <div style={animatedStyle}>{children}</div>;
}
