import './style.css'
import { calculate_result } from './hashing';

// ============================================================
// DOM Elements
// ============================================================
const miningStatusDiv = document.getElementById('mining-status')!;
const logOutputDiv = document.getElementById('log-output')!;
const miningTimerDiv = document.getElementById('mining-timer')!;

const prevBlockInput = document.getElementById('prev_block') as HTMLInputElement;
const txCommitInput = document.getElementById('tx_commit') as HTMLInputElement;
const timeValInput = document.getElementById('time_val') as HTMLInputElement;
const targetInput = document.getElementById('target') as HTMLInputElement;
const nonceInput = document.getElementById('nonce') as HTMLInputElement;

const verifyBtn = document.getElementById('verify-btn')!;
const mineBtn = document.getElementById('mine-btn')!;
const stopBtn = document.getElementById('stop-btn')!;

// ============================================================
// Global State
// ============================================================
let miningInterval: number | null = null;
let timerInterval: number | null = null;
let startTime: number = 0;

// ============================================================
// Utility Functions
// ============================================================
function formatBlockhash(hash: number): string {
    return hash.toString().padStart(6, '0');
}

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

// ============================================================
// Input Validation
// ============================================================
function getValidatedInputs(checkNonce: boolean) {
    const values = {
        prev_block: parseInt(prevBlockInput.value.slice(0, 6) || "0", 10),
        tx_commit: parseInt(txCommitInput.value.slice(0, 4) || "0", 10),
        time_val: parseInt(timeValInput.value.slice(0, 4) || "0", 10),
        target: parseInt(targetInput.value.slice(0, 6) || "0", 10),
        nonce: parseInt(nonceInput.value.slice(0, 6) || "0", 10),
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

// ============================================================
// UI Control
// ============================================================
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

// ============================================================
// Timer Functions
// ============================================================
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    miningTimerDiv.textContent = `Time: ${minutes}:${seconds}`;
}

function startTimer() {
    startTime = Date.now();
    miningTimerDiv.style.display = 'block';
    updateTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = window.setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ============================================================
// Audio Functions
// ============================================================
function playSuccessSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ============================================================
// Verify Handler
// ============================================================
function handleVerify() {
    clearScreen();
    logToScreen('Starting verification...');
    const values = getValidatedInputs(true);
    if (!values) return;

    logToScreen(`Parameters: prev=${values.prev_block}, tx=${values.tx_commit}, time=${values.time_val}, target=${values.target}`);
    logToScreen(`Verifying with Nonce: ${values.nonce}`);

    const block_hash = calculate_result(values.prev_block, values.tx_commit, values.target, values.time_val, values.nonce);

    logToScreen(`--------------------------------`, 'normal');
    logToScreen(`Calculated Blockhash: ${formatBlockhash(block_hash)}`, 'success');

    if (block_hash <= values.target) {
        logToScreen(`SUCCESS! Blockhash (${formatBlockhash(block_hash)}) is less than or equal to Target (${values.target}).`, 'success');
    } else {
        logToScreen(`FAILURE! Blockhash (${formatBlockhash(block_hash)}) is greater than Target (${values.target}).`, 'warn');
    }
}

// ============================================================
// Mining Handler
// ============================================================
function handleMine() {
    clearScreen();
    miningTimerDiv.textContent = 'Time: 00:00';

    logToScreen('Starting mining process...');
    const values = getValidatedInputs(false);
    if (!values) return;

    const { prev_block, tx_commit, target, time_val, nonce } = values;

    setMiningUI(true);
    startTimer();

    let nonce_try = isNaN(nonce) ? 0 : nonce;
    let lowest_hash = Infinity;
    let best_nonce = nonce_try;
    const max_tries = 999999;
    const updateIntervalMs = 10;
    let lastStatusUpdateTime = performance.now();

    logToScreen(`Target to beat: ${target}`, 'info');
    if (!isNaN(nonce)) {
        logToScreen(`Starting from nonce: ${nonce}`, 'info');
    }
    logToScreen(`--------------------------------`, 'normal');

    miningInterval = window.setInterval(() => {
        const batchSize = 3;

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
                logToScreen(`New best hash: ${formatBlockhash(lowest_hash)} (Nonce: ${best_nonce})`, 'info');
            }

            if (block_hash <= target) {
                playSuccessSound();
                logToScreen(`--------------------------------`, 'normal');
                logToScreen(`SUCCESS! Found a valid nonce.`, 'success');
                logToScreen(`Winning Nonce: ${nonce_try}`, 'success');
                logToScreen(`Blockhash: ${formatBlockhash(block_hash)}`, 'success');
                stopMining();
                return;
            }
        }

        const currentTime = performance.now();
        if (currentTime - lastStatusUpdateTime > updateIntervalMs) {
            miningStatusDiv.textContent = `Tries: ${nonce_try}\nLowest Hash: ${formatBlockhash(lowest_hash)}\nBest Nonce: ${best_nonce}`;
            lastStatusUpdateTime = currentTime;
        }
    }, 0);
}

function stopMining() {
    if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
        logToScreen('Mining process stopped.', 'info');
    }
    setMiningUI(false);
    stopTimer();
    miningStatusDiv.textContent = '';
}

// ============================================================
// Initialization
// ============================================================
function init() {
    verifyBtn.addEventListener('click', handleVerify);
    mineBtn.addEventListener('click', handleMine);
    stopBtn.addEventListener('click', stopMining);
    clearScreen();
    logToScreen('Simulator ready. Enter parameters and start an action.');
    setMiningUI(false);
}

init();