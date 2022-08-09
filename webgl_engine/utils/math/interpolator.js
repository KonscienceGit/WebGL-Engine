/**
 * All interpolators by default return 0 for a 0 input, and 1 fro a 1 input.
 * Input values outside of [0;1] are not accepted, but no limits checks are done in favor of performances.
 * Interpolation between 0 and 1 varies based on the type of interpolation.
 * When not symetric, the default interpolation rate is fast then slow increase.
 * ie: log/circle interpolation by default is
 *  1^                     .
 * o |           .
 * u |      .
 * t |   .
 * p | .
 * u |.
 * t |.
 *   |.
 *  0-----------------------> 1
 *           input
 *
 * Use the interpolation function parameters to alter the interpolation:
 *   smooth: use linear interpolation between the 2 closest values to produce an output.
 *   reverseRamp: reverse the increase rate, when false, increase ratre is fast then slow. If revesed, it become slow then fast.
 *   inverseInput: reverse the input, input 0 becomes 1 and vice versa, effectively  mirror the curve on vertical axis.
 */
class Interpolator {
    static SIN_ARCCOS = new Float64Array(401);
    static {
        let i = 0;
        const length = this.SIN_ARCCOS.length;
        const div = length - 1;
        for (i = 0; i < length; i++) {
            this.SIN_ARCCOS[i] = Math.sin(Math.acos(i/div - 1));
        }
        this.SIN_ARCCOS[0] = 0; //somehow it's not 0 already
    }

    static circleCurve(input, smooth, reverseRamp, inverseInput) {
        if ((reverseRamp && !inverseInput) || (!reverseRamp && inverseInput)) input = 1 - input;

        const scaledInput = (this.SIN_ARCCOS.length - 1) * input;
        const truncInput = scaledInput | 0;
        let o1 = this.SIN_ARCCOS[truncInput];
        if (smooth && truncInput < this.SIN_ARCCOS.length - 1) {
            const s = scaledInput - truncInput;
            const o2 = this.SIN_ARCCOS[truncInput + 1];
            o1 = o1 * (1 - s) + o2 * s;
        }

        if (reverseRamp) o1 = 1 - o1;
        return o1;
    }

    // TODO benchmarks for LUT
    // static {
    //     const runSize = 10000000
    //     console.log('Interpolating using SIN(ARCCOS(x - 1))');
    //     console.log('LUT size: ' + this.SIN_ARCCOS.length + '  Number of run: ' + runSize);
    //     let str = '';
    //     let x, val, sum = 0;
    //     // WARMUP
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += this.circleCurve(val, false, false, false);
    //     }
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += this.circleCurve(val, true, false, false);
    //     }
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += Math.sin(Math.acos(val - 1));
    //     }
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize - 1;
    //         sum += Math.sqrt(1 - (val * val));
    //     }
    //
    //     // RUN
    //     str +=  ' ' + sum + ' ';
    //     sum = 0;
    //     let start = performance.now();
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += this.circleCurve(val, false, false, false);
    //     }
    //     let time = Math.round(performance.now() - start) + 'ms';
    //     console.log('Fast   LUT   :' + time);
    //
    //     start = performance.now();
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += this.circleCurve(val, true, false, false);
    //     }
    //     time = Math.round(performance.now() - start) + 'ms';
    //     console.log('Smooth LUT   :' + time);
    //
    //     start = performance.now();
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize - 1;
    //         sum += Math.sqrt(1 - (val * val));
    //     }
    //     time = Math.round(performance.now() - start) + 'ms';
    //     console.log('sqrt(1-x²)   :' + time);
    //
    //     start = performance.now();
    //     for (x = 0; x <= runSize; x ++) {
    //         val = x / runSize;
    //         sum += Math.sin(Math.acos(val - 1));
    //     }
    //     time = Math.round(performance.now() - start) + 'ms';
    //     console.log('sin(acos(x)) :' + time);
    //
    //     str +=  ' ' + sum + ' ';
    //     console.log('checksum:' + str);
    // }
}
