import { createGlobalStyle } from "styled-components"
import styled from "styled-components"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: center;
    margin-bottom: 20px;
    color: #3498db;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  }

  button {
    background: #3498db;  
    color: rgb(240, 238, 238);
    border: none;
    padding: 10px 16px;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #2980b9;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  input, textarea, select {
    font-family: 'Poppins', sans-serif;
  }

  .required {
    color: #dc3545;
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
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
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

export default GlobalStyle