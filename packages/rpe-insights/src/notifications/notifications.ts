import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const notifications = new Notyf({
  duration: 4000,
  position: {
    x: 'right',
    y: 'bottom',
  },
  dismissible: true,
  ripple: false,
  types: [
    {
      type: 'success',
      icon: false,
      className: 'notification-notyf-success',
      duration: 4000,
    },
  ],
});