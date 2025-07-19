import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NiIsImVtYWlsIjoiY2FobmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJDaGFuZHJhIiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVAtRVJSRUctUlciLCJFUi1SLUVSTiIsIkZFLVAtRlVCLVJXIiwiRkUtUC1GR0wtUiIsIkZFLVAtRkFMLVIiLCJGRS1QLUZVUy1SVyIsIkZFLVAtRkctUlciLCJFUi1QLUVSUEItUlciLCJFUi1QLUVSQi1SVyIsIkZFLVAtRkdGLVIiLCJGRS1QLUZTQi1SVyIsIkVSLVAtRVJSRS1SVyIsIkVSLVAtRVJELVIiLCJGRS1QLUZTLVJXIiwiRkUtUC1GUi1SVyIsIkVSLVAtRVJQRC1SVyIsIkZFLVItRkEtUlciLCJFUi1QLUVSTkJOLVIiLCJFUi1QLUVSUC1SIiwiRkUtUC1GRi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzUyODk2Mzg3LCJleHAiOjE3NTI5ODI3ODcsImp0aSI6IjI1YmI3OThjLWJlNjQtNDMyMS1hNjM0LTM5YmE3MzJmMzUyNyJ9.L0O_31o3Rf_OhC4Qz5cFEf1sTCg0Qnnn4dLU3DNy7q8aQWewo_c0dfNDam1FcfDA--vaRZkd6yUDxH63pxyz04PiOgwg7Lq3i0S9P_2mBXsZq8Lm4Y98135oSTKPvzTNT2z-HXUFMtfgUCVZn47QRjQnr9rVslvXBUcZ1QN9ULGB66Dj4L3eA7cA8GaFGlemM6kK2bIEMo3LCN59kKj2BXDC-ok4oljZGeTgiZMO7C0UNqHZT_cXRqJ0G65IpZehulknww23_mPFEoZ6EyAjVGzSwTEUmCgI12m5pDTtFRclmfL444VivkvVpVquAwIbAYzMo8xnVeTC1my7wly_ZA";
  const selectedBranch = "SHB001";
  localStorage.setItem("access_token", dev_token);
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}
function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
function RootRenderer() {
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");
    // For local development environment
    if (!accessToken && process.env.REACT_APP_LOCAL_DEV_ENVIRONMENT === 'true') {
      accessToken = setForLocalDev();
    }

    try {
      if (!accessToken) throw new Error("No token found");
      const payload = validate(accessToken);

      // Store full payload as user_payload (for use elsewhere)
      localStorage.setItem("user_payload", JSON.stringify(payload));
      
      // Extract allowedActions as array (defensively)
      let allowedActions = [];
      if (Array.isArray(payload["allowed-actions"])) {
        allowedActions = payload["allowed-actions"];
      } else if (typeof payload["allowed-actions"] === "string") {
        try {
          allowedActions = JSON.parse(payload["allowed-actions"]);
        } catch {
          allowedActions = [payload["allowed-actions"]];
        }
      }

      // Determine role based on allowedActions
      let role = 'ER Nurse'; // Default fallback
      if (allowedActions.includes('ER-R-ERA')) {
        role = 'ER Admin';
      } else if (allowedActions.includes('ER-R-ERN')) {
        role = 'ER Nurse';
      }

      localStorage.setItem('role', role);
      setIsValidToken(true);

    } catch (err) {
      // Clean up any invalid tokens or roles
      console.error("Token validation failed:", err.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_payload");
      localStorage.removeItem("role");
    }
  }, []);

  return isValidToken ? (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ) : null;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);