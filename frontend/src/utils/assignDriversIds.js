import { v4 as uuidv4 } from 'uuid';

export const assignDriversIds = (drivers) => {
  return drivers.map((driver) => ({
    ...driver,
    id: uuidv4(),
  }));
};
