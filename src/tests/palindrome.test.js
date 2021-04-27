const palindrome = require('../utils/for_testing').palindrome

describe.skip('palindrome', () => {
  test('of a', () => {
    const result = palindrome('a')

    expect(result).toBe('a')
  })

  test('of sebasdev', () => {
    const result = palindrome('sebasdev')

    expect(result).toBe('vedsabes')
  })

  test('of releveler', () => {
    const result = palindrome('releveler')

    expect(result).toBe('releveler')
  })
})
