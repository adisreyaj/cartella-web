import { InjectionToken } from '@angular/core';
import { FeatureType } from '../interfaces/general.interface';

export const FEATURE_TOKEN = new InjectionToken<FeatureType>(
  'Token to specify feature'
);
