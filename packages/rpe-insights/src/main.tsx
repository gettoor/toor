import { render } from 'preact';
import './styles/global.scss';
import './styles/themes.scss';
import './styles/colors.scss';
import './notifications/index.js';
import { App } from './App.js';
import { loadRPEInsights } from './rpe-insights';

const rpeInsights = loadRPEInsights();
render(
  <App rpeInsights={rpeInsights}/>,
  document.getElementById('app')!
);
