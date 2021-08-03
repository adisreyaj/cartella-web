import { HasWriteAccessPipe } from './has-write-access.pipe';

describe('HasWriteAccessPipe', () => {
  it('create an instance', () => {
    const pipe = new HasWriteAccessPipe();
    expect(pipe).toBeTruthy();
  });
});
