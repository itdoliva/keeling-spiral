import * as d3 from 'd3';
import { MouseEventHandler, TouchEventHandler } from 'react';

export type YearTick = {
  year: number;
  decade: boolean;
  label: string;
  getRadius: (hoveredYear?: number | null) => number;
};

export type Scale = d3.ScalePoint<number>;

export type PointerEvent = React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent

export type Coordinates = [ number, number ]

