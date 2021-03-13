import { multiply } from './multiply.js'

export function product(...numbers) {
  return numbers.reduce(multiply)
}
