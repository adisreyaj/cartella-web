import { IsOwnerPipe } from './is-owner.pipe';

describe('IsOwnerPipe', () => {
  it('create an instance', () => {
    const pipe = new IsOwnerPipe();
    expect(pipe).toBeTruthy();
  });
});
