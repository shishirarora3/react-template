import { GENERIC_CONSTANT } from '../constants';

export function isClicked(payload) {
  return {
    type: GENERIC_CONSTANT,
    payload: payload
  };
}
