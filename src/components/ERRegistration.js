import { useState, useEffect, useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { ChevronDown, ChevronUp, User, MapPin, UserCheck, X, CheckCircle, AlertCircle, InfoIcon } from "lucide-react"
import axios from "axios"
import apiRequest from "./ApiRequest"

// Styled Components with Blue Theme
const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const FormHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  h2 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }

  p {
    margin: 10px 0 0;
    font-size: 1.1rem;
    opacity: 0.9;
    position: relative;
    z-index: 1;
  }
`

const FormContent = styled.div`
  padding: 30px;
`

const SectionWrapper = styled.div`
  margin-bottom: 25px;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fafafa;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.1);
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;

    .section-title {
      color: white;
    }
  }
`

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 10px;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
`

const SectionContent = styled.div`
  padding: 25px;
  background: white;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  &.full-width {
    grid-column: 1 / -1;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
`

const InputLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;

  .required {
    color: #dc3545;
  }
`

const InputField = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    outline: none;
    background: white;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const SelectField = styled.select`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  cursor: pointer;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    outline: none;
    background: white;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
`

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #34495e 0%, #2980b9 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`

const CancelButton = styled.button`
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ToastWrapper = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 400px;
  min-width: 300px;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @keyframes slideIn {
    from { 
      transform: translateX(100%) scale(0.8); 
      opacity: 0; 
    }
    to { 
      transform: translateX(0) scale(1); 
      opacity: 1; 
    }
  }

  &.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  &.info {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
`

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
`

const ToastMessage = styled.span`
  font-size: 14px;
  line-height: 1.4;
`

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} />
      case "error":
        return <AlertCircle size={16} />
      default:
        return <InfoIcon size={16} />
    }
  }

  return (
    <ToastWrapper className={type}>
      <ToastContent>
        <ToastIcon>{getIcon()}</ToastIcon>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <ToastCloseButton onClick={onClose}>
        <X size={16} />
      </ToastCloseButton>
    </ToastWrapper>
  )
}

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = true, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <SectionWrapper>
      <SectionHeader onClick={() => setIsOpen(!isOpen)}>
        <SectionTitleWrapper>
          {icon && <SectionIcon>{icon}</SectionIcon>}
          <SectionTitle className="section-title">{title}</SectionTitle>
        </SectionTitleWrapper>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </SectionHeader>
      {isOpen && <SectionContent>{children}</SectionContent>}
    </SectionWrapper>
  )
}

const PatientRegistrationForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [doctorOptions, setDoctorOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  showToast.error = (msg) => showToast(msg, "error")
  showToast.success = (msg) => showToast(msg, "success")
  showToast.info = (msg) => showToast(msg, "info")

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!ERbaseurl) {
        showToast("Configuration error: Base URL not found", "error")
        return
      }

      setIsLoading(true)

      const response = await apiRequest(`${ERbaseurl}doctors/`, "GET")

      if (response.success) {
        const data = response.data
        const parsedData = typeof data === "string" ? JSON.parse(data) : data
        setDoctorOptions(Array.isArray(parsedData) ? parsedData : [])
      } else {
        console.error("Error fetching doctors:", response.error)
        showToast("Failed to fetch doctors.", "error")
        setDoctorOptions([])
      }

      setIsLoading(false)
    }

    fetchDoctors()
  }, [showToast, ERbaseurl])

  // Patient state with proper initial values
  const [patient, setPatient] = useState({
    salutation: "",
    firstname: "",
    lastname: "",
    patientname: "",
    dob: "",
    age: "",
    gender: "",
    permanentAddress: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    mobilePhone: "",
    alternativeNumber: "",
    aadhaarNumber: "",
    bloodGroup: "",
    guardianName: "",
    referredBy: "",
    doctorName: "",
    doctorFees: "",
  })

  // Check for edit mode and populate form
  useEffect(() => {
    if (location.state && location.state.record) {
      const record = location.state.record
      setIsEditMode(true)
      setEditingRecord(record)

      // Parse the patient name to extract salutation, firstname, lastname
      const nameParts = record.patientname ? record.patientname.trim().split(" ") : []
      let salutation = ""
      let firstname = ""
      let lastname = ""

      if (nameParts.length > 0) {
        // Check if first part is a salutation
        const possibleSalutation = nameParts[0]
        if (["Mr.", "Mrs.", "Ms.", "Dr."].includes(possibleSalutation)) {
          salutation = possibleSalutation
          if (nameParts.length > 1) {
            firstname = nameParts[1]
            if (nameParts.length > 2) {
              lastname = nameParts.slice(2).join(" ")
            }
          }
        } else {
          // No salutation found
          firstname = nameParts[0]
          if (nameParts.length > 1) {
            lastname = nameParts.slice(1).join(" ")
          }
        }
      }

      // Format date if it exists
      let formattedDob = ""
      if (record.dob) {
        const date = new Date(record.dob)
        if (!isNaN(date.getTime())) {
          formattedDob = date.toISOString().split("T")[0]
        }
      }

      setPatient({
        salutation: salutation,
        firstname: firstname,
        lastname: lastname,
        patientname: record.patientname || "",
        dob: formattedDob,
        age: record.age || "",
        gender: record.gender || "",
        permanentAddress: record.permanentAddress || "",
        area: record.area || "",
        pincode: record.pincode || "",
        city: record.city || "",
        state: record.state || "",
        email: record.email || "",
        mobilePhone: record.mobilePhone || "",
        alternativeNumber: record.alternativeNumber || "",
        aadhaarNumber: record.aadhaarNumber || "",
        bloodGroup: record.bloodGroup || "",
        guardianName: record.guardianName || "",
        referredBy: record.referredBy || "",
        doctorName: record.doctorName || "",
        doctorFees: record.doctorFees || "",
      })
    }
  }, [location.state])

  // Age calculation functions
  const calculateAgeFromDOB = useCallback((dob) => {
    if (!dob) return ""

    const birthDate = new Date(dob)
    const today = new Date()

    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return ""
    }

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age >= 0 ? age : ""
  }, [])

  const calculateDOBFromAge = useCallback((age) => {
    if (!age || age < 0 || age > 150) return ""

    const today = new Date()
    const birthYear = today.getFullYear() - Number.parseInt(age)
    return new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split("T")[0]
  }, [])

  // Handle form field changes
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target

      setPatient((prevPatient) => {
        if (name === "dob") {
          const calculatedAge = calculateAgeFromDOB(value)
          return { ...prevPatient, dob: value, age: calculatedAge }
        } else if (name === "age") {
          const calculatedDOB = calculateDOBFromAge(value)
          return { ...prevPatient, age: value, dob: calculatedDOB }
        } else if (type === "checkbox") {
          return { ...prevPatient, [name]: checked }
        } else {
          return { ...prevPatient, [name]: value }
        }
      })
    },
    [calculateAgeFromDOB, calculateDOBFromAge],
  )

  // Form validation
  const validateForm = useCallback(() => {
    const errors = []

    if (!patient.firstname?.trim() || !patient.lastname?.trim()) {
      errors.push("First name and last name are required")
    }

    if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
      errors.push("Please enter a valid email address")
    }

    if (patient.mobilePhone && !/^\d{10}$/.test(patient.mobilePhone.replace(/\D/g, ""))) {
      errors.push("Please enter a valid 10-digit mobile number")
    }

    return errors
  }, [patient])

  // Handle cancel button
  const handleCancel = useCallback(() => {
    if (isEditMode) {
      navigate(-1) // Go back to previous page
    } else {
      // Reset form for new registration
      setPatient({
        salutation: "",
        firstname: "",
        lastname: "",
        patientname: "",
        dob: "",
        age: "",
        gender: "",
        permanentAddress: "",
        area: "",
        pincode: "",
        city: "",
        state: "",
        email: "",
        mobilePhone: "",
        alternativeNumber: "",
        aadhaarNumber: "",
        bloodGroup: "",
        guardianName: "",
        referredBy: "",
        doctorName: "",
        doctorFees: "",
      })
    }
  }, [isEditMode, navigate])

  // Handle form submission with better error handling
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => showToast.error(error))
        return
      }

      if (!ERbaseurl) {
        showToast.error("Configuration error: Base URL not found")
        return
      }

      const token = localStorage.getItem("access_token")
      if (!token) {
        showToast.error("Authorization token not found")
        return
      }

      setIsSubmitting(true)

      try {
        const fullName = `${patient.salutation || ""} ${patient.firstname || ""} ${patient.lastname || ""}`.trim()
        const updatedPatient = { ...patient, patientname: fullName }

        if (isEditMode && editingRecord) {
          const response = await axios.patch(
            `${ERbaseurl}erregisteredit/`,
            {
              id: editingRecord.id,
              ...updatedPatient,
            },
            {
              headers: {
                Authorization: `${token}`
              }
            }
          )

          if (response.status === 200) {
            showToast.success("Patient record updated successfully!")
            navigate(-1)
          }
        } else {
          const formData = new FormData()
          Object.keys(updatedPatient).forEach((key) => {
            if (key !== "id" && updatedPatient[key] !== null && updatedPatient[key] !== undefined) {
              formData.append(key, updatedPatient[key])
            }
          })

          const response = await apiRequest(`${ERbaseurl}erregister/`, "POST", formData, {
            "Authorization": `${token}`,
            "Content-Type": null,
          })

          if (response.ok) {
            const data = await response.json()
            showToast.success(`Patient registered successfully! ER No: ${data.erNumber}`)
            setPatient({
              salutation: "", firstname: "", lastname: "", patientname: "", dob: "", age: "",
              gender: "", permanentAddress: "", area: "", pincode: "", city: "", state: "",
              email: "", mobilePhone: "", alternativeNumber: "", aadhaarNumber: "",
              bloodGroup: "", guardianName: "", referredBy: "", doctorName: "", doctorFees: "",
            })
          } else {
            const errorText = await response.text()
            try {
              const errorData = JSON.parse(errorText)
              const errorMessage =
                errorData.message || Object.values(errorData).flat().join(", ") || "Registration failed"
              showToast.error(`Error: ${errorMessage}`)
            } catch (e) {
              showToast.error("Registration failed. Please check your input and try again.")
            }
          }
        }
      } catch (error) {
        console.error("Network Error:", error)
        showToast.error(isEditMode
          ? "Failed to update patient record. Please try again."
          : "Failed to connect to the server. Please check your internet connection.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [patient, validateForm, ERbaseurl, isEditMode, editingRecord, navigate],
  )

  // Memoized doctor options
  const doctorSelectOptions = useMemo(() => {
    return doctorOptions.map((doc) => (
      <option key={doc._id} value={doc.doctor_name}>
        {doc.doctor_name}
      </option>
    ))
  }, [doctorOptions])

  return (
    <AppContainer>
      {/* Toast Container */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </ToastContainer>

      <FormContainer>
        <FormHeader>
          <h2>{isEditMode ? "Edit Emergency Registration" : "Emergency Registration"}</h2>
          <p>
            {isEditMode
              ? "Update patient information for emergency care"
              : "Complete patient information for emergency care"}
          </p>
        </FormHeader>

        <FormContent>
          <form onSubmit={handleSubmit}>
            <CollapsibleSection title="Patient Information" defaultOpen={true} icon={<User size={20} />}>
              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="salutation">Salutation</InputLabel>
                  <SelectField id="salutation" name="salutation" value={patient.salutation} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </SelectField>
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="firstname">
                    First Name <span className="required">*</span>
                  </InputLabel>
                  <InputField
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={patient.firstname}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    maxLength="50"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="lastname">
                    Last Name <span className="required"></span>
                  </InputLabel>
                  <InputField
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={patient.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    maxLength="50"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="dob">Date of Birth</InputLabel>
                  <InputField
                    type="date"
                    id="dob"
                    name="dob"
                    value={patient.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </InputGroup>
              </FormRow>

              {/* Second Row - 4 fields */}
              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="age">Age</InputLabel>
                  <InputField
                    type="number"
                    id="age"
                    name="age"
                    value={patient.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="0"
                    max="150"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="gender">Gender</InputLabel>
                  <SelectField id="gender" name="gender" value={patient.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </SelectField>
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="bloodGroup">Blood Group</InputLabel>
                  <SelectField id="bloodGroup" name="bloodGroup" value={patient.bloodGroup} onChange={handleChange}>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </SelectField>
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="guardianName">Spouse/Guardian Name</InputLabel>
                  <InputField
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={patient.guardianName}
                    onChange={handleChange}
                    placeholder="Spouse name (if applicable)"
                    maxLength="100"
                  />
                </InputGroup>
              </FormRow>

              {/* Third Row - 4 fields */}
              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="referredBy">Referred By</InputLabel>
                  <InputField
                    type="text"
                    id="referredBy"
                    name="referredBy"
                    value={patient.referredBy}
                    onChange={handleChange}
                    placeholder="Referral source"
                    maxLength="100"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <InputField
                    type="email"
                    id="email"
                    name="email"
                    value={patient.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    maxLength="100"
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="mobilePhone">Mobile Phone</InputLabel>
                  <InputField
                    type="tel"
                    id="mobilePhone"
                    name="mobilePhone"
                    value={patient.mobilePhone}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    maxLength="15"
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="alternativeNumber">Alternative Number</InputLabel>
                  <InputField
                    type="tel"
                    id="alternativeNumber"
                    name="alternativeNumber"
                    value={patient.alternativeNumber}
                    onChange={handleChange}
                    placeholder="Alternative number"
                    maxLength="15"
                  />
                </InputGroup>
              </FormRow>

              {/* Fourth Row - 1 field */}
              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="aadhaarNumber">Aadhaar Number</InputLabel>
                  <InputField
                    type="text"
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    value={patient.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="Aadhaar number"
                    maxLength="12"
                    pattern="[0-9]*"
                  />
                </InputGroup>
              </FormRow>
            </CollapsibleSection>

            <CollapsibleSection title="Address Information" defaultOpen={true} icon={<MapPin size={20} />}>
              <FormRow>
                <InputGroup className="full-width">
                  <InputLabel htmlFor="permanentAddress">Permanent Address</InputLabel>
                  <InputField
                    type="text"
                    id="permanentAddress"
                    name="permanentAddress"
                    value={patient.permanentAddress}
                    onChange={handleChange}
                    placeholder="Full address"
                    maxLength="200"
                  />
                </InputGroup>
              </FormRow>

              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="area">Area</InputLabel>
                  <InputField
                    type="text"
                    id="area"
                    name="area"
                    value={patient.area}
                    onChange={handleChange}
                    placeholder="Area/Locality"
                    maxLength="100"
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="city">City</InputLabel>
                  <InputField
                    type="text"
                    id="city"
                    name="city"
                    value={patient.city}
                    onChange={handleChange}
                    placeholder="City"
                    maxLength="50"
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="state">State</InputLabel>
                  <InputField
                    type="text"
                    id="state"
                    name="state"
                    value={patient.state}
                    onChange={handleChange}
                    placeholder="State/Province"
                    maxLength="50"
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="pincode">Pincode</InputLabel>
                  <InputField
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={patient.pincode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    maxLength="10"
                    pattern="[0-9]*"
                  />
                </InputGroup>
              </FormRow>
            </CollapsibleSection>

            <CollapsibleSection title="Doctor Information" defaultOpen={true} icon={<UserCheck size={20} />}>
              <FormRow>
                <InputGroup>
                  <InputLabel htmlFor="doctorName">Doctor Name</InputLabel>
                  <SelectField
                    id="doctorName"
                    name="doctorName"
                    value={patient.doctorName}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">{isLoading ? "Loading doctors..." : "Select Doctor"}</option>
                    {doctorSelectOptions}
                  </SelectField>
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="doctorFees">Doctor Fees</InputLabel>
                  <InputField
                    type="number"
                    id="doctorFees"
                    name="doctorFees"
                    value={patient.doctorFees}
                    onChange={handleChange}
                    placeholder="Doctor fees"
                    min="0"
                    step="0.01"
                  />
                </InputGroup>
              </FormRow>
            </CollapsibleSection>

            <ButtonContainer>
              <CancelButton type="button" onClick={handleCancel}>
                {isEditMode ? "Cancel" : "Clear Form"}
              </CancelButton>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoadingSpinner />}
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Patient"
                    : "Save Patient"}
              </SubmitButton>
            </ButtonContainer>
          </form>
        </FormContent>
      </FormContainer>
    </AppContainer>
  )
}

export default PatientRegistrationForm
