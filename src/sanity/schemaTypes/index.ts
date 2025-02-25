import { type SchemaTypeDefinition } from 'sanity';

import { workType } from './workType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [workType],
};
