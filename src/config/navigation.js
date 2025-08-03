import React from 'react';

const homeIcon = React.createElement(
  'svg',
  {
    className: 'w-5 h-5 mb-1',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
  },
  React.createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' }),
  React.createElement('path', { d: 'M9 22V12h6v10' })
);

const createIcon = React.createElement(
  'svg',
  {
    className: 'w-5 h-5 mb-1',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
  },
  React.createElement('path', { d: 'M12 5v14' }),
  React.createElement('path', { d: 'M5 12h14' })
);

const workoutsIcon = React.createElement(
  'svg',
  {
    className: 'w-5 h-5 mb-1',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
  },
  React.createElement('circle', { cx: '5', cy: '12', r: '2' }),
  React.createElement('circle', { cx: '19', cy: '12', r: '2' }),
  React.createElement('rect', { x: '7', y: '11', width: '10', height: '2' })
);

const logsIcon = React.createElement(
  'svg',
  {
    className: 'w-5 h-5 mb-1',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
  },
  React.createElement('path', { d: 'M3 3v18h18' }),
  React.createElement('path', { d: 'M18 17V9' }),
  React.createElement('path', { d: 'M13 17V5' }),
  React.createElement('path', { d: 'M8 17v-3' })
);

export const navigationItems = [
  { path: '/', label: 'Home', icon: homeIcon },
  { path: '/create', label: 'Create', icon: createIcon },
  { path: '/workouts', label: 'Workouts', icon: workoutsIcon },
  { path: '/logs', label: 'Logs', icon: logsIcon },
];

export default navigationItems;
