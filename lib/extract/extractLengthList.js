const spaceReg = /\s+/;
const commaReg = /,/g;

export default function(lengthList) {
    if (typeof lengthList === "string") {
        return lengthList
            .trim()
            .replace(commaReg, " ")
            .split(spaceReg);
    } else if (typeof lengthList === "number") {
        return [`${lengthList}`];
    } else if (lengthList && typeof lengthList.map === "function") {
        return lengthList.map(d => `${d}`);
    } else {
        return [];
    }
}
