import Distribution from './_distribution'

/**
 * Generator for the [bounded Pareto distribution]{@link https://en.wikipedia.org/wiki/Pareto_distribution#Bounded_Pareto_distribution}:
 *
 * $$f(x; L, H, \alpha) = \frac{\alpha L^\alpha x^{-\alpha - 1}}{1 - \big(\frac{L}{H}\big)^\alpha},$$
 *
 * with \(L, H \in \mathbb{R}^+\), \(H > L\) and \(\alpha \in \mathbb{R}^+\). Support: \(x \in [L, H]\).
 *
 * @class BoundedPareto
 * @memberOf ran.dist
 * @param {number=} L Lower boundary. Default value is 1.
 * @param {number=} H Upper boundary. Default value is 10.
 * @param {number=} alpha Shape parameter. Default value is 1.
 * @constructor
 */
export default class extends Distribution {
  constructor (L = 1, H = 10, alpha = 1) {
    super('continuous', arguments.length)
    this.p = { L, H, alpha }
    this.s = [{
      value: L,
      closed: true
    }, {
      value: H,
      closed: true
    }]
    this.c = [Math.pow(L, alpha), Math.pow(H, alpha), (1 - Math.pow(L / H, alpha))]
  }

  _generator () {
    // Inverse transform sampling
    return Math.pow((this.c[1] + this.r.next() * (this.c[0] - this.c[1])) / (this.c[0] * this.c[1]), -1 / this.p.alpha)
  }

  _pdf (x) {
    return this.p.alpha * Math.pow(this.p.L / x, this.p.alpha) / (x * this.c[2])
  }

  _cdf (x) {
    return (1 - this.c[0] * Math.pow(x, -this.p.alpha)) / (1 - this.c[0] / this.c[1])
  }
}
