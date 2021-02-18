import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortCount',
})
export class CountPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    if (isNaN(value)) {
      return null;
    } // will only work value is a number
    if (value === null) {
      return null;
    }
    if (value === 0) {
      return null;
    }
    let abs = Math.abs(value);
    const rounder = Math.pow(10, 1);
    const isNegative = value < 0; // will also work for Negative numbers
    let key = '';
    if (value < 1000) {
      return Math.round(value);
    }

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 },
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + ' ' + key;
  }
}
