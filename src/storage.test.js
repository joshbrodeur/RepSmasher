import { describe, it, expect, beforeEach } from 'vitest';
import { load, save, createId } from './storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('storage utilities', () => {
  it('loads default when key is missing', () => {
    const result = load('missing', 'default');
    expect(result).toBe('default');
  });

  it('saves and loads data', () => {
    const data = { a: 1 };
    save('key', data);
    expect(load('key', null)).toEqual(data);
  });

  it('returns default when stored JSON is invalid', () => {
    localStorage.setItem('bad', '{');
    expect(load('bad', 'fallback')).toBe('fallback');
  });

  it('returns default when storage throws', () => {
    const original = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('failed');
    };
    expect(load('any', 'fallback')).toBe('fallback');
    localStorage.getItem = original;
  });

  it('save surfaces JSON errors', () => {
    const obj = {};
    obj.self = obj;
    expect(() => save('x', obj)).toThrow();
  });

  it('createId generates unique strings', () => {
    const id1 = createId();
    const id2 = createId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});
