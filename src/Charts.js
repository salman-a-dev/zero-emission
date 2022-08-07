import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";



const months = 12
const tonToKgConversionRate = 1000
const treeEmissionOffset = 28.5 / months
export default function Charts({ orderedPurchaseList, emission }) {
  const graphDataSet = getOrderedListWithEmissions()
  
  function getEmissionsPerMonInKg() {
    if (emission === 0) return 0
    
    const emissionPerMonthInKg = ((tonToKgConversionRate * emission) / months)
    return emissionPerMonthInKg
  }

  function getOrderedListWithEmissions() {
    if (orderedPurchaseList.length === 0) return

    const monthlyEmission = getEmissionsPerMonInKg()
    const orderListWithoutDuplicates = removeDuplicatesAndUpdateTotalTrees(orderedPurchaseList)
    const graphResultSetAccumulatedResults = accumulatedResult(orderListWithoutDuplicates)
    return graphResultSetAccumulatedResults.map(
      (purchase)=>{
        return {year:purchase.year, "Your Carbon Offset (kg/month)": purchase.trees * treeEmissionOffset, "Average CO2 Consumption (kg/month)":monthlyEmission}
      }
    )

  }


  function accumulatedResult(orderListWithoutDuplicates){
    return orderListWithoutDuplicates.reduce((acc,val)=>{
        if(acc.length === 0) return [val]

        return [...acc, {year:val.year, trees:val.trees + acc.at(-1).trees}]

    }, [])
  }
  function removeDuplicatesAndUpdateTotalTrees(orderedPurchaseList) {
    const purchaseListWithoutDuplicates = orderedPurchaseList.reduce((acc, val) => {
      if (acc.length === 0) return [val]

      if (acc.at(-1).year === val.year) return [...acc.slice(0, -1), { year: val.year, trees: val.trees + acc.at(-1).trees }]

      return [...acc, val]

    }, [])

    return purchaseListWithoutDuplicates
  }

  return (
    <>
      <h1 className="display-6 text-center">Charts</h1>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart width={500} height={300} data={graphDataSet}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Average CO2 Consumption (kg/month)"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Your Carbon Offset (kg/month)" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
