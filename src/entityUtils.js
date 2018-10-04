import _ from 'lodash';

export function getEntity(state, type) {
  const result = _.find(state, item => item.type === type);
  if (result) {
    return result.entity;
  }
  return undefined;
}

export function updateState(state, value, type) {
  const entityObject = _.find(state, item => item.type === type);
  if (entityObject === undefined) {
    state.push({ type, entity: value });
  } else {
    entityObject.entity = value;
  }

  return state;
}
