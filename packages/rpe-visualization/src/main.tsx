import { render } from 'preact';
import './styles/global.scss';
import './styles/themes.scss';
import { App } from './App.js';
import { loadRPEState } from './rpe-state';

const rpeState = loadRPEState();
render(
  <App rpeState={rpeState}/>,
  document.getElementById('app')!
);
