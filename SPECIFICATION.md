# Bake the Dip, Toast the Rise – Specification

## 1. Overview
A staking DApp where users lock $BOWWW for any duration between 1 minute and 3 months. Rewards are granted based on the price change of $BOWWW during the lock period.

## 2. Staking Rules
- One active stake per wallet at a time
- Minimum duration: 1 minute
- Maximum duration: 3 months
- Any stake amount allowed
- User must withdraw before creating a new stake
- Each stake records:
  - Entry price
  - Start time
  - Duration

## 3. Rewards
- Price drop: 50 BOWWW per -1% decline
  - Lifetime cap per wallet: 35,000 BOWWW
- Price rise: 10 BOWWW per +1% increase
  - Lifetime cap per wallet: 15,000 BOWWW
- Total reward potential per wallet: 50,000 BOWWW
- Global reward pool: 500,000,000 BOWWW

## 4. Oracle
- Chainlink price feed (BOWWW/USD)
- TWAP recommended for manipulation resistance

## 5. Contract Functions
- stake(amount, duration)
- withdraw(stakeId)
- adminFundRewards(amount)
- pause/unpause staking

## 6. Security
- Non-reentrant withdraws
- Per-stake and per-wallet caps enforced
- Min/Max lock durations enforced
- Global pool cap enforced

## 7. Frontend Flow
1. Connect wallet
2. Stake $BOWWW
3. View active stakes
4. Withdraw after minimum duration
5. Claim rewards
