// app.js

let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0x3e77f8Ef29fd4943D2fddf543EaBB5773F7112bB"; // your verified contract
const BOWWW_TOKEN_ADDRESS = "0x284414b6777872E6DD8982394Fed1779dc87a3Cf"; // your BOWWW token

// Paste your ABI here from Polygonscan verification page
const CONTRACT_ABI = [
  // Example snippet — replace with FULL ABI you get from Polygonscan!
  {
    "inputs": [
      { "internalType": "address", "name": "_bowwwToken", "type": "address" },
      { "internalType": "address", "name": "_priceFeed", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Add all other functions from verified ABI!
];

document.getElementById('connect-btn').addEventListener('click', connectWallet);
document.getElementById('stake-btn').addEventListener('click', stakeTokens);
document.getElementById('withdraw-btn').addEventListener('click', withdrawStake);

async function connectWallet() {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return;
  }

  try {
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const address = await signer.getAddress();
    document.getElementById('wallet-status').innerText = `Connected: ${address}`;
    document.getElementById('stake-section').classList.remove('hidden');
    document.getElementById('rewards-summary').classList.remove('hidden');
    document.getElementById('global-pool').classList.remove('hidden');

    loadUserData();
  } catch (err) {
    console.error(err);
    document.getElementById('status-message').innerText = "Connection failed.";
  }
}

async function stakeTokens() {
  const amount = document.getElementById('stake-amount').value;
  const duration = document.getElementById('stake-duration').value * 60;

  if (!amount || !duration) {
    document.getElementById('status-message').innerText = "Please enter amount and duration.";
    return;
  }

  try {
    document.getElementById('status-message').innerText = "Sending transaction...";
    const tx = await contract.stake(ethers.utils.parseUnits(amount, 18), duration);
    await tx.wait();
    document.getElementById('status-message').innerText = "Stake successful!";
    loadUserData();
  } catch (err) {
    console.error(err);
    document.getElementById('status-message').innerText = "Stake failed.";
  }
}

async function withdrawStake() {
  try {
    document.getElementById('status-message').innerText = "Sending withdraw transaction...";
    const tx = await contract.withdraw();
    await tx.wait();
    document.getElementById('status-message').innerText = "Withdraw successful!";
    loadUserData();
  } catch (err) {
    console.error(err);
    document.getElementById('status-message').innerText = "Withdraw failed.";
  }
}

async function loadUserData() {
  if (!contract) return;

  try {
    const user = await signer.getAddress();
    const [active, dip, rise, pool] = await Promise.all([
      contract.activeStake(user),
      contract.lifetimeDipRewards(user),
      contract.lifetimeRiseRewards(user),
      contract.globalRewardPool()
    ]);

    if (active.amount.gt(0) && !active.withdrawn) {
      document.getElementById('active-stake-section').classList.remove('hidden');
      document.getElementById('active-details').innerText = `
Amount: ${ethers.utils.formatUnits(active.amount, 18)} BOWWW
Entry Price: ${active.entryPrice}
Start Time: ${new Date(active.startTime * 1000).toLocaleString()}
Duration: ${Math.floor(active.duration / 60)} minutes
`;
      const now = Math.floor(Date.now() / 1000);
      document.getElementById('withdraw-btn').disabled = now < active.startTime + active.duration;
    } else {
      document.getElementById('active-stake-section').classList.add('hidden');
    }

    document.getElementById('dip-reward').innerText = `Dip Rewards Claimed: ${ethers.utils.formatUnits(dip, 18)} / 35,000 BOWWW`;
    document.getElementById('rise-reward').innerText = `Rise Rewards Claimed: ${ethers.utils.formatUnits(rise, 18)} / 15,000 BOWWW`;
    document.getElementById('pool-balance').innerText = `${ethers.utils.formatUnits(pool, 18)} BOWWW`;
  } catch (err) {
    console.error(err);
    document.getElementById('status-message').innerText = "Error loading data.";
  }
}
