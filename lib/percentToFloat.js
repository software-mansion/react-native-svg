let percentReg = /^(\-?\d+(?:\.\d+)?)(%?)$/;
export default function (percent) {
    let matched = percent.match(percentReg);
    return matched[2] ? matched[1] / 100 : +matched[1];
}
