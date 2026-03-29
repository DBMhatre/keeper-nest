// server/EventService.js
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export const EVENTS = {
  SESSION_EXPIRED: 'SESSION_EXPIRED'
};

export default eventEmitter;