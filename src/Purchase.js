import React, { useState, useEffect } from 'react';


import { v4 as uuidv4 } from 'uuid';

import PurchaseList from './PurchaseList';

import clientInfo from './data.json';

//summary
//add validation
//create modal
//graphs

const LOCAL_STORAGE_KEY = 'local.purchase'

export default function Purchase({ getAndSetFormattedPurchaseList, getAndSetTotalTrees }) {

    const [purchaseList, setPurchaseList] = useState([])
    const [totalTrees, setTotalTrees] = useState(0)
    useEffect(() => {
        setUpLocalStorage()
        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        setPurchaseList(localStorageData)
       

    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(purchaseList))
        updateTotalTrees(purchaseList)
        getAndSetFormattedPurchaseList(purchaseList)
        getAndSetTotalTrees(totalTrees)
    }, [purchaseList, totalTrees])

    function updateDate(id, date) {
        setPurchaseList((currentPurchaseList) => {
            const selectedPurchase = findItem(id)
            selectedPurchase.date = date
            return [...currentPurchaseList]
        })

    }

    function updateAmountOfTrees(id, amountOfTrees) {
        setPurchaseList((currentPurchaseList) => {
            const selectedPurchase = findItem(id)
            selectedPurchase.trees = amountOfTrees
            return [...currentPurchaseList]
        })
    }

    function clearSelectedItem(id) {
        setPurchaseList((currentPurchaseList) => {
            const updatedItemList = currentPurchaseList.filter(item => item.id !== id)
            return [...updatedItemList]

        })
    }
    function updateTotalTrees(currentList) {
        const total = currentList.map(item=>{ return item.trees}).reduce((accumulator, current) => accumulator + current, 0)
        return setTotalTrees(total)
    }

    const findItem = (id) => {
        return purchaseList.find(item => item.id === id)
    }

    const addPurchase = () => {
        const lastRow = purchaseList.at(-1)
        const templatePurchase = { id: uuidv4(), date: "", trees: 0 }

        if (lastRow == null) return setPurchaseList((previousPurchase) => ([...previousPurchase, templatePurchase]))
        if (lastRow.date === "" || lastRow.trees === 0) return

        return setPurchaseList((previousPurchase) => ([...previousPurchase, templatePurchase]))
    }


    //<Table bordered stiped>
    return (
        <>
            <h1 className="display-6 text-center">Purchases</h1>
            <PurchaseList
                purchaseList={purchaseList}
                updateDate={updateDate}
                updateAmountOfTrees={updateAmountOfTrees}
                clearSelectedItem={clearSelectedItem}
                totalTrees={totalTrees}
            />
            <button className='form-control' onClick={addPurchase}>Add Purchase</button>
        </>
    )
}
const setUpLocalStorage = () => {
    if (!(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) === null || JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).length === 0)) return
    const fileData = clientInfo
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fileData))

}


