const BN = web3.utils.BN
const Exchange = artifacts.require("FakeExchange")
const WBTC = artifacts.require("FakeWBTC")
const HEGIC = artifacts.require("FakeHEGIC")
const PriceProvider = artifacts.require("FakePriceProvider")
const BTCPriceProvider = artifacts.require("FakeBTCPriceProvider")
const ETHOptions = artifacts.require("BrokenETHOptions")
const WBTCOptions = artifacts.require("HegicWBTCOptions")
const ETHPool = artifacts.require("HegicETHPool")
const ERCPool = artifacts.require("HegicERCPool")
const StakingETH = artifacts.require("HegicStakingETH")
const StakingWBTC = artifacts.require("HegicStakingWBTC")
const ETHRewards = artifacts.require("HegicETHRewards")
const WBTCRewards = artifacts.require("HegicWBTCRewards")
const ETHStakingRewards = artifacts.require("ETHStakingRewards")
const WBTCStakingRewards = artifacts.require("WBTCStakingRewards")
const BC = artifacts.require("LinearBondingCurve")

const CONTRACTS_FILE = process.env.CONTRACTS_FILE

const params = {
  ETHPrice: new BN(380e8),
  BTCPrice: new BN("1161000000000"),
  ETHtoBTC() {
    return this.ETHPrice.mul(new BN("10000000000000000000000000000000")).div(
      this.BTCPrice
    )
  },
  ExchangePrice: new BN(30e8),
  BC: {
    k: new BN("100830342800"),
    startPrice: new BN("350000000000000"),
  },
}

module.exports = async function (deployer, network, [account]) {
  if (["development", "develop", "soliditycoverage"].indexOf(network) >= 0) {
    const w = await deployer.deploy(WBTC)
    const h = await deployer.deploy(HEGIC)
    await deployer.deploy(ETHPool)
    await deployer.deploy(BC, HEGIC.address, params.BC.k, params.BC.startPrice)
    await deployer.deploy(Exchange, WBTC.address, params.ETHtoBTC())
    await deployer.deploy(PriceProvider, params.ETHPrice)
    await deployer.deploy(BTCPriceProvider, params.BTCPrice)

    await deployer.deploy(StakingWBTC, HEGIC.address, WBTC.address)
    await deployer.deploy(StakingETH, HEGIC.address)

    await deployer.deploy(ETHOptions, PriceProvider.address, StakingETH.address, ETHPool.address)
    await deployer.deploy(
      WBTCOptions,
      BTCPriceProvider.address,
      Exchange.address,
      WBTC.address,
      StakingWBTC.address
    )
    const ETHPoolAddress = await ETHOptions.deployed().then((x) => x.pool())
    const WBTCPoolAddress = await WBTCOptions.deployed().then((x) => x.pool())
    const er = await deployer.deploy(
      ETHRewards,
      ETHOptions.address,
      HEGIC.address
    )
    const wr = await deployer.deploy(
      WBTCRewards,
      WBTCOptions.address,
      HEGIC.address
    )
    const esr = await deployer.deploy(
      ETHStakingRewards,
      account,
      account,
      HEGIC.address,
      ETHPoolAddress
    )
    const wsr = await deployer.deploy(
      WBTCStakingRewards,
      account,
      account,
      HEGIC.address,
      WBTCPoolAddress
    )

    await h.mintTo(BC.address, "753001000000000000000000000")
    await h.mintTo(ETHRewards.address, "100000000000000000000000000")
    await h.mintTo(WBTCRewards.address, "100000000000000000000000000")
    await h.mintTo(
      ETHStakingRewards.address,
      "10000000000000000000000000000000"
    )
    await h.mintTo(
      WBTCStakingRewards.address,
      "10000000000000000000000000000000"
    )
    await esr.notifyRewardAmount("4620000000000000000000000")
    await wsr.notifyRewardAmount("4620000000000000000000000")
    await er.setRewardsRate(26229508196)
    await wr.setRewardsRate("8213552361396304000000")
    if (CONTRACTS_FILE) {
      const fs = require("fs")
      console.log("> Contracts writing: " + CONTRACTS_FILE)
      fs.writeFileSync(
        CONTRACTS_FILE,
        JSON.stringify({
          WBTC: {
            address: WBTC.address,
            abi: WBTC.abi,
          },
          ETHPriceProvider: {
            address: PriceProvider.address,
            abi: PriceProvider.abi,
          },
          BTCPriceProvider: {
            address: BTCPriceProvider.address,
            abi: BTCPriceProvider.abi,
          },
          WBTC: {
            address: WBTC.address,
            abi: WBTC.abi,
          },
          HEGIC: {
            address: HEGIC.address,
            abi: HEGIC.abi,
          },
          ETHOptions: {
            address: ETHOptions.address,
            abi: ETHOptions.abi,
          },
          WBTCOptions: {
            address: WBTCOptions.address,
            abi: WBTCOptions.abi,
          },
          ETHPool: {
            address: await ETHOptions.deployed().then((x) => x.pool()),
            abi: await ETHPool.abi,
          },
          WBTCPool: {
            address: await WBTCOptions.deployed().then((x) => x.pool()),
            abi: await ERCPool.abi,
          },
          ETHStaking: {
            address: StakingETH.address,
            abi: StakingETH.abi,
          },
          WBTCStaking: {
            address: StakingWBTC.address,
            abi: StakingWBTC.abi,
          },
          ETHRewards: {
            address: ETHRewards.address,
            abi: ETHRewards.abi,
          },
          WBTCRewards: {
            address: WBTCRewards.address,
            abi: WBTCRewards.abi,
          },
          BC: {
            address: BC.address,
            abi: BC.abi,
          },
          ETHStakingRewards: {
            address: ETHStakingRewards.address,
            abi: ETHStakingRewards.abi,
          },
          WBTCStakingRewards: {
            address: WBTCStakingRewards.address,
            abi: WBTCStakingRewards.abi,
          },
        })
      )
    }
  } else {
    throw Error(`wrong network ${network}`)
  }
}
