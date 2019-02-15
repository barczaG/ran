import { lambertW } from '../special'
import Distribution from './_distribution'

/**
 * Generator for the [Benktander type II distribution]{@link https://en.wikipedia.org/wiki/Benktander_type_II_distribution}:
 *
 * $$f(x; \alpha, \beta, \sigma) = \bigg(\frac{\alpha}{x} + \frac{2 \beta \ln \frac{x}{\sigma}}{x}\bigg) e^{-\alpha \ln \frac{x}{\sigma} - \beta \ln^2 \frac{x}{\sigma}},$$
 *
 * with \(a \in \mathbb{R}^+\) and \(b \in (0, 1]\). Support: \(x \in [1, \infty)\).
 *
 * @class BenktanderII
 * @memberOf ran.dist
 * @param {number=} a Scale parameter. Default value is 1.
 * @param {number=} b Shape parameter. Default value is 0.5.
 * @constructor
 */
export default class extends Distribution {
  // In case of 1 - b << 1, we use an approximation of the distribution:
  // - We simplify terms with b
  // - W(x) is replaced by ln(x) - ln[ln(x)]

  // TODO Handle b = 1 case separately
  constructor (a = 1, b = 0.5) {
    super('continuous', arguments.length)
    this.p = { a, b }
    this.s = [{
      value: 1,
      closed: true
    }, {
      value: null,
      closed: false
    }]
    this.c = [
      (1 - this.p.b) / this.p.a,
      Math.exp(-a / b),
      b / (b - 1)
    ]
    this.eps = 1 - b
    this.EPS_THRES = 0.01
  }

  _generator () {
    // Inverse transform sampling
    let u = Math.random()

    if (this.p.b === 1) {
      // b = 1
      return 1 - Math.log(u) / this.p.a
    } else if (this.eps <= this.EPS_THRES) {
      // 1 - b << 1
      let a = this.p.a
      let t = Math.log(a / this.eps) - Math.log(u) / this.eps + a / this.eps + 1
      return this.eps * (t - Math.log(t)) / a
    } else {
      // Otherwise
      return Math.pow(this.c[0] * lambertW(Math.pow(u * this.c[1], this.c[2]) / this.c[0]), 1 / this.p.b)
    }
  }

  _pdf (x) {
    if (this.p.b === 1) {
      // b = 1
      return this.p.a * Math.exp(this.p.a * (1 - x))
    } else if (this.eps <= this.EPS_THRES) {
      // 1 - b << 1
      let a = this.p.a
      return Math.pow(x, -this.eps) * Math.exp(a * (1 - x)) * (this.eps / x + a)
    } else {
      // Otherwise
      let y = Math.pow(x, this.p.b)
      return Math.exp(this.p.a * (1 - y) / this.p.b) * Math.pow(x, this.p.b - 2) * (this.p.a * y - this.p.b + 1)
    }
  }

  _cdf (x) {
    if (this.p.b === 1) {
      // b = 1
      return 1 - Math.exp(this.p.a * (1 - x))
    } else if (this.eps <= this.EPS_THRES) {
      // 1 - b << 1
      return 1 - Math.pow(x, -this.eps) * Math.exp(this.p.a * (1 - x))
    } else {
      // Otherwise
      return 1 - Math.pow(x, this.p.b - 1) * Math.exp(this.p.a * (1 - Math.pow(x, this.p.b)) / this.p.b)
    }
  }
}
