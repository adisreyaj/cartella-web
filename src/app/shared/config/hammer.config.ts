import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { DIRECTION_ALL } from 'hammerjs';

@Injectable()
export class CartellaHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: DIRECTION_ALL },
    pan: { direction: DIRECTION_ALL },
  };
}
