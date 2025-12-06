import './style.css'
import { calculate_result } from './hashing';

const miningStatusDiv = document.getElementById('mining-status')!;
const logOutputDiv = document.getElementById('log-output')!;

const prevBlockInput = document.getElementById('prev_block') as HTMLInputElement;
const txCommitInput = document.getElementById('tx_commit') as HTMLInputElement;
const timeValInput = document.getElementById('time_val') as HTMLInputElement;
const targetInput = document.getElementById('target') as HTMLInputElement;
const nonceInput = document.getElementById('nonce') as HTMLInputElement;

const verifyBtn = document.getElementById('verify-btn')!;
const mineBtn = document.getElementById('mine-btn')!;
const stopBtn = document.getElementById('stop-btn')!;

let miningInterval: number | null = null;

function logToScreen(message: string, type: 'info' | 'success' | 'error' | 'warn' | 'normal' = 'normal') {
    const p = document.createElement('p');
    if (type !== 'normal') {
        p.className = `log-${type}`;
    }
    p.textContent = message;
    logOutputDiv.appendChild(p);
    logOutputDiv.scrollTop = logOutputDiv.scrollHeight;
}

function clearScreen() {
    logOutputDiv.innerHTML = '';
    miningStatusDiv.innerHTML = '';
}

function setMiningUI(isMining: boolean) {
    if (isMining) {
        verifyBtn.style.display = 'none';
        mineBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        prevBlockInput.disabled = true;
        txCommitInput.disabled = true;
        timeValInput.disabled = true;
        targetInput.disabled = true;
        nonceInput.disabled = true;
    } else {
        verifyBtn.style.display = 'inline-block';
        mineBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        prevBlockInput.disabled = false;
        txCommitInput.disabled = false;
        timeValInput.disabled = false;
        targetInput.disabled = false;
        nonceInput.disabled = false;
    }
}

function getValidatedInputs(checkNonce: boolean) {
    const values = {
        prev_block: parseInt(prevBlockInput.value, 10),
        tx_commit: parseInt(txCommitInput.value, 10),
        time_val: parseInt(timeValInput.value, 10),
        target: parseInt(targetInput.value, 10),
        nonce: parseInt(nonceInput.value, 10),
    };

    if (isNaN(values.prev_block) || isNaN(values.tx_commit) || isNaN(values.time_val) || isNaN(values.target)) {
        logToScreen('Error: Please fill all parameter fields.', 'error');
        return null;
    }

    if (checkNonce && isNaN(values.nonce)) {
        logToScreen('Error: Please enter a nonce to verify.', 'error');
        return null;
    }

    return values;
}

function handleVerify() {
    clearScreen();
    logToScreen('Starting verification...');
    const values = getValidatedInputs(true);
    if (!values) return;

    logToScreen(`Parameters: prev=${values.prev_block}, tx=${values.tx_commit}, time=${values.time_val}, target=${values.target}`);
    logToScreen(`Verifying with Nonce: ${values.nonce}`);

    const block_hash = calculate_result(values.prev_block, values.tx_commit, values.target, values.time_val, values.nonce);

    logToScreen(`--------------------------------`, 'normal');
    logToScreen(`Calculated Blockhash: ${block_hash}`, 'success');

    if (block_hash <= values.target) {
        logToScreen(`SUCCESS! Blockhash (${block_hash}) is less than or equal to Target (${values.target}).`, 'success');
    } else {
        logToScreen(`FAILURE! Blockhash (${block_hash}) is greater than Target (${values.target}).`, 'warn');
    }
}

function handleMine() {
    clearScreen();
    logToScreen('Starting mining process...');
    const values = getValidatedInputs(false);
    if (!values) return;

    const { prev_block, tx_commit, target, time_val } = values;

    setMiningUI(true);

    let nonce_try = 0;
    let lowest_hash = Infinity;
    let best_nonce = 0;
    const max_tries = 1000000;
    const updateIntervalMs = 2;
    let lastStatusUpdateTime = performance.now();

    logToScreen(`Target to beat: ${target}`, 'info');
    logToScreen(`--------------------------------`, 'normal');

    miningInterval = window.setInterval(() => {
        const batchSize = 21;
        for (let i = 0; i < batchSize; i++) {
            nonce_try++;

            if (nonce_try >= max_tries) {
                logToScreen(`Stopped: Reached max tries (${max_tries}).`, 'warn');
                stopMining();
                return;
            }

            const block_hash = calculate_result(prev_block, tx_commit, target, time_val, nonce_try);

            if (block_hash < lowest_hash) {
                lowest_hash = block_hash;
                best_nonce = nonce_try;
                logToScreen(`New best hash: ${lowest_hash} (Nonce: ${best_nonce})`, 'info');
            }

            if (block_hash <= target) {
                logToScreen(`--------------------------------`, 'normal');
                logToScreen(`SUCCESS! Found a valid nonce.`, 'success');
                logToScreen(`Winning Nonce: ${nonce_try}`, 'success');
                logToScreen(`Blockhash: ${block_hash}`, 'success');
                stopMining();
                return;
            }
        }

        const currentTime = performance.now();
        if (currentTime - lastStatusUpdateTime > updateIntervalMs) {
            miningStatusDiv.textContent = `Tries: ${nonce_try}\nLowest Hash: ${lowest_hash}\nBest Nonce: ${best_nonce}`;
            lastStatusUpdateTime = currentTime;
        }

    }, 0);
}

function stopMining() {
    if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
        logToScreen('Mining process stopped by user.', 'info');
    }
    setMiningUI(false);
    miningStatusDiv.textContent = '';
}

function init() {
    verifyBtn.addEventListener('click', handleVerify);
    mineBtn.addEventListener('click', handleMine);
    stopBtn.addEventListener('click', stopMining);
    clearScreen();
    logToScreen('Simulator ready. Enter parameters and start an action.');
    setMiningUI(false);
}

init();