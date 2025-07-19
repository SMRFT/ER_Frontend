import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import GlobalStyle from "./GlobalStyle";

// Environment-based base URL
const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

useEffect(() => {
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await axios.get(`${ERbaseurl}dashboard/?billDate=${selectedDate}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setData(response.data);
    } catch (err) {
      console.error("Error fetching ER dashboard data:", err);
    }
  };

  fetchPatients();
}, [selectedDate]);

  const procedures = data.flatMap((item) => {
  const billItems = typeof item.billType === "string"
    ? JSON.parse(item.billType)
    : item.billType;

  return billItems.map((p) => ({
    name: p.name,
    quantity: p.quantity,
    unitRate: p.unitRate,
    total: p.amount,
  }));
});

  const groupedProcedures = procedures.reduce((acc, item) => {
    const key = item.name;
    if (!acc[key]) {
      acc[key] = { ...item };
    } else {
      acc[key].quantity += item.quantity;
      acc[key].total += item.total;
    }
    return acc;
  }, {});

  const procedureSummary = Object.entries(groupedProcedures).map(([name, value]) => ({
    name,
    ...value,
  }));

  const doctorStats = data.reduce((acc, item) => {
    const key = item.doctorName;
    if (!acc[key]) {
      acc[key] = {
        totalAmount: parseFloat(item.totalAmount),
        discountedAmount: parseFloat(item.discountedAmount),
      };
    } else {
      acc[key].totalAmount += parseFloat(item.totalAmount);
      acc[key].discountedAmount += parseFloat(item.discountedAmount);
    }
    return acc;
  }, {});

  const doctorSummary = Object.entries(doctorStats).map(([name, value]) => ({
    doctorName: name,
    ...value,
  }));

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <DashboardIcon>🏥</DashboardIcon>
              <h2>ER Dashboard</h2>
            </TitleSection>
            <DatePickerContainer>
              <DateIcon>📅</DateIcon>
              <StyledDateInput
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </DatePickerContainer>
          </HeaderContent>
        </Header>

        <StatsSection>
          <StatCard color="#2c3e50">
            <StatIcon>👥</StatIcon>
            <StatContent>
              <h4>Total Patients</h4>
              <p>{data.length}</p>
            </StatContent>
          </StatCard>
          <StatCard color="#3498db">
            <StatIcon>🩺</StatIcon>
            <StatContent>
              <h4>Total Procedures</h4>
              <p>{procedures.length}</p>
            </StatContent>
          </StatCard>
          <StatCard color="#2980b9">
            <StatIcon>👨‍⚕️</StatIcon>
            <StatContent>
              <h4>Total Doctors</h4>
              <p>{Object.keys(doctorStats).length}</p>
            </StatContent>
          </StatCard>
          <StatCard color="#34495e">
            <StatIcon>💰</StatIcon>
            <StatContent>
              <h4>Total Revenue</h4>
              <p>
                ₹
                {data.reduce(
                  (sum, item) => sum + parseFloat(item.discountedAmount || 0),
                  0
                ).toLocaleString()}
              </p>
            </StatContent>
          </StatCard>
        </StatsSection>

        <ContentGrid>
          <Section>
            <SectionHeader>
              <SectionIcon>📋</SectionIcon>
              <h3>Procedure Summary</h3>
            </SectionHeader>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Procedure</th>
                    <th>Qty</th>
                    <th>Unit Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {procedureSummary.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <ProcedureCell>
                          <ProcedureIcon>🔬</ProcedureIcon>
                          {item.name}
                        </ProcedureCell>
                      </td>
                      <td>
                        <QuantityBadge>{item.quantity}</QuantityBadge>
                      </td>
                      <td>₹{item.unitRate?.toLocaleString()}</td>
                      <td>
                        <AmountCell>₹{item.total?.toLocaleString()}</AmountCell>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>👨‍⚕️</SectionIcon>
              <h3>Doctor Revenue Summary</h3>
            </SectionHeader>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Total Amount</th>
                    <th>Discounted Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorSummary.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <DoctorCell>
                          <DoctorAvatar>👨‍⚕️</DoctorAvatar>
                          {item.doctorName}
                        </DoctorCell>
                      </td>
                      <td>₹{item.totalAmount?.toLocaleString()}</td>
                      <td>
                        <GreenBadge>₹{item.discountedAmount?.toLocaleString()}</GreenBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Section>
        </ContentGrid>

        <Section>
          <SectionHeader>
            <SectionIcon>🧾</SectionIcon>
            <h3>Patient Billing Details</h3>
          </SectionHeader>
          <TableContainer>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>ER No</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Bill No</th>
                  <th>Bill Date</th>
                  <th>Procedures</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th>Final Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((patient, idx) => (
                  <tr key={idx}>
                    <td>
                      <ERBadge>{patient.erNumber}</ERBadge>
                    </td>
                    <td>
                      <PatientCell>
                        <PatientIcon>👤</PatientIcon>
                        {patient.patientname}
                      </PatientCell>
                    </td>
                    <td>
                      <DoctorCell>
                        <DoctorAvatar>👨‍⚕️</DoctorAvatar>
                        {patient.doctorName}
                      </DoctorCell>
                    </td>
                    <td>
                      <BillBadge>{patient.billNumber}</BillBadge>
                    </td>
                    <td>
                      <DateCell>
                        <DateIcon>📅</DateIcon>
                        {new Date(patient.billDate).toLocaleDateString()}
                      </DateCell>
                    </td>
                    <td>
                      <ProcedureList>
                        {(typeof patient.billType === "string"
          ? JSON.parse(patient.billType)
          : patient.billType
        ).map((item, i) => (
          <ProcedureItem key={i}>
            <ProcedureIcon>🔬</ProcedureIcon>
            {item.name} (Qty: {item.quantity}, ₹{item.unitRate})
          </ProcedureItem>
        ))}
                      </ProcedureList>
                    </td>
                    <td>₹{parseFloat(patient.totalAmount)?.toLocaleString()}</td>
                    <td>
                      <DiscountBadge>₹{parseFloat(patient.discount)?.toLocaleString()}</DiscountBadge>
                    </td>
                    <td>
                      <GreenBadge>₹{parseFloat(patient.discountedAmount)?.toLocaleString()}</GreenBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ResponsiveTable>
          </TableContainer>
        </Section>
      </AppContainer>
    </>
  );
};

export default Dashboard;

// Styled Components with Blue Theme

const AppContainer = styled.div`
  padding: 1rem;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    font-size: 2rem;
    margin: 0;
  }
`;

const DashboardIcon = styled.span`
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
`;

const DateIcon = styled.span`
  font-size: 1.2rem;
  color: #2c3e50;
`;

const StyledDateInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || '#3498db'};
    border-radius: 20px 20px 0 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.span`
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const StatContent = styled.div`
  h4 {
    color: #6B7280;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 2rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(52, 152, 219, 0.1);

  h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`;

const SectionIcon = styled.span`
  font-size: 1.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  th {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.875rem;
  }

  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(52, 152, 219, 0.05);
    }
  }
`;

const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    font-size: 0.875rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
`;

const ProcedureCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProcedureIcon = styled.span`
  font-size: 1rem;
`;

const QuantityBadge = styled.span`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const AmountCell = styled.span`
  font-weight: 600;
  color: #1F2937;
`;

const DoctorCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DoctorAvatar = styled.span`
  font-size: 1.25rem;
  border-radius: 50%;
  padding: 0.25rem;
  filter: grayscale(100%) brightness(0) invert(1);
`;

const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PatientIcon = styled.span`
  font-size: 1.25rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 50%;
  padding: 0.25rem;
  filter: grayscale(100%) brightness(0) invert(1);
`;

const ERBadge = styled.span`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const BillBadge = styled.span`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const ProcedureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProcedureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(52, 152, 219, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
`;

const GreenBadge = styled.span`
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const DiscountBadge = styled.span`
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
`;
