import RIPEMD160 from 'crypto-js/ripemd160';
import WordArray from 'crypto-js/lib-typedarrays';

function toBytesInt16BE(num: number): number[] {
    return [(num >> 8) & 0xff, num & 0xff];
}

function toBytesInt32LE(num: number): number[] {
    return [num & 0xff, (num >> 8) & 0xff, (num >> 16) & 0xff, (num >> 24) & 0xff];
}

export function calculate_result(prev_block: number, tx_commit: number, target: number, time_val: number, nonce_val: number): number {
    const prefix = "BTC-LARP:".split('').map(c => c.charCodeAt(0));
    const prevBlockBytes = toBytesInt16BE(prev_block);
    const txCommitBytes = toBytesInt16BE(tx_commit);
    const timeValBytes = toBytesInt16BE(time_val);
    const targetBytes = toBytesInt16BE(target);
    const nonceBytes = toBytesInt32LE(nonce_val);

    const data = new Uint8Array([
        ...prefix,
        ...prevBlockBytes,
        ...txCommitBytes,
        ...timeValBytes,
        ...targetBytes,
        ...nonceBytes
    ]);

    const dataWordArray = WordArray.create(data);
    const hashWordArray = RIPEMD160(dataWordArray);

    let result = 0;
    let accum = 1;

    for (let i = 0; i < 5; i++) {
        const byteIndex = i;
        const wordIndex = Math.floor(byteIndex / 4);
        const byteInWord = 3 - (byteIndex % 4);
        const word = hashWordArray.words[wordIndex];
        const hr = (word >> (byteInWord * 8)) & 0xff;

        const term = Math.imul(accum, hr);
        result = (result + term) >>> 0;
        accum = Math.imul(accum, 255);
    }

    return result;
}
