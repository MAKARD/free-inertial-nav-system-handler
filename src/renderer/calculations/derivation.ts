export function derivation(dataU: Array<number>, dataT: Array<number>): Array<number> | never {
    if (dataU.length !== dataT.length) {
        throw Error("Arrays must have same length");
    }

    return (new Array(dataU.length))
        .fill(undefined)
        .reduce((collector: Array<number>, x: void, index: number) => {
            const deltaU = dataU[index] - (dataU[index - 1] || 0);
            const deltaT = dataT[index] - (dataT[index - 1] || 0);

            collector.push(deltaU / deltaT);
            return collector;
        }, []);
}
