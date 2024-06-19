import React, { useEffect } from 'react';
import { View } from 'react-native';

const RenderTimer = ({ screenName,children,}) => {
  useEffect(() => {
    const startTime = performance.now();

    // Measure the render time
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(` ${screenName} Render time: ${renderTime.toFixed(2)} ms`);
    });
  }, []);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default RenderTimer;
