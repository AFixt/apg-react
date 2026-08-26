import React from 'react';
import { findTypeaheadMatch, isTypeaheadKey, nodeText } from '../components/_internal/typeahead';

/**
 * Unit coverage for the shared type-ahead matcher (#155).
 *
 * The per-component suites prove the behaviour is wired up; this proves the
 * matching rules themselves, including the cases that are awkward to drive
 * through a component -- repeat-cycling and prefix search differ only in where
 * the search starts, and getting that wrong makes one of them unreachable
 * rather than merely wrong.
 */
const labels = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];

describe('isTypeaheadKey', () => {
  test('accepts a printable character', () => {
    expect(isTypeaheadKey({ key: 'a' })).toBe(true);
  });

  test('rejects named keys', () => {
    expect(isTypeaheadKey({ key: 'ArrowDown' })).toBe(false);
    expect(isTypeaheadKey({ key: 'Enter' })).toBe(false);
    expect(isTypeaheadKey({ key: 'Escape' })).toBe(false);
  });

  test('rejects Space, which these patterns bind to selection', () => {
    expect(isTypeaheadKey({ key: ' ' })).toBe(false);
  });

  test('rejects modified keys, so Ctrl+A still selects all', () => {
    expect(isTypeaheadKey({ key: 'a', ctrlKey: true })).toBe(false);
    expect(isTypeaheadKey({ key: 'a', metaKey: true })).toBe(false);
    expect(isTypeaheadKey({ key: 'a', altKey: true })).toBe(false);
  });
});

describe('findTypeaheadMatch', () => {
  test('moves to the next item starting with the character', () => {
    expect(findTypeaheadMatch(labels, 'b', 0)).toBe(2);
  });

  test('searches from after the current item', () => {
    // From "Apple", "a" must reach "Apricot" rather than staying put.
    expect(findTypeaheadMatch(labels, 'a', 0)).toBe(1);
  });

  test('wraps to the start', () => {
    expect(findTypeaheadMatch(labels, 'a', 4)).toBe(0);
  });

  test('is case insensitive in both directions', () => {
    expect(findTypeaheadMatch(labels, 'B', 0)).toBe(2);
    expect(findTypeaheadMatch(['apple', 'BANANA'], 'b', 0)).toBe(1);
  });

  test('a repeated character cycles through the matches', () => {
    expect(findTypeaheadMatch(labels, 'b', 1)).toBe(2);
    expect(findTypeaheadMatch(labels, 'bb', 2)).toBe(3);
    expect(findTypeaheadMatch(labels, 'bbb', 3)).toBe(2);
  });

  test('several different characters match a prefix', () => {
    expect(findTypeaheadMatch(labels, 'ap', 4)).toBe(0);
    expect(findTypeaheadMatch(labels, 'apr', 4)).toBe(1);
  });

  test('a prefix search can match the item already focused', () => {
    // "a" has already moved focus onto Apricot; typing "p" then "r" must be
    // able to resolve to Apricot itself rather than skipping past it.
    expect(findTypeaheadMatch(labels, 'apr', 1)).toBe(1);
  });

  test('returns -1 when nothing matches', () => {
    expect(findTypeaheadMatch(labels, 'z', 0)).toBe(-1);
    expect(findTypeaheadMatch(labels, 'apz', 0)).toBe(-1);
  });

  test('handles an empty list and an empty query', () => {
    expect(findTypeaheadMatch([], 'a', 0)).toBe(-1);
    expect(findTypeaheadMatch(labels, '', 0)).toBe(-1);
  });

  test('tolerates a negative starting index', () => {
    expect(findTypeaheadMatch(labels, 'c', -1)).toBe(4);
  });
});

describe('nodeText', () => {
  test('passes strings and numbers through', () => {
    expect(nodeText('File')).toBe('File');
    expect(nodeText(42)).toBe('42');
  });

  test('flattens elements and arrays', () => {
    expect(nodeText(<span>File</span>)).toBe('File');
    expect(nodeText([<span key="a">Fi</span>, 'le'])).toBe('File');
  });

  test('yields an empty string for nodes with no text', () => {
    expect(nodeText(null)).toBe('');
    expect(nodeText(undefined)).toBe('');
    expect(nodeText(false)).toBe('');
    expect(nodeText(<img alt="" />)).toBe('');
  });
});
