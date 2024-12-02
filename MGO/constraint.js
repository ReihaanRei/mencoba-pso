export function maxProfit(x, y) {
    const profitA = 50000;
    const profitB = 30000;
    const waktuA = 1;
    const waktuB = 0.5;
    const penjahitA = 3;
    const penjahitB = 2;
    const maxWaktu = 12;
    const maxPenjahit = 50;

    const totalWaktu = x * waktuA + y * waktuB;
    const totalPenjahit = x * penjahitA + y * penjahitB;
    const totalProfit = x * profitA + y * profitB;

    return (totalWaktu <= maxWaktu && totalPenjahit <= maxPenjahit) ? totalProfit : 0;
}