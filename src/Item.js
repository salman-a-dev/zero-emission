import React, { useState, useRef, useEffect } from 'react'
import DatePicker from "react-datepicker";
export default function Item({ item, index, updateDate, updateAmountOfTrees, clearSelectedItem }) {
  const [startDate, setStartDate] = useState(new Date());
  const treeField = useRef()

  useEffect(() =>{
    if(item.date === "") return
    setStartDate(convertMonthAndYearToDate(item.date))
   
  }, [])

  function handleDateChange(date) {
    setStartDate(date)
    updateDate(item.id, convertDateToMonthAndYear(date))
  }

  function handleTreeChange(e) {
    const min = 1
    const max = 55

    const currentTrees = Number(treeField.current.value)
    if (currentTrees < min) {
      treeField.current.value = min
      return updateAmountOfTrees(item.id, min)
    }
    if (currentTrees > max) {
      treeField.current.value = max
      return updateAmountOfTrees(item.id, max)
    }

    updateAmountOfTrees(item.id, currentTrees)
  }

  function handleClearItem() {
    clearSelectedItem(item.id)
  }

  function highLight(event) {
    event.target.select()
  }

  function convertDateToMonthAndYear(date){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const monthAndYear = month + "-" + year
   
    return monthAndYear
  }

  function convertMonthAndYearToDate(date){
    const dateTime = new Date(date.replace("-", " 1 "))
    return dateTime
  }

  return (
    <>
      <tr>
        <td>{index}</td>
        <td>
          <DatePicker
            className="form-control"
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="MMM-yyyy"
            showMonthYearPicker
          />
        </td>
        <td><input ref={treeField} className="form-control" defaultValue={item.trees} onChange={handleTreeChange} type="number" onClick={highLight} /></td>
        <td><button className="form-control" onClick={handleClearItem}>Clear</button></td>
      </tr>
    </>
  )
}
