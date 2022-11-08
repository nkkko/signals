import { getContext, root, setContext, scope, onError, getParent } from '../src';

it('should scope function to current scope', () => {
  let callback!: () => void;

  root(() => {
    const fn = () => expect(getContext('id')).toBe(10);
    callback = scope(fn);
    setContext('id', 10);
  });

  callback();
});

it('should scope function to given scope', () => {
  let callback!: () => void;

  let $root;
  root(() => {
    setContext('id', 10);
    $root = getParent();
  });

  const fn = () => expect(getContext('id')).toBe(10);
  callback = scope(fn, $root);

  callback();
});

it('should return value', () => {
  let callback!: () => void;

  root(() => {
    callback = scope(() => 10);
  });

  expect(callback()).toBe(10);
});

it('should handle errors', () => {
  let callback!: () => void;

  const error = new Error();
  const handler = vi.fn();

  root(() => {
    callback = scope(() => {
      throw error;
    });

    onError(handler);
  });

  callback();
  expect(handler).toHaveBeenCalledWith(error);
});