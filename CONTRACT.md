# CONTRACT.md

## 1. Contract Name
BakeTheDipToastTheRiseStaking

---

## 2. Storage Variables

- mapping(address => UserStake) activeStake
- mapping(address => uint256) lifetimeDipRewards
- mapping(address => uint256) lifetimeRiseRewards
- uint256 globalRewardPool
- address admin
- ChainlinkPriceFeedInterface priceFeed
- IERC20 bowwwToken
- bool paused

---

## 3. Structs

### UserStake
- uint256 amount
- uint256 entryPrice
- uint256 startTime
- uint256 duration
- bool withdrawn

---

## 4. Events

- StakeCreated(address user, uint256 amount, uint256 entryPrice, uint256 startTime, uint256 duration)
- WithdrawExecuted(address user, uint256 reward, uint256 dipReward, uint256 riseReward)
- RewardPoolFunded(uint256 amount)
- Paused(bool status)

---

## 5. Functions

### stake(uint256 amount, uint256 duration)
- User approves and stakes $BOWWW.
- Enforces only one active stake per wallet.
- Validates duration between 1 minute and 3 months.
- Records Chainlink price at entry.
- Saves UserStake.
- Emits StakeCreated event.

---

### withdraw()
- Checks stake exists and is not withdrawn.
- Enforces minimum duration (1 minute).
- Enforces maximum duration (3 months).
- Reads Chainlink price at withdraw time.
- Calculates % price change.
- Calculates reward:
  - 50 BOWWW per -1% price drop, capped at 35,000 lifetime dip rewards.
  - 10 BOWWW per +1% price rise, capped at 15,000 lifetime rise rewards.
- Enforces lifetime caps per wallet.
- Enforces global reward pool limit.
- Transfers original stake + reward to user.
- Marks stake as withdrawn.
- Emits WithdrawExecuted event.

---

### adminFundRewards(uint256 amount)
- Admin-only.
- Adds funds to globalRewardPool.
- Emits RewardPoolFunded event.

---

### pause()
- Admin-only.
- Pauses staking.

---

### unpause()
- Admin-only.
- Unpauses staking.

---

## 6. Access Control
- Only admin can fund rewards or pause/unpause the contract.
- Admin set at deployment.

---

## 7. Security Notes
- Non-reentrant withdraw() function.
- Enforces single active stake per wallet.
- Enforces per-wallet lifetime caps.
- Enforces global reward pool cap.
- Validates min/max lock duration.
- Uses Chainlink TWAP oracle to prevent price manipulation.
