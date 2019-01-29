import Gamma from './gamma'

/**
 * Generator for the [Maxwell-Boltzmann distribution]{@link https://en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution}:
 *
 * $$f(x; a) = \sqrt{\frac{2}{\pi}}\frac{x^2 e^{-x^2 / (2a^2)}}{a^3},$$
 *
 * with \(a \in \mathbb{R}^+\). Support: \(x \in \mathbb{R}^+\).
 *
 * @class MaxwellBoltzmann
 * @memberOf ran.dist
 * @param {number=} a Scale parameter. Default value is 1.
 * @constructor
 */
export default class extends Gamma {
  constructor (a = 1) {
    super(1.5, 2 * a * a)
  }
}
