import Distribution from './_distribution'

/**
 * Generator for the [exponential-logarithmic distribution]{@link https://en.wikipedia.org/wiki/Exponential-logarithmic_distribution#Related_distribution}:
 *
 * $$f(x; p, \beta) = -\frac{1}{\ln p} \frac{\beta (1 - p) e^{-\beta x}}{1 - (1 - p) e^{-\beta x}},$$
 *
 * with \(p \in (0, 1)\) and \(\beta \in \mathbb{R}^+\). Support: \(x \in \mathbb{R}^+ \cup \{0\}\).
 *
 * @class ExponentialLogarithmic
 * @memberOf ran.dist
 * @param {number=} p Shape parameter. Default value is 1.
 * @param {number=} beta Scale parameter. Default value is 1.
 * @constructor
 */
export default class extends Distribution {
  constructor (p = 0.5, beta = 1) {
    super('continuous', arguments.length)
    this.p = { p, beta }
    this.s = [{
      value: 0,
      closed: true
    }, {
      value: Infinity,
      closed: false
    }]
  }

  _generator () {
    // Inverse transform sampling
    return (Math.log(1 - this.p.p) - Math.log(1 - Math.pow(this.p.p, this.r.next()))) / this.p.beta
  }

  _pdf (x) {
    let y = (1 - this.p.p) * Math.exp(-this.p.beta * x)
    return this.p.beta * y / ((y - 1) * Math.log(this.p.p))
  }

  _cdf (x) {
    return 1 - Math.log(1 - (1 - this.p.p) * Math.exp(-this.p.beta * x)) / Math.log(this.p.p)
  }
}
