
import './App.css';
import React, { useState } from 'react';


import CountrySelection from './CountrySelection';
import Purchase from './Purchase';
import Summary from './Summary';
import Charts from './Charts'

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function App() {

  const [emission, setEmission] = useState(0)
  const [totalTrees, setTotalTrees] = useState(0)
  const [formattedPurchaseList, setPurchaseList] = useState([])
  const [orderedPurchaseList, setOrderedPurchaseList] = useState([])

  const getAndSetEmissions = (selectedCountryEmission) => {

    setEmission(selectedCountryEmission)
  }

  const getAndSetFormattedPurchaseList = (latestPurchaseList) => {
    updateOrderedPurchaseList(latestPurchaseList)
    const formattedPurchaseList = [...latestPurchaseList].map(item => {
      return { year: item.date.slice(4), trees: item.trees }

    })


    setPurchaseList(formattedPurchaseList)
  }

  const getAndSetTotalTrees = (trees) => {
    setTotalTrees(trees)
  }

  const updateOrderedPurchaseList = (unformattedPurchaseList) => {
    
    const orderedPurchaseList = getSubsetOfDatesByYears(unformattedPurchaseList)
    if (orderedPurchaseList == null) return
    setOrderedPurchaseList(orderedPurchaseList)

  }

  return (
    <>
      <h1 className = "display-3 text-center">SwitchToZero</h1>
      <div className="row" >
        <div className="col-md-6">

          <CountrySelection getAndSetEmissions={getAndSetEmissions} />
          <Purchase getAndSetFormattedPurchaseList={getAndSetFormattedPurchaseList} getAndSetTotalTrees={getAndSetTotalTrees} />
          <Summary emission={emission} totalTrees={totalTrees} formattedPurchaseList={formattedPurchaseList} orderedPurchaseList={orderedPurchaseList} />
        </div>
        <div className="col-md-6">
          <Charts orderedPurchaseList={orderedPurchaseList} emission={emission}/>

        </div>
      </div>

    </>
  )
}

function getSubsetOfDatesByYears(purchaseList) {
  if (purchaseList.length === 0) return
  const dateAndTrees = purchaseList.map(purchase => { return { year: purchase.date, trees: purchase.trees } })
  const sortedDateAndTrees = dateAndTrees.sort(compareYears)

  const purchaseListSubsets = getSubsetPurchaseList(sortedDateAndTrees)

  const sortedSubsetPurchaseList = purchaseListSubsets.map(purchases => { return purchases.sort(compareMonths) }).flat(1)

  return sortedSubsetPurchaseList

}

function getSubsetPurchaseList(sortedDateAndTrees) {
  return sortedDateAndTrees.reduce((acc, val) => {

    if (acc.at(-1).length === 0) return [[val]]
    const prevYear = acc.at(-1).at(-1).year.slice(4)

    const next = val.year.slice(-4)

    if (prevYear === next) return [...acc.slice(0, -1), [...acc.at(-1), val]]

    return [...acc, [val]]

  }, [[]])
}

function compareMonths(a, b) {

  const monthA = months.indexOf(a.year.slice(0, 3))
  const monthB = months.indexOf(b.year.slice(0, 3))
  if (monthA < monthB) return -1
  if (monthA > monthB) return 1
  return 0
}

function compareYears(a, b) {
  const yearCurrent = a.year.slice(-4)
  const yearNext = b.year.slice(-4)

  if (yearCurrent < yearNext) return -1
  if (yearCurrent > yearNext) return 1
  return 0
}

export default App;
