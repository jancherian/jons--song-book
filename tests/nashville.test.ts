import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyKeypadInput, convertNashvilleToLetter } from '../src/utils/nashville.ts';

test('keypad preserves accidentals entered before a degree', () => {
  assert.equal(['b', '7'].reduce(applyKeypadInput, ''), 'b7');
  assert.equal(['#', '4'].reduce(applyKeypadInput, ''), '#4');
});

test('keypad preserves the chord when entering an accidental bass note', () => {
  const chord = ['5', '/', 'b', '3'].reduce(applyKeypadInput, '');
  assert.equal(chord, '5/b3');
  assert.equal(convertNashvilleToLetter(chord, 'C'), 'G/Eb');
  assert.equal(['1', '/', '#', '4'].reduce(applyKeypadInput, ''), '1/#4');
  assert.equal(['1', '/', '3'].reduce(applyKeypadInput, ''), '1/3');
});

