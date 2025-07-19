import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// Animations
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled Components with Modern Design
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '300px' : '80px'};
  background: linear-gradient(145deg, #2c3e50 0%, #34495e 25%, #3498db 100%);
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow: hidden;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(52, 152, 219, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(155, 89, 182, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    width: ${props => props.isOpen ? '280px' : '70px'};
  }

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '100%' : '0px'};
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }

  @media (max-width: 480px) {
    width: ${props => props.isOpen ? '100vw' : '0px'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  flex-shrink: 0;
  position: relative;
  background: rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: 70px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
    min-height: 60px;
  }
`;

const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${props => props.isOpen ? slideInLeft : 'none'} 0.6s ease-out;

  @media (max-width: 768px) {
    opacity: 1;
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    gap: 8px;
  }
`;

const LogoIcon = styled.div`
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    padding: 6px;
    border-radius: 8px;
  }
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  min-width: 40px;
  min-height: 40px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 6px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 8px;
  }
`;

const Navigation = styled.nav`
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    padding: 16px 0;
  }
`;

const NavSection = styled.div`
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 16px 0;
  padding: 0 24px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;

  @media (max-width: 768px) {
    opacity: 1;
    padding: 0 20px;
    font-size: 0.75rem;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 0 16px;
    font-size: 0.7rem;
    margin-bottom: 10px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 4px 12px;
  border-radius: 16px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  backdrop-filter: ${props => props.active ? 'blur(10px)' : 'none'};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 0;
    background: linear-gradient(135deg, #fff, #ecf0f1);
    border-radius: 2px;
    opacity: ${props => props.active ? '1' : '0'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(8px);
    backdrop-filter: blur(10px);

    &::before {
      height: 24px;
      opacity: 1;
    }
  }

  ${props => props.active && `
    &::before {
      height: 32px;
    }
  `}

  @media (max-width: 768px) {
    padding: 14px 20px;
    margin: 3px 8px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    margin: 2px 6px;
    border-radius: 10px;
  }
`;

const NavIcon = styled.div`
  font-size: 1.3rem;
  margin-right: ${props => props.isOpen ? '16px' : '0'};
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    margin-right: 16px;
    font-size: 1.2rem;
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-right: 12px;
    min-width: 22px;
    min-height: 22px;
    border-radius: 6px;
  }
`;

const NavText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex: 1;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    opacity: 1;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MainContent = styled.div`
  margin-left: ${props => props.sidebarOpen ? '300px' : '80px'};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  position: relative;

  @media (max-width: 1200px) {
    margin-left: ${props => props.sidebarOpen ? '280px' : '70px'};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MobileMenuButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(44, 62, 80, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    transform: scale(1.1);
    box-shadow: 
      0 12px 35px rgba(44, 62, 80, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 480px) {
    top: 16px;
    left: 16px;
    padding: 12px;
    font-size: 1.1rem;
    border-radius: 10px;
  }
`;

const Badge = styled.span`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  animation: ${pulse} 2s infinite;

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    min-width: 18px;
    height: 18px;
    border-radius: 10px;
  }
`;

const UserInfo = styled.div`
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

const UserName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    opacity: 1;
    font-size: 0.85rem;
  }
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    opacity: 1;
    font-size: 0.7rem;
  }
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 12px;
  border-radius: 16px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(231, 76, 60, 0.2);
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    margin: 8px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    margin: 6px;
    border-radius: 10px;
  }
`;

const LogoutIcon = styled.div`
  font-size: 1.3rem;
  margin-right: ${props => props.isOpen ? '16px' : '0'};
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #e74c3c;
  border-radius: 8px;
  background: rgba(231, 76, 60, 0.1);

  @media (max-width: 768px) {
    margin-right: 16px;
    font-size: 1.2rem;
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-right: 12px;
    min-width: 22px;
    min-height: 22px;
    border-radius: 6px;
  }
`;

const LogoutText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  color: #e74c3c;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    opacity: 1;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage items

    
    // Navigate to login page
    navigate('/Login');
    
    // Close sidebar on mobile
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("user_name") || "User";

  const navigationItems = [];

  if (userRole === "ER Admin") {
    navigationItems.push(
      {
        section: 'Main',
        items: [{ path: '/Dashboard', icon: '📊', text: 'Dashboard' }]
      },
      {
        section: 'Emergency Department',
        items: [{ path: '/ReportView', icon: '📄', text: 'Reports' }]
      }
    );
  } else if (userRole === "ER Nurse") {
    navigationItems.push({
      section: 'Emergency Department',
      items: [
        { path: '/ERRegistration', icon: '🚨', text: 'ER Registration' },
        { path: '/ERPatientEdit', icon: '✏️', text: 'Patient Edit' },
        { path: '/ERBilling', icon: '💰', text: 'ER Billing' },
        { path: '/Printbill', icon: '🖨️', text: 'Print Bill' }
      ]
    });
  }

  return (
    <>
      {isMobile && (
        <MobileMenuButton onClick={toggleSidebar}>
          ☰
        </MobileMenuButton>
      )}
      
      <Overlay show={isMobile && isOpen} onClick={toggleSidebar} />
      
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo isOpen={isOpen}>
            {/* <LogoIcon>🏥</LogoIcon> */}
            {isOpen && <span>Emergency Room</span>}
          </Logo>
          <ToggleButton onClick={toggleSidebar}>
            {isOpen ? '←' : '→'}
          </ToggleButton>
        </SidebarHeader>

        {/* <UserInfo>
          <UserName isOpen={isOpen}>👤 {userName}</UserName>
          <UserRole isOpen={isOpen}>{userRole}</UserRole>
        </UserInfo> */}
        
        <Navigation>
          {navigationItems.map((section, sectionIndex) => (
            <NavSection key={sectionIndex}>
              <SectionTitle isOpen={isOpen}>
                {section.section}
              </SectionTitle>
              {section.items.map((item, itemIndex) => (
                <NavItem
                  key={itemIndex}
                  active={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <NavIcon isOpen={isOpen}>
                    {item.icon}
                  </NavIcon>
                  <NavText isOpen={isOpen}>
                    {item.text}
                  </NavText>
                  {item.path === '/ERRegistration' && (
                    <Badge>!</Badge>
                  )}
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Navigation>

        <LogoutButton onClick={handleLogout}>
          <LogoutIcon isOpen={isOpen}>
            🚪
          </LogoutIcon>
          <LogoutText isOpen={isOpen}>
            Logout
          </LogoutText>
        </LogoutButton>
      </SidebarContainer>
      
      <MainContent sidebarOpen={isOpen && !isMobile}>
        {children}
      </MainContent>
    </>
  );
};

export default Sidebar;
