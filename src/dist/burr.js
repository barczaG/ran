import Distribution from './_distribution'

/**
 * Generator for the [Burr (XII) distribution]{@link https://en.wikipedia.org/wiki/Burr_distribution} (also known as
 * Singh-Maddala distribution):
 *
 * $$f(x; c, k) = c k \frac{x^{c - 1}}{(1 + x^c)^{k + 1}},$$
 *
 * with \(c, k \in \mathbb{R}^+\). Support: \(x \in \mathbb{R}^+\).
 *
 * @class Burr
 * @memberOf ran.dist
 * @param {number=} c First shape parameter. Default value is 1.
 * @param {number=} k Second shape parameter. Default value is 1.
 * @constructor
 */
export default class extends Distribution {
  constructor (c = 1, k = 1) {
    super('continuous', arguments.length)
    this.p = { c, k }
    this.s = [{
      value: 0,
      closed: false
    }, {
      value: Infinity,
      closed: false
    }]
  }

  _generator () {
    // Inverse transform sampling
    return Math.pow(Math.pow(1 - this.r.next(), -1 / this.p.k) - 1, 1 / this.p.c)
  }

  _pdf (x) {
    return this.p.c * this.p.k * Math.pow(x, this.p.c - 1) / Math.pow(1 + Math.pow(x, this.p.c), this.p.k + 1)
  }

  _cdf (x) {
    return 1 - Math.pow(1 + Math.pow(x, this.p.c), -this.p.k)
  }
}
