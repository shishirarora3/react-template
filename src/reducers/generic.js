import { GENERIC_CONSTANT } from '../constants';

export function clicked(state = false, action) {
  const { type, payload } = action;
  switch (type) {
    case GENERIC_CONSTANT:
      return payload;
    default:
      return state;
  }
}

