import React from 'react'
import Table from 'react-bootstrap/Table';


import Item from "./Item"

export default function PurchaseList({ purchaseList, updateDate, updateAmountOfTrees, clearSelectedItem, totalTrees }) {

  const getTable = () => {
    return (

      <Table hover striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Month & Year</th>
            <th>Number of Trees</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            getRow()
          }
          <tr>
          <td colSpan={4}>Total:{totalTrees}</td>
          </tr>

        </tbody>
      </Table>

    )
  }

  const getRow = () => {
    return purchaseList.map(
      (item, index) => {
        return (
          <Item key={item.id} index={index + 1} item={item} updateDate={updateDate} updateAmountOfTrees={updateAmountOfTrees} clearSelectedItem={clearSelectedItem} />
        )
      }
    )
  }
  return (
    getTable()

  )
}


