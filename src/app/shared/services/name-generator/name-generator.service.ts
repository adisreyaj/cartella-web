import { Injectable } from '@angular/core';
import { DEFAULT_NAME_GENERATOR_CONFIG } from '@app/config/name-generator.config';
import { NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';

@Injectable({
  providedIn: 'root',
})
export class NameGeneratorService {
  constructor() {}

  generate() {
    const numberDictionary = NumberDictionary.generate({
      min: 1000,
      max: 99999,
    });
    DEFAULT_NAME_GENERATOR_CONFIG.dictionaries.push(numberDictionary);
    return uniqueNamesGenerator(DEFAULT_NAME_GENERATOR_CONFIG);
  }
}
