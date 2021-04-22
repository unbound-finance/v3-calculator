import { sma } from 'moving-averages'
import { add, sub, mul } from 'math-array'
// import standardDeviation from 'ml-array-standard-deviation'
import stdv from 's-deviation'

export function bbands(data, size = 20, times = 2) {
  const avg = sma(data, size)
  const sd = stdv(data, times)

  const timesSd = mul(sd, times)

  console.log({ data, avg, sd, timesSd })

  return {
    min: Math.min.apply(null, sub(avg, timesSd).slice(1)),
    max: Math.max.apply(null, add(avg, timesSd).slice(1)),
  }
}

export function minmax(data) {
  return {
    min: Math.min.apply(null, data),
    max: Math.max.apply(null, data),
  }
}
