import { CountPipe } from './count.pipe';

describe('CountPipe', () => {
  it('create an instance', () => {
    const pipe = new CountPipe();
    expect(pipe).toBeTruthy();
  });
});
