import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'


const LOCAL_STORAGE_KEY = 'local.country'
export default function CountrySelection({ getAndSetEmissions }) {
    const [countryInfo, setCountry] = useState({ value: 0, label: "Not Selected" })
    const countryRef = useRef()

    useEffect(() => {
        const currentCountry = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

        if (currentCountry == null) return

        setCountry(currentCountry)
        getAndSetEmissions(currentCountry.value)

    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(countryInfo))
        getAndSetEmissions(countryInfo.value)
    }, [countryInfo])


    const handleCountryChange = (selectedValue) => {
        setCountry(selectedValue)
    }

    const options = [
        { value: 15.52, label: 'United States' },
        { value: 5.55, label: 'United Kingdom' },
        { value: 9.44, label: 'Germany' },
        { value: 6.95, label: 'South Africa' },
        { value: 1.91, label: 'India' },
        { value: 7.38, label: 'China' },
        { value: 8.56, label: 'Singapore' },
        { value: 17.10, label: 'Australia' },

    ]
    return (
        <>
            <div className="row">
                <div className="col-md-2"><label className="col-form-label">Select Country</label></div>
                <div className="col-md-8"> <div className="mb-2">


                    <Select ref={countryRef} options={options} onChange={handleCountryChange} value={countryInfo} />
                </div> </div>
            </div>

        </>
    )
}
