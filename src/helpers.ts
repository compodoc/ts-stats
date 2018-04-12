export const format = (num: number) => num.toLocaleString('en');

export const descOrder = stats => (a, b) => stats[b] - stats[a];
