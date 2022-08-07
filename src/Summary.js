import React, { useEffect, useState } from 'react'

const maintenanceCostOfSingleTree = 12
const upFrontTreeCost = 120

const numberOfYearsSummary = 10
const tonToKgConversionRate = 1000
const summaryErrorMessage = "Insufficient information to calculate summary"

const fullMonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


export default function Summary({ emission, totalTrees, formattedPurchaseList, orderedPurchaseList }) {


    const [summary, setSummary] = useState(summaryErrorMessage)

    const carbonNeutralitySummary = `${numberOfYearsSummary} years from when you started your carbon neutraility journey, by ${getStartingMonthAndYear()} 
    you will have ${numberOfTreesPurchasedOverSummaryYears()} trees planted. `

    const monthlyMaintenaceCostSummary = `Your monthly maintenance cost at the ${numberOfYearsSummary} years milestone is USD ${getMonthlyMaintenanceCosts()}. `

    const estimatedExpenditureSummary = `Your estimated expenditure over ${numberOfYearsSummary} years is USD ${getFinalSummary()}. `

    const purchaseCostSummary = `This comprises USD ${getTotalCostSummary(formattedPurchaseList)} in purchase costs and USD
         ${getSummaryOfMaintenance(formattedPurchaseList)} in maintenance fees`



    useEffect(() => {
        if (emission === 0 || emission == null || formattedPurchaseList.length === 0 || orderedPurchaseList.length === 0) {
            setSummary(summaryErrorMessage)
        } else {
            setSummary(summaryReport())
        }


    }, [emission, formattedPurchaseList, orderedPurchaseList, summary])

    function getFinalSummary() {
        return getTotalCostSummary(formattedPurchaseList) + getSummaryOfMaintenance(formattedPurchaseList)
    }

    function summaryReport() {
        const summary = carbonNeutralitySummary + monthlyMaintenaceCostSummary + estimatedExpenditureSummary + purchaseCostSummary

        return summary
    }


    function numberOfTreesPurchasedOverSummaryYears() {
        if (formattedPurchaseList.length === 0) return
        const groupedDatesWithTrees = groupDatesWithTrees(formattedPurchaseList.sort(compareYears)).slice(0, numberOfYearsSummary)
        const treesOverSelectedNumberOfYears = maintenanceCostSummary(groupedDatesWithTrees.map(datesWithTrees => datesWithTrees.trees))
        return treesOverSelectedNumberOfYears
    }

    function getStartingMonthAndYear() {
        if (orderedPurchaseList.length === 0) return

        const orderedPurchaseListWithoutNewEmptyFields = orderedPurchaseList.filter(a => a.year !== "")

        if(orderedPurchaseListWithoutNewEmptyFields.length === 0) return
        const startingMonthAndYear = orderedPurchaseListWithoutNewEmptyFields[0].year
        const projectedYear = parseInt(orderedPurchaseListWithoutNewEmptyFields[0].year.slice(-4)) + numberOfYearsSummary

        const summaryMonthName = fullMonthName[shortMonthName.indexOf(startingMonthAndYear.slice(0, 3))]

        const projectedMonthAndYear = summaryMonthName + " " + projectedYear
        return projectedMonthAndYear
    }

    function getMonthlyMaintenanceCosts() {
        const numberOfMonths = 12
        const treesOverSummaryYears = numberOfTreesPurchasedOverSummaryYears()
        if (treesOverSummaryYears == null) return

        return ((treesOverSummaryYears * maintenanceCostOfSingleTree) / numberOfMonths)


    }


    function getTotalCostSummary(dateAndTreePurcaseList) {
        if (dateAndTreePurcaseList.length === 0) return

        const emissionInKg = emission * tonToKgConversionRate
        const groupedDatesWithTrees = groupDatesWithTrees(dateAndTreePurcaseList.sort(compareYears)).slice(0, numberOfYearsSummary)
        const treesFromPurchaseList = groupedDatesWithTrees.map(item => item.trees)
        const totalTreesForSelectedNumberOfYears = maintenanceCostSummary(treesFromPurchaseList)

        return totalTreesForSelectedNumberOfYears * upFrontTreeCost

    }

    function getSummaryOfMaintenance(dateAndTreePurcaseList) {
        if (dateAndTreePurcaseList.length === 0) return


        const sortedDateAndTreePurchaseList = [...dateAndTreePurcaseList].sort(compareYears)
        const groupedDatesWithTrees = groupDatesWithTrees(sortedDateAndTreePurchaseList)
        const yearlyCostings = maintenanceCosts(groupedDatesWithTrees).slice(0, numberOfYearsSummary)

        const summaryCost = maintenanceCostSummary(yearlyCostings) + getRemainingYearsMaintenanceCost(yearlyCostings)

        return summaryCost

    }

    return (
        <>
            <h1 className="display-6 text-center">Summary</h1>
            <div className="container alert alert-info"><label>{summary}</label></div>
        </>
    )


}

function getRemainingYearsMaintenanceCost(yearlyCostings) {

    if (yearlyCostings.length >= numberOfYearsSummary) return 0

    const remainingYears = numberOfYearsSummary - yearlyCostings.length

    return remainingYears * yearlyCostings.at(-1)
}

function maintenanceCosts(yearlyCosts) {

    return yearlyCosts.map(item => item.trees).reduce((acc, val) => {

        if (acc.length === 0) return [val * maintenanceCostOfSingleTree]
        return [...acc, acc.at(-1) + (val * maintenanceCostOfSingleTree)]
    }, [])
}

function maintenanceCostSummary(maintenanceCosts) {
    return maintenanceCosts.reduce((acc, val) => {
        return acc + val
    }, 0)
}

function compareYears(a, b) {
    if (a.year < b.year) return -1
    if (a.year > b.year) return 1
    return 0
}


function groupDatesWithTrees(dateArray) {
    const result = dateArray.reduce((accumulator, value) => {
        if (accumulator.at(-1).year === value.year) return updateArray(accumulator, value)

        return [...accumulator, value]
    }, [{ year: dateArray[0].year, trees: 0 }])

    return result
}

function updateArray(array, value) {
    const lastElement = array.length - 1
    array[lastElement].trees = array[lastElement].trees + value.trees
    return array

}
