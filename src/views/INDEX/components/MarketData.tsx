import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'

import SimplePriceChart from 'components/SimplePriceChart'

import useIndexTokenMarketData from 'hooks/useIndexTokenMarketData'

const MarketData: React.FC = () => {
  const { latestPrice, prices } = useIndexTokenMarketData()
  const [chartPrice, setChartPrice] = useState<number>(0)
  useEffect(() => {
    if (!chartPrice && latestPrice) return setChartPrice(latestPrice)
  })

  const priceAtEpochStart = prices?.[0]?.[1] || 1
  const epochPriceChange = (chartPrice || 0) - priceAtEpochStart
  const IndexToken = {
    src: 'https://index-dao.s3.amazonaws.com/owl.png',
    alt: 'Index Coop Logo',
  }

  const updateChartPrice = (tooltipData: any) =>
    setChartPrice(tooltipData.payload.y)

  return (
    <div>
      <StyledDpiIconLabel>
        <StyledIcon src={IndexToken.src} alt={IndexToken.alt} />
        <span>INDEX</span>
      </StyledDpiIconLabel>
      <StyledDpiTitle>Index Coop Token</StyledDpiTitle>
      <StyledDpiPriceWrapper>
        <StyledDpiPrice>
          {'$' + numeral(chartPrice).format('0.00a')}
        </StyledDpiPrice>
        <StyledDpiPriceChange>
          {numeral((epochPriceChange / priceAtEpochStart) * 100).format(
            '0.00a'
          ) + '%'}
        </StyledDpiPriceChange>
      </StyledDpiPriceWrapper>
      <SimplePriceChart
        icon={IndexToken}
        data={prices?.map(([x, y]) => ({ x, y }))}
        readTooltipData={updateChartPrice}
      />
    </div>
  )
}

const StyledDpiTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
`

const StyledDpiIconLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const StyledDpiPriceWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
`

const StyledDpiPrice = styled.span`
  font-size: 36px;
  margin-right: 10px;
  line-height: 1;
`

const StyledDpiPriceChange = styled.span`
  font-size: 24px;
  color: #03c75e;
`

const StyledIcon = styled.img`
  height: 34px;
  text-align: center;
  min-width: 34px;
  margin-right: 5px;
`

export default MarketData