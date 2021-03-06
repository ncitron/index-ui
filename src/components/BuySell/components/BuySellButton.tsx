import React, { ReactElement } from 'react'

import { RoundedButton } from 'components/RoundedButton'
import useBuySell from 'hooks/useBuySell'
import useWallet from 'hooks/useWallet'
import useApproval from 'hooks/useApproval'
import {
  daiTokenAddress,
  usdcTokenAddress,
  dpiTokenAddress,
  indexTokenAddress,
  uniswapRouterAddress,
} from 'constants/ethContractAddresses'

const transakSDK = require('@transak/transak-sdk').default

/**
 * BuySellButton - Displays a button used in the buy sell flow.
 * The button can be used to:
 * 1. Prompt user login to complete a transaction
 * 2. Prompt the user to approve input currency to Uniswap Router
 * 3. Execute the trade transaction
 */
const BuySellButton: React.FC = () => {
  const {
    buySellToken,
    isFetchingOrderData,
    isUserBuying,
    currencyQuantity,
    tokenQuantity,
    uniswapData,
    selectedCurrency,
    onExecuteBuySell,
  } = useBuySell()

  const { account, onOpenWalletModal } = useWallet()
  const daiApproval = useApproval(daiTokenAddress, uniswapRouterAddress)
  const usdcApproval = useApproval(usdcTokenAddress, uniswapRouterAddress)
  const dpiApproval = useApproval(dpiTokenAddress, uniswapRouterAddress)
  const indexApproval = useApproval(indexTokenAddress, uniswapRouterAddress)

  // Only prompt the user at end of the buy flow. (So they can preview the order before logging in)
  const loginRequiredBeforeSubmit = uniswapData?.amount_in && !account

  const dpiApprovalRequired =
    !isUserBuying &&
    buySellToken.toLowerCase() === 'dpi' &&
    !dpiApproval.isApproved
  const dpiApproving =
    !isUserBuying &&
    buySellToken.toLowerCase() === 'dpi' &&
    dpiApproval.isApproving

  const indexApprovalRequired =
    !isUserBuying &&
    buySellToken.toLowerCase() === 'index' &&
    !indexApproval.isApproved
  const indexApproving =
    !isUserBuying &&
    buySellToken.toLowerCase() === 'index' &&
    indexApproval.isApproving

  const daiApprovalRequired =
    isUserBuying && selectedCurrency?.id === 'mcd' && !daiApproval.isApproved
  const daiApproving =
    isUserBuying && selectedCurrency?.id === 'mcd' && daiApproval.isApproving

  const usdcApprovalRequired =
    isUserBuying && selectedCurrency?.id === 'usdc' && !usdcApproval.isApproved
  const usdcApproving =
    isUserBuying && selectedCurrency?.id === 'usdc' && usdcApproval.isApproving

  const transakLauncher = () => {
    let transak = new transakSDK({
      apiKey: process.env.REACT_APP_TRANSAK_API_KEY,
      environment: 'STAGING', // STAGING/PRODUCTION
      defaultCryptoCurrency: buySellToken,
      walletAddress: '',
      themeColor: '0063ed',
      fiatCurrency: '',
      email: '',
      redirectURL: '',
      hostURL: window.location.origin,
      widgetHeight: '550px',
      widgetWidth: '450px',
    })

    transak.init()
  }

  let buttonText: string
  let buttonAction: (...args: any[]) => any
  let buyWithFiat: ReactElement | null = null
  if (loginRequiredBeforeSubmit) {
    buttonText = 'Login'
    buttonAction = onOpenWalletModal
  } else if (dpiApproving || indexApproving || daiApproving || usdcApproving) {
    buttonText = 'Approving'
    buttonAction = () => {}
  } else if (dpiApprovalRequired) {
    buttonText = 'Approve DPI'
    buttonAction = dpiApproval.onApprove
  } else if (indexApprovalRequired) {
    buttonText = 'Approve INDEX'
    buttonAction = indexApproval.onApprove
  } else if (daiApprovalRequired) {
    buttonText = 'Approve DAI'
    buttonAction = daiApproval.onApprove
  } else if (usdcApprovalRequired) {
    buttonText = 'Approve USDC'
    buttonAction = usdcApproval.onApprove
  } else if (isUserBuying) {
    buttonText = 'Buy'
    buttonAction = onExecuteBuySell
    buyWithFiat = (
      <>
        <div style={{ margin: '10px', color: '#8c8c8c' }}>or</div>
        <RoundedButton
          isDisabled={false}
          isPending={false}
          text={'Buy with Fiat'}
          onClick={transakLauncher}
        />
      </>
    )
  } else {
    buttonText = 'Sell'
    buttonAction = onExecuteBuySell
  }

  return (
    <>
      <RoundedButton
        isDisabled={!currencyQuantity || !tokenQuantity}
        isPending={isFetchingOrderData}
        text={buttonText}
        onClick={buttonAction}
      />
      {buyWithFiat}
    </>
  )
}

export default BuySellButton
