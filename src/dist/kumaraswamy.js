import Distribution from './_distribution'

/**
 * Generator for the [Kumaraswamy distribution]{@link https://en.wikipedia.org/wiki/Kumaraswamy_distribution} (also
 * known as Minimax distribution):
 *
 * $$f(x; a, b) = a b x^{a-1} (1 - x^a)^{b - 1},$$
 *
 * with \(a, b \in \mathbb{R}^+\). Support: \(x \in (0, 1)\).
 *
 * @class Kumaraswamy
 * @memberOf ran.dist
 * @param {number=} alpha First shape parameter. Default value is 1.
 * @param {number=} beta Second shape parameter. Default value is 1.
 * @constructor
 */
export default class extends Distribution {
  constructor (a = 1, b = 1) {
    super('continuous', arguments.length)
    this.p = { a, b }
    this.s = [{
      value: 0,
      closed: true
    }, {
      value: 1,
      closed: true
    }]
  }

  _generator () {
    // Inverse transform sampling
    return Math.pow(1 - Math.pow(this.r.next(), 1 / this.p.b), 1 / this.p.a)
  }

  _pdf (x) {
    // Handle case a < 1 and x << 1
    let a = Math.pow(x, this.p.a - 1)
    if (!isFinite(a)) {
      return 0
    }

    // Handle case b < 1 and 1 - x << 1
    let b = Math.pow(1 - Math.pow(x, this.p.a), this.p.b - 1)
    if (!isFinite(b)) {
      return 0
    }
    return this.p.a * this.p.b * a * b
  }

  _cdf (x) {
    return 1 - Math.pow(1 - Math.pow(x, this.p.a), this.p.b)
  }
}
