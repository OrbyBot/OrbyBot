import _ from 'lodash';

export function getEntity(state, type) {
  const result = _.find(state, item => item.type === type);
  if (result) {
    return result.entity;
  }
  return undefined;
}
