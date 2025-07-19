import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiRequest from "./ApiRequest"
const ERPatientEdit = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

const fetchData = async (date) => {
  const url = `${ERbaseurl}erregisteredit/?date=${date}`;

  const response = await apiRequest(url, "GET");

  if (response.success) {
    setData(response.data);
  } else {
    console.error("API Error:", response.error);
    // Optional: show toast or alert
  }
};

  const handleEdit = (record) => {
    navigate("/ERRegistration", { state: { record } });
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        overflow: "hidden"
      }}>
        {/* Header Section */}
        <div style={{
          background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
          padding: "30px 40px",
          color: "white"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <h1 style={{
                margin: "0 0 5px 0",
                fontSize: "2.5rem",
                fontWeight: "700",
                letterSpacing: "-0.5px"
              }}>
                ER Patient Edit
              </h1>
              <p style={{
                margin: "0",
                fontSize: "1.1rem",
                opacity: "0.9"
              }}>
                Emergency Room Patient Management
              </p>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "15px 20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)"
            }}>
              <label style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "white"
              }}>
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  background: "white",
                  color: "#2c3e50",
                  fontWeight: "500"
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ padding: "40px" }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  borderBottom: "2px solid #dee2e6"
                }}>
                  <th style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    letterSpacing: "0.5px"
                  }}>
                    ER Number
                  </th>
                  <th style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    letterSpacing: "0.5px"
                  }}>
                    Patient Name
                  </th>
                  <th style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    letterSpacing: "0.5px"
                  }}>
                    Doctor
                  </th>
                  <th style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    letterSpacing: "0.5px"
                  }}>
                    Created Date
                  </th>
                  <th style={{
                    padding: "18px 20px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "1rem",
                    letterSpacing: "0.5px"
                  }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={record.id} style={{
                    borderBottom: "1px solid #f1f3f4",
                    background: index % 2 === 0 ? "#ffffff" : "#fafbfc",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8f9ff";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? "#ffffff" : "#fafbfc";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}>
                    <td style={{
                      padding: "16px 20px",
                      color: "#2c3e50",
                      fontWeight: "500"
                    }}>
                      <span style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}>
                        {record.erNumber}
                      </span>
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#2c3e50",
                      fontWeight: "500"
                    }}>
                      {record.patientname}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#2c3e50",
                      fontWeight: "500"
                    }}>
                      {record.doctorName}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#6c757d",
                      fontSize: "0.9rem"
                    }}>
                      {new Date(record.created_date).toLocaleString()}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      textAlign: "center"
                    }}>
                      <button 
                        onClick={() => handleEdit(record)}
                        style={{
                          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                          color: "white",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 2px 4px rgba(40, 167, 69, 0.2)";
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.length === 0 && (
              <div style={{
                padding: "60px 40px",
                textAlign: "center",
                color: "#6c757d"
              }}>
                <div style={{
                  fontSize: "3rem",
                  marginBottom: "20px",
                  opacity: "0.3"
                }}>
                  📋
                </div>
                <h3 style={{
                  margin: "0 0 10px 0",
                  color: "#495057",
                  fontSize: "1.2rem"
                }}>
                  No records found
                </h3>
                <p style={{
                  margin: "0",
                  fontSize: "1rem"
                }}>
                  No ER patients registered for the selected date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPatientEdit;