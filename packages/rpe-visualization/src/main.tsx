import { render } from 'preact';
import { App } from './App.js';
import './style.css';
import { loadRPEState } from './rpe-state';

render(<App/>, document.getElementById('app')!);
