import { adjectives, animals, colors } from 'unique-names-generator';

export const DEFAULT_NAME_GENERATOR_CONFIG = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
};
