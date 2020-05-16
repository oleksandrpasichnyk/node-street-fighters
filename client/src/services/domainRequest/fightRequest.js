import { post } from '../requestHelper';

const entity = 'fights';

export const createFight = async (body) => {
  return await post(entity, body);
};
