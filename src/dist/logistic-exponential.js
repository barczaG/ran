import Distribution from './_distribution'

/**
 * Generator for the [logistic-exponential distribution]{@link http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.295.8653&rep=rep1&type=pdf}:
 *
 * $$f(x; \lambda, \kappa) = \frac{\lambda \kappa (e^{\lambda x} - 1)^{\kappa - 1} e^{\lambda x}}{[1 + (e^{\lambda x} - 1)^\kappa]^2},$$
 *
 * where \(\lambda, \kappa \in \mathbb{R}^+\). Support: \(x \in \mathbb{R}^+\).
 *
 * @class LogisticExponential
 * @memberOf ran.dist
 * @param {number=} lambda Scale parameter. Default value is 1.
 * @param {number=} kappa Shape parameter. Default value is 1.
 * @constructor
 */
export default class extends Distribution {
  constructor (lambda = 1, kappa = 1) {
    super('continuous', arguments.length)
    this.p = { lambda, kappa }
    this.s = [{
      value: 0,
      closed: kappa >= 1
    }, {
      value: Infinity,
      closed: false
    }]
  }

  _generator () {
    let u = this.r.next()
    let z = Math.pow(u / (1 - u), 1 / this.p.kappa)

    // Handle z << 1 cases
    return 1 + z === 1
      ? z / this.p.lambda
      : Math.log(1 + z) / this.p.lambda
  }

  _pdf (x) {
    let y = Math.exp(this.p.lambda * x)
    return isFinite(Math.pow(y, 2 * this.p.kappa)) ? this.p.lambda * this.p.kappa * Math.pow(y - 1, this.p.kappa - 1) * y / Math.pow(1 + Math.pow(y - 1, this.p.kappa), 2) : 0
  }

  _cdf (x) {
    // Calculate 1 - S for robustness
    return 1 - 1 / (1 + Math.pow(Math.exp(this.p.lambda * x) - 1, this.p.kappa))
  }
}
