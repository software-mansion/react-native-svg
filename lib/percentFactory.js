import percentToFloat from './percentToFloat';
let percentReg = /%/;

export default function (...args) {
    let hasPercent = percentReg.test(args.join(''));
    if (hasPercent) {
        return args.map(arg => {
            return function (base) {
                return percentReg.test(arg) ? percentToFloat(arg) * base : +arg;
            };
        });
    }
}
