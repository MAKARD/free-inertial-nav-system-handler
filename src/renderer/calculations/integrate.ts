export function integrate(dataU: Array<number>): Array<number> {
    return dataU.reduce((collector: Array<number>, dataUItem: number) => {
        collector.push(dataUItem + collector[collector.length - 1]);
        return collector;
    }, [0]);
}
