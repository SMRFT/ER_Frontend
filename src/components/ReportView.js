import axios from "axios"
import React, { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import styled, { keyframes, createGlobalStyle } from "styled-components"

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL

// Global styles for datepicker z-index fix
const GlobalDatePickerStyles = createGlobalStyle`
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  
  .react-datepicker {
    z-index: 9999 !important;
    border: 2px solid rgba(52, 152, 219, 0.2) !important;
    border-radius: 12px !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  }

  .react-datepicker__triangle {
    border-bottom-color: #2c3e50 !important;
    z-index: 9999 !important;
  }

  .react-datepicker__triangle::before {
    border-bottom-color: rgba(52, 152, 219, 0.2) !important;
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%) !important;
    border-bottom: none !important;
    border-radius: 10px 10px 0 0 !important;
  }

  .react-datepicker__current-month {
    color: white !important;
    font-weight: 600 !important;
  }

  .react-datepicker__day-name {
    color: white !important;
    font-weight: 500 !important;
  }

  .react-datepicker__navigation {
    top: 10px !important;
  }

  .react-datepicker__navigation--previous {
    border-right-color: white !important;
  }

  .react-datepicker__navigation--next {
    border-left-color: white !important;
  }

  .react-datepicker__day {
    &:hover {
      background: rgba(52, 152, 219, 0.1) !important;
      color: #2c3e50 !important;
    }
  }

  .react-datepicker__day--selected {
    background: #3498db !important;
    color: white !important;
  }

  .react-datepicker__day--today {
    background: rgba(52, 152, 219, 0.2) !important;
    color: #2c3e50 !important;
  }

  .react-datepicker__day--keyboard-selected {
    background: rgba(52, 152, 219, 0.3) !important;
    color: #2c3e50 !important;
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

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: rgba(248, 250, 252, 0.8);
  min-height: 100vh;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.h2`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  animation: ${slideIn} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const ControlsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
 
  &:last-child {
    margin-bottom: 0;
  }
 
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`

const ModeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
  position: relative;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  min-width: fit-content;
 
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  min-width: 200px;
  background: white;
  color: #2c3e50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  height: 50px;
 
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: rgba(52, 152, 219, 0.4);
  }

  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const DatePickerWrapper = styled.div`
  position: relative;
  z-index: 1001;

  .react-datepicker-wrapper {
    width: 200px;
    position: relative;
    z-index: 1001;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
 
  .react-datepicker__input-container {
    position: relative;
    z-index: 1001;

    input {
      padding: 14px 16px;
      border: 2px solid rgba(52, 152, 219, 0.2);
      border-radius: 12px;
      font-size: 1rem;
      width: 100%;
      background: white;
      color: #2c3e50;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      height: 50px;
      box-sizing: border-box;
      position: relative;
      z-index: 1001;
     
      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
        transform: translateY(-1px);
      }

      &:hover:not(:focus) {
        border-color: rgba(52, 152, 219, 0.4);
      }
    }
  }
`

const DateGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1000;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  flex: 1;
  position: relative;
  z-index: 1000;
 
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`

const Button = styled.button`
  padding: 14px 28px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  white-space: nowrap;

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
 
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #34495e 0%, #2980b9 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
 
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

const TableContainer = styled.div`
  margin-bottom: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-out 0.4s both;
  position: relative;
  z-index: 5;
`

const TableHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }
`

const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📊';
    font-size: 1.2rem;
  }
`

const DownloadButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
 
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
 
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  }
 
  th {
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.05), rgba(52, 152, 219, 0.05));
    font-weight: 600;
    color: #2c3e50;
    position: sticky;
    top: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
 
  tbody tr {
    transition: all 0.2s ease;
  }

  tbody tr:hover {
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.02), rgba(44, 62, 80, 0.02));
    transform: scale(1.001);
  }
 
  @media (max-width: 768px) {
    th, td {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }
  }
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out 0.3s both;
  position: relative;
  z-index: 5;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
  }
`

const StatTitle = styled.h4`
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  border: 2px dashed rgba(52, 152, 219, 0.3);
  position: relative;
  z-index: 5;

  &::before {
    content: '📋';
    display: block;
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`

export default function ReportView() {
  const [mode, setMode] = useState("date")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [reportData, setReportData] = useState({ register: [], billing: [] })
  const [loading, setLoading] = useState(false)

const fetchReport = async () => {
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = mode === "range" ? endDate.toISOString().split("T")[0] : startStr;

  setLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authorization token not found");
      return;
    }

    const res = await axios.get(`${ERbaseurl}erreports/`, {
      params: { start_date: startStr, end_date: endStr },
      headers: {
        Authorization: `${token}`,
      },
    });

    setReportData(res.data);
  } catch (err) {
    console.error("Fetch error", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReport()
  }, [])

  const exportToExcel = (rows, filename) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `${filename}.xlsx`)
  }

  const renderTable = (title, rows, filename) => (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          {title} ({rows.length} records)
        </TableTitle>
        <DownloadButton onClick={() => exportToExcel(rows, filename)}>
          📥 Download Excel
        </DownloadButton>
      </TableHeader>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td>
                  <strong style={{ color: '#2c3e50' }}>{r.patientname}</strong>
                </td>
                <td>{r.age} years</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    background: r.gender === 'Male' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    color: r.gender === 'Male' ? '#3498db' : '#e74c3c'
                  }}>
                    {r.gender}
                  </span>
                </td>
                <td>{r.mobilePhone || 'N/A'}</td>
                <td>{new Date(r.billDate || r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </TableContainer>
  )

  const totalPatients = reportData.register.length + reportData.billing.length;
  const uniquePatients = new Set([...reportData.register.map(p => p.patientname), ...reportData.billing.map(p => p.patientname)]).size;

  return (
    <>
      <GlobalDatePickerStyles />
      <Container>
        <Header> ER Patient Reports</Header>
       
        <ControlsContainer>
          <ControlRow>
            <ModeSection>
              <Label>📋 View Mode:</Label>
              <Select onChange={(e) => setMode(e.target.value)} value={mode}>
                <option value="date">📅 Single Date</option>
                <option value="range">📅 Date Range</option>
              </Select>
            </ModeSection>
          </ControlRow>

          <ControlRow>
            <DateSection>
              <DateRangeContainer>
                <DateGroup>
                  <Label>🗓️ {mode === "range" ? "Start Date" : "Select Date"}:</Label>
                  <DatePickerWrapper>
                    <DatePicker 
                      selected={startDate} 
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select date"
                      popperClassName="datepicker-popper"
                      popperPlacement="bottom-start"
                      showPopperArrow={true}
                    />
                  </DatePickerWrapper>
                </DateGroup>
               
                {mode === "range" && (
                  <DateGroup>
                    <Label>🗓️ End Date:</Label>
                    <DatePickerWrapper>
                      <DatePicker 
                        selected={endDate} 
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select end date"
                        popperClassName="datepicker-popper"
                        popperPlacement="bottom-start"
                        showPopperArrow={true}
                      />
                    </DatePickerWrapper>
                  </DateGroup>
                )}
              </DateRangeContainer>
            </DateSection>
            
            <ButtonContainer>
              <Button onClick={fetchReport} disabled={loading}>
                {loading ? '⏳' : '🔍'} {loading ? 'Loading...' : 'Generate Report'}
              </Button>
            </ButtonContainer>
          </ControlRow>
        </ControlsContainer>

        {(reportData.register.length > 0 || reportData.billing.length > 0) && (
          <StatsContainer>
            <StatCard>
              <StatTitle>Total Registered</StatTitle>
              <StatValue>{reportData.register.length}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Total Billed</StatTitle>
              <StatValue>{reportData.billing.length}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Unique Patients</StatTitle>
              <StatValue>{uniquePatients}</StatValue>
            </StatCard>
          </StatsContainer>
        )}

        {reportData.register.length > 0 && renderTable("👥 Registered Patients", reportData.register, "ER_Registered_Patients_Report")}
        {reportData.billing.length > 0 && renderTable("💰 Billed Patients", reportData.billing, "ER_Billed_Patients_Report")}
        
        {reportData.register.length === 0 && reportData.billing.length === 0 && !loading && (
          <EmptyState>
            No data found for the selected date{mode === "range" ? " range" : ""}
          </EmptyState>
        )}
      </Container>
    </>
  )
}
