const add  = require('../add.js');

describe('add', () => {
  // Test Case 1: Normal positive numbers
  test('should return 5 for add(2, 3)', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Test Case 2: Positive and negative numbers
  test('should return 1 for add(5, -4)', () => {
    expect(add(5, -4)).toBe(1);
  });

  // Test Case 3: Zero
  test('should return 7 for add(7, 0)', () => {
    expect(add(7, 0)).toBe(7);
  });

  // Test Case 4: Large numbers (boundary)
  test('should handle large numbers correctly, e.g., 1000000 + 2000000', () => {
    expect(add(1000000, 2000000)).toBe(3000000);
  });

  // Test Case 5: Negative numbers
  test('should return -5 for add(-2, -3)', () => {
    expect(add(-2, -3)).toBe(-5);
  });
});
