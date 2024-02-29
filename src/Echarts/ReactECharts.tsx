import React, {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import type { CSSProperties } from 'react';

import { forceResizeCharts } from './UtilsForCharts';

interface IOnEvents {
  type: string;
  func: Function;
}

export interface ReactEChartsProps {
  option: any;
  onEvents?: IOnEvents;
  style?: CSSProperties;
  settings?: echarts.EChartsCoreOption;
  loading?: boolean;
  theme?: 'light' | 'dark';
  forceResize?: boolean;
}

export interface ILegendselectchangedParams {
  name: string;
  selected: Record<string, boolean>;
  type: string;
}


export function ReactECharts({
  option,
  onEvents,
  style,
  settings,
  loading,
  theme,
  forceResize = true,
}: ReactEChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: echarts.ECharts | undefined;

    if (chartRef.current !== null) {
      chart = echarts.init(chartRef.current, theme);
    }

    function resizeChart() {
      chart?.resize();
    }

    window.addEventListener('resize', resizeChart);

    let observer: MutationObserver | false | undefined = false;

    if (forceResize) observer = forceResizeCharts(resizeChart);

    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [theme]);


  const chartSettings = {
    ...settings,
    // tooltip: {
    //   trigger: 'axis',
    //   ...settings,
    // },
  };

  useEffect(() => {
  if (chartRef.current !== null) {
    const chart = echarts.getInstanceByDom(chartRef.current);
    if (chart) {
      chart.setOption({ ...option, ...chartSettings });
      // if (onEvents && onEvents.type === 'mousemove') {
      //   chart.off('mousemove');
      //   chart.on('mousemove', function (params: any) {
      //     if (params && params.data) {
      //       const { name, value } = params.data;
      //       chart.dispatchAction({
      //         type: 'showTip',
      //         seriesIndex: 0,
      //         dataIndex: params.dataIndex,
      //         name: name,
      //         value: value,
      //       });
      //     }
      //   });
      // }
    }
  }
}, [option, settings, onEvents, theme]);



  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);

      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return (
      <div ref={chartRef} style= {{width: "889px", height: "216.16px", marginTop: "68.84px",  ...style}}>
      </div>

  );
}
