import SHA256 from 'crypto-js/sha256';
import WordArray from 'crypto-js/lib-typedarrays';

function toBytesInt16BE(num: number): number[] {
    return [(num >> 8) & 0xff, num & 0xff];
}

function toBytesInt32LE(num: number): number[] {
    return [num & 0xff, (num >> 8) & 0xff, (num >> 16) & 0xff, (num >> 24) & 0xff];
}

export function calculate_result(prev_block: number, tx_commit: number, target: number, time_val: number, nonce_val: number): number {
    const prevBlockBytes = toBytesInt16BE(prev_block);
    const txCommitBytes = toBytesInt16BE(tx_commit);
    const timeValBytes = toBytesInt16BE(time_val);
    const targetBytes = toBytesInt16BE(target);
    const nonceBytes = toBytesInt32LE(nonce_val);

    const data = new Uint8Array([
        ...prevBlockBytes,
        ...txCommitBytes,
        ...timeValBytes,
        ...targetBytes,
        ...nonceBytes
    ]);

    const dataWordArray = WordArray.create(data);

    const firstHash = SHA256(dataWordArray);
    const hashWordArray = SHA256(firstHash);

    let result = hashWordArray.words[0];

    result = result >>> 0;

    return result;
}
