"use client"

import { useEffect, useState } from "react"
import styled, { keyframes, createGlobalStyle } from "styled-components"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiRequest from "./ApiRequest"
const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL

// Global styles for enhanced typography
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }
`

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 40px 30px;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    background-size: 400% 400%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(52, 152, 219, 0.1);
  animation: ${slideIn} 0.8s ease-out;
`

const Title = styled.h2`
  font-weight: 700;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.025em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(44, 62, 80, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`

const DateLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  letter-spacing: -0.01em;
`

const DateInput = styled.input`
  padding: 14px 20px;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #2c3e50;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 180px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(52, 152, 219, 0.4);
  }
`

const BackButton = styled.button`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #34495e 0%, #2980b9 100%);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
`

const PatientCard = styled.div`
  border: 1px solid rgba(52, 152, 219, 0.1);
  border-radius: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(52, 152, 219, 0.15);
    border-color: rgba(52, 152, 219, 0.3);
    
    &::before {
      transform: scaleX(1);
    }
  }

  p {
    margin: 12px 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #374151;
    
    strong {
      color: #2c3e50;
      font-weight: 600;
    }
  }
`

const NoDataMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 1.2rem;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.8));
  border-radius: 20px;
  margin-top: 30px;
  border: 2px dashed rgba(156, 163, 175, 0.3);
  animation: ${fadeIn} 0.8s ease-out;
  
  &::before {
    content: '📋';
    display: block;
    font-size: 3rem;
    margin-bottom: 16px;
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #3498db;
  font-size: 1.2rem;
  padding: 60px 40px;
  animation: ${pulse} 2s infinite;
  
  &::before {
    content: '⏳';
    display: block;
    font-size: 3rem;
    margin-bottom: 16px;
  }
`

// PatientForm styled components
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
`

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #374151;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(52, 152, 219, 0.4);
  }
  
  &:disabled, &[readonly] {
    background: rgba(249, 250, 251, 0.8);
    color: #6b7280;
    cursor: not-allowed;
  }
`

const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: #374151;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(52, 152, 219, 0.4);
  }
`

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 16px 40px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out 0.4s both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
 
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #34495e 0%, #2980b9 100%);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ChipContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Chip = styled.div`
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(44, 62, 80, 0.1));
  border: 1px solid rgba(52, 152, 219, 0.2);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(44, 62, 80, 0.15));
    transform: translateY(-1px);
  }
`

const ChipRemove = styled.span`
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #ef4444;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #dc2626;
    transform: scale(1.2);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 32px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
`

const TableHeader = styled.th`
  padding: 16px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  font-weight: 600;
  text-align: left;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  
  &:first-child {
    border-top-left-radius: 16px;
  }
  
  &:last-child {
    border-top-right-radius: 16px;
  }
`

const TableCell = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  background: white;
  transition: background-color 0.2s ease;
  
  tr:hover & {
    background: rgba(52, 152, 219, 0.02);
  }
  
  tr:last-child & {
    border-bottom: none;
  }
`

const DeleteButton = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`

const TotalsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;
  padding: 24px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(44, 62, 80, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  animation: ${fadeIn} 0.8s ease-out 0.8s both;
`

const TotalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 160px;
`

const ERBilling = () => {
  const [patients, setPatients] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // PatientForm states
  const [procedureOptions, setProcedureOptions] = useState([])
  const [doctorOptions, setDoctorOptions] = useState([])
  const [selectedProcedures, setSelectedProcedures] = useState([])
  const [discount, setDiscount] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [discountedAmount, setDiscountedAmount] = useState(0)
  const [formData, setFormData] = useState({
    patientname: "",
    erNumber: "",
    billNumber: "",
    doctorName: "",
    billDate: new Date().toISOString().split("T")[0],
    billType: [],
    age: "",
    gender: "Male",
    dob: new Date().toISOString().split("T")[0],
    mobilePhone: "",
    permanentAddress: "",
  })

  // apiRequest function
  const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
    try {
      const token = localStorage.getItem("access_token")
      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      }
      const config = {
        method,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      }

      if (data && method === "GET") {
        config.params = data
      } else if (data && (method === "POST" || method === "PUT")) {
        config.data = data
      }

      const response = await axios(config)

      if (response.status >= 200 && response.status < 300) {
        return { success: true, data: response.data }
      } else if (response.status === 400) {
        return {
          success: false,
          error: response.data?.message || "Invalid data sent to server.",
          status: 400,
          data: response.data,
        }
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.")
        return { success: false, error: "Session expired. Please log in again.", status: 401, data: response.data }
      } else if (response.status === 403) {
        return {
          success: false,
          error: response.data?.message || "You do not have permission to perform this action.",
          status: 403,
          data: response.data,
        }
      } else {
        return {
          success: false,
          error: response.data?.message || "Something went wrong. Try again.",
          status: response.status,
          data: response.data,
        }
      }
    } catch (error) {
      console.error("Network or unexpected error in apiRequest:", error)
      return { success: false, error: "Network error or unexpected issue occurred.", networkError: true }
    }
  }

const fetchPatients = async (date) => {
  setLoading(true);
  try {
    const url = `${ERbaseurl}get_er_patients_by_date/?date=${date}`;
    const result = await apiRequest(url, "GET");

    if (result.success) {
      setPatients(result.data);
    } else {
      toast.error(result.error || "Failed to fetch patients for the selected date");
      setPatients([]);
    }
  } catch (err) {
    toast.error("Unexpected error while fetching patients");
    console.error(err);
    setPatients([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPatients(selectedDate)
  }, [selectedDate])

  // Fetch procedures & doctors, ER/Bill numbers when form is shown
  useEffect(() => {
    if (!showForm) return

    const fetchInitialData = async () => {
      // Fetch Procedures
      const proceduresResponse = await apiRequest(`${ERbaseurl}procedures/`)
      if (proceduresResponse.success) {
        const data = proceduresResponse.data
        const parsed = typeof data === "string" ? JSON.parse(data) : data
        const proceduresWithNumericRates = parsed.map((procedure) => ({
          ...procedure,
          rate: Number.parseFloat(procedure.rate) || 0,
        }))
        setProcedureOptions(proceduresWithNumericRates)
      } else {
        console.error("Error fetching procedures:", proceduresResponse.error)
        toast.error("Failed to fetch procedures.")
      }

      // Fetch Doctors
      const doctorsResponse = await apiRequest(`${ERbaseurl}doctors/`)
      if (doctorsResponse.success) {
        const data = typeof doctorsResponse.data === "string" ? JSON.parse(doctorsResponse.data) : doctorsResponse.data
        setDoctorOptions(data)
      } else {
        console.error("Error fetching doctors:", doctorsResponse.error)
        toast.error("Failed to fetch doctors.")
      }

      // Fetch next bill number
      if (!formData.billNumber) {
        const billNumberResponse = await apiRequest(`${ERbaseurl}next-bill-number/`)
        if (billNumberResponse.success) {
          setFormData((prev) => ({ ...prev, billNumber: billNumberResponse.data.billNumber }))
        } else {
          console.error("Error fetching bill number", billNumberResponse.error)
          toast.error("Failed to fetch bill number.")
        }
      }
    }

    fetchInitialData()
  }, [showForm, ERbaseurl, formData.billNumber])

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
  }

  const handleCardClick = (patient) => {
    handleSelectPatient(patient)
    setShowForm(true)
  }

  // Handler to populate form with selected patient data
  const handleSelectPatient = (patient) => {
    let billTypeArray = []
    if (typeof patient.billType === "string") {
      const billTypeNames = patient.billType.split(", ").map((item) => item.trim())
      billTypeArray = billTypeNames.map((name) => ({
        name: name,
        quantity: 1,
        unitRate: 0,
        amount: 0,
      }))
    } else if (Array.isArray(patient.billType)) {
      billTypeArray = patient.billType
    }

    const procedures = patient.procedures || []

    setFormData({
      patientname: patient.patientname || "",
      erNumber: patient.erNumber || "",
      billNumber: patient.billNumber || "",
      doctorName: patient.doctorName || "",
      billDate: patient.billDate || new Date().toISOString().split("T")[0],
      billType: billTypeArray,
      age: patient.age || "",
      gender: patient.gender || "Male",
      dob: patient.dob || new Date().toISOString().split("T")[0],
      permanentAddress: patient.permanentAddress || "",
      mobilePhone: patient.mobilePhone || "",
    })
    setSelectedProcedures(procedures)
    setDiscount(patient.discount || "")
    setTotalAmount(patient.totalAmount || 0)
    setDiscountedAmount(patient.discountedAmount || 0)

    toast.success(`Patient ${patient.name} loaded into the form.`)
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add procedure to bill type
  const handleBillTypeChange = (e) => {
    const procedureName = e.target.value
    if (!procedureName) return

    if (selectedProcedures.find((p) => p.name === procedureName)) {
      toast.info("This procedure is already added.")
      return
    }

    const selectedProcedure = procedureOptions.find((p) => p.procedure_name === procedureName)

    if (!selectedProcedure) {
      toast.error("Procedure not found in the list.")
      return
    }

    const baseRate = Number.parseFloat(selectedProcedure.rate) || 0

    const newProcedure = {
      name: procedureName,
      baseRate: baseRate,
      rate: baseRate,
      quantity: 1,
    }

    setSelectedProcedures((prev) => [...prev, newProcedure])

    const billTypeItem = {
      name: procedureName,
      quantity: 1,
      unitRate: baseRate,
      amount: baseRate,
    }

    setFormData((prev) => ({
      ...prev,
      billType: [...prev.billType, billTypeItem],
    }))

    toast.success(`Added ${procedureName} to the bill`)
  }

  // Remove bill type chip
  const removeBillType = (type) => {
    setFormData((prev) => ({
      ...prev,
      billType: prev.billType.filter((item) => item.name !== type),
    }))
    setSelectedProcedures((prev) => prev.filter((p) => p.name !== type))
    toast.info(`Removed ${type} from the bill`)
  }

  // Change rate for selected procedure
  const handleRateChange = (index, newRate) => {
    const updated = [...selectedProcedures]
    const baseRate = Number.parseFloat(newRate) || 0
    updated[index].baseRate = baseRate
    updated[index].rate = baseRate * updated[index].quantity
    setSelectedProcedures(updated)

    setFormData((prev) => {
      const updatedBillType = [...prev.billType]
      const billTypeIndex = updatedBillType.findIndex((item) => item.name === updated[index].name)
      if (billTypeIndex !== -1) {
        updatedBillType[billTypeIndex] = {
          ...updatedBillType[billTypeIndex],
          unitRate: baseRate,
          amount: baseRate * updatedBillType[billTypeIndex].quantity,
        }
      }
      return { ...prev, billType: updatedBillType }
    })
  }

  // Change quantity for selected procedure
  const handleQuantityChange = (index, newQuantity) => {
    setSelectedProcedures((prev) => {
      const updated = [...prev]
      const quantity = newQuantity === "" ? "" : Number.parseInt(newQuantity)

      updated[index] = {
        ...updated[index],
        quantity: quantity,
        rate: quantity && !isNaN(quantity) ? updated[index].baseRate * quantity : 0,
      }

      setFormData((prevForm) => {
        const updatedBillType = [...prevForm.billType]
        const billTypeIndex = updatedBillType.findIndex((item) => item.name === updated[index].name)
        if (billTypeIndex !== -1) {
          updatedBillType[billTypeIndex] = {
            ...updatedBillType[billTypeIndex],
            quantity: quantity && !isNaN(quantity) ? quantity : 0,
            amount: quantity && !isNaN(quantity) ? updatedBillType[billTypeIndex].unitRate * quantity : 0,
          }
        }
        return { ...prevForm, billType: updatedBillType }
      })

      return updated
    })
  }

  // Remove procedure from table
  const handleDeleteProcedure = (index) => {
    const proc = selectedProcedures[index]
    removeBillType(proc.name)
  }

  // Update totals when procedures or discount changes
  useEffect(() => {
    const total = selectedProcedures.reduce((acc, curr) => acc + (Number.parseFloat(curr.rate) || 0), 0)
    setTotalAmount(total)

    if (discount.toString().includes("%")) {
      const percent = Number.parseFloat(discount.replace("%", "")) || 0
      setDiscountedAmount(total - (percent / 100) * total)
    } else {
      const flat = Number.parseFloat(discount) || 0
      setDiscountedAmount(total - flat)
    }
  }, [selectedProcedures, discount])

  // Submit handler
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        procedures: selectedProcedures,
        totalAmount,
        discount,
        discountedAmount,
      }

      toast.info("Saving patient data...")

      const response = await apiRequest(`${ERbaseurl}erbilling/`, "POST", payload)

      if (response.success) {
        setFormData((prev) => ({ ...prev, billNumber: response.data.billNumber }))
        toast.success("Patient data saved successfully!")
        printBill(payload)
      } else {
        console.error("Error saving patient data:", response.error)
        toast.error("Failed to save data: " + (response.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Catch block error during save:", error)
      toast.error("An unexpected error occurred during patient registration.")
    }
  }

  // Print Bill Function
  const printBill = (data) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your popup blocker settings.")
      return
    }

    const procedureRows = data.procedures
      .map(
        (proc, index) => `
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin: 2px 0;">
            <div style="width: 8%; text-align: center;">${index + 1}</div>
            <div style="width: 40%; padding-left: 5px;">${proc.name}</div>
            <div style="width: 10%; text-align: center;">${proc.quantity}</div>
            <div style="width: 15%; text-align: right;">${proc.baseRate.toFixed(2)}</div>
            <div style="width: 15%; text-align: right;">${proc.rate.toFixed(2)}</div>
          </div>`,
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>ER Bill - ${data.billNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              padding: 10px;
              width: 80mm;
            }
            .center {
              text-align: center;
            }
            .line {
              border-top: 1px solid #000;
              margin: 8px 0;
            }
            .header-title {
              font-weight: bold;
              font-size: 16px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .info-label {
              font-weight: bold;
            }
            .procedure-header, .procedure-row {
              display: flex;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }
            .procedure-header > div {
              padding-left: 5px;
            }
            .procedure-header div:nth-child(1) { width: 8%; text-align: center; }
            .procedure-header div:nth-child(2) { width: 40%; }
            .procedure-header div:nth-child(3) { width: 10%; text-align: center; }
            .procedure-header div:nth-child(4) { width: 15%; text-align: right; }
            .procedure-header div:nth-child(5) { width: 15%; text-align: right; }
            .totals {
              font-weight: bold;
              display: flex;
              justify-content: flex-end;
              margin-top: 6px;
            }
            .totals div {
              width: 30%;
              text-align: right;
              padding-left: 10px;
            }
          </style>
        </head>
        <body>
          <div class="center">
            <div class="header-title">SHANMUGA HOSPITAL LIMITED</div>
            <div>51/24, Saradha College Road, Salem - 636007</div>
            <div>CIN: L85110TZ2020PLC033974</div>
          </div>

          <div class="line"></div>

          <div class="center" style="font-weight: bold;">Cash Bill - <u>ER BILL (SH)</u></div>

          <div class="line"></div>

          <div class="info-row"><div class="info-label">Bill Number:</div><div>${data.billNumber}</div></div>
          <div class="info-row"><div class="info-label">ER Number:</div><div>${data.erNumber}</div></div>
          <div class="info-row"><div class="info-label">Bill Date:</div><div>${data.billDate} ${data.billTime || ""}</div></div>
          <div class="info-row"><div class="info-label">Name:</div><div>${data.patientname}</div></div>

          <div class="info-row"><div class="info-label">Doctor:</div><div>${data.doctorName}</div></div>

          <div class="line"></div>

          <div class="procedure-header">
            <div>No</div>
            <div>Description</div>
            <div>Qty</div>
            <div>Cost</div>
            <div>Amount</div>
          </div>
          ${procedureRows}

          <div class="line"></div>

          <div class="totals">
            <div>Total:</div>
            <div>₹${data.totalAmount.toFixed(2)}</div>
          </div>
          <div class="totals">
            <div>Net Amount:</div>
            <div>₹${data.discountedAmount.toFixed(2)}</div>
          </div>

          <div class="line"></div>

          <div style="margin-top: 30px;">Signature: ___________________</div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleBackToList = () => {
    setShowForm(false)
    setFormData({
      patientname: "",
      erNumber: "",
      billNumber: "",
      doctorName: "",
      billDate: new Date().toISOString().split("T")[0],
      billType: [],
      age: "",
      gender: "Male",
      dob: new Date().toISOString().split("T")[0],
      permanentAddress: "",
      mobilePhone: "",
    })
    setSelectedProcedures([])
    setDiscount("")
    setTotalAmount(0)
    setDiscountedAmount(0)
  }

  if (showForm) {
    return (
      <>
        <GlobalStyle />
        <Container>
          <Header>
            <Title>ER Patient Form</Title>
            <BackButton onClick={handleBackToList}>← Back to Patient List</BackButton>
          </Header>

          <FormGrid>
            <InputGroup>
              <Label>ER Number</Label>
              <Input name="erNumber" value={formData.erNumber} readOnly />
            </InputGroup>
            <InputGroup>
              <Label>Patient Name</Label>
              <Input name="name" value={formData.patientname} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Bill Number</Label>
              <Input name="billNumber" value={formData.billNumber} disabled />
            </InputGroup>
            <InputGroup>
              <Label>Doctor Name</Label>
              <Select name="doctorName" value={formData.doctorName} onChange={handleChange}>
                <option value="">Select Doctor</option>
                {doctorOptions.map((doc) => (
                  <option key={doc._id?.$oid || doc._id} value={doc.doctor_name}>
                    {doc.doctor_name}
                  </option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Bill Date</Label>
              <Input type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Age</Label>
              <Input name="age" value={formData.age} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Gender</Label>
              <Select name="gender" value={formData.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Address</Label>
              <Input name="address" value={formData.permanentAddress} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Mobile Number</Label>
              <Input name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Date of Birth</Label>
              <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>Bill Type</Label>
              <Select onChange={handleBillTypeChange}>
                <option value="">Select Procedure</option>
                {procedureOptions
                  .filter((p) => !formData.billType.some((item) => item.name === p.procedure_name))
                  .map((item) => (
                    <option key={item._id?.$oid || item._id} value={item.procedure_name}>
                      {item.procedure_name}
                    </option>
                  ))}
              </Select>
              <ChipContainer>
                {formData.billType.map((item) => (
                  <Chip key={item.name}>
                    {item.name}
                    <ChipRemove onClick={() => removeBillType(item.name)}>×</ChipRemove>
                  </Chip>
                ))}
              </ChipContainer>
            </InputGroup>
          </FormGrid>

          <SubmitButton onClick={handleSubmit}>Submit Patient Data</SubmitButton>

          {selectedProcedures.length > 0 && (
            <>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Procedure</TableHeader>
                    <TableHeader>Quantity</TableHeader>
                    <TableHeader>Unit Rate (₹)</TableHeader>
                    <TableHeader>Total (₹)</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {selectedProcedures.map((proc, idx) => (
                    <tr key={idx}>
                      <TableCell>{proc.name}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={proc.quantity === "" ? "" : proc.quantity}
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={proc.baseRate}
                          onChange={(e) => handleRateChange(idx, e.target.value)}
                          style={{ width: "100%" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={proc.rate.toFixed(2)}
                          readOnly
                          style={{ width: "100%", backgroundColor: "#f8f9fa" }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButton onClick={() => handleDeleteProcedure(idx)}>🗑️ Delete</DeleteButton>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <TotalsContainer>
                <TotalItem>
                  <Label>Discount</Label>
                  <Input
                    type="text"
                    value={discount}
                    placeholder="Enter amount or percentage (e.g. 100 or 10%)"
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{ width: "200px" }}
                  />
                </TotalItem>
                <TotalItem>
                  <Label>Total Amount</Label>
                  <Input
                    type="text"
                    value={totalAmount.toFixed(2)}
                    readOnly
                    style={{ width: "150px", backgroundColor: "#f8f9fa" }}
                  />
                </TotalItem>
                <TotalItem>
                  <Label>Discounted Amount</Label>
                  <Input
                    type="text"
                    value={discount ? discountedAmount.toFixed(2) : ""}
                    placeholder="Discounted amount will appear here"
                    readOnly
                    style={{ width: "150px", backgroundColor: "#f8f9fa" }}
                  />
                </TotalItem>
                <TotalItem>
                  <Label>Net Amount</Label>
                  <Input
                    type="text"
                    value={(discount ? discountedAmount : totalAmount).toFixed(2)}
                    readOnly
                    style={{ width: "150px", backgroundColor: "#f8f9fa", fontWeight: "bold" }}
                  />
                </TotalItem>
              </TotalsContainer>
            </>
          )}
        </Container>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>ER Patients - {formatDate(selectedDate)}</Title>
        </Header>

        <DatePickerContainer>
          <DateLabel htmlFor="date-picker">Select Date:</DateLabel>
          <DateInput
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
          />
        </DatePickerContainer>

        {loading ? (
          <LoadingMessage>Loading patients...</LoadingMessage>
        ) : patients.length > 0 ? (
          <CardGrid>
            {patients.map((patient) => (
              <PatientCard key={patient.erNumber} onClick={() => handleCardClick(patient)}>
                <p>
                  <strong>Name:</strong> {patient.patientname}
                </p>
                <p>
                  <strong>ER No:</strong> {patient.erNumber}
                </p>
                <p>
                  <strong>Age:</strong> {patient.age}
                </p>
                <p>
                  <strong>Gender:</strong> {patient.gender}
                </p>
              </PatientCard>
            ))}
          </CardGrid>
        ) : (
          <NoDataMessage>No patients found for {formatDate(selectedDate)}</NoDataMessage>
        )}
      </Container>
    </>
  )
}

export default ERBilling
