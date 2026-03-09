import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CSidebarToggler,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilCheckCircle,
  cilGlobeAlt,
  cilLayers,
  cilPlus,
  cilPencil,
  cilTrash,
  cilEthernet,
  cilIndustry,
  cilRouter,
  cilList,
  cilChatBubble,

  cilInfo,
  cilSearch

} from "@coreui/icons";


// import { cilChatBubble, cilQuestionCircle } from "@coreui/icons";

export default function Sidebar() {
  const location = useLocation();

  const dnsPaths = ["/add-dns", "/modify-dns", "/delete-dns", "/bulk-add-dns", "/my/dns-request", "/my/approvals", "/my/domains"]

  const isDnsSection = dnsPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const ipamPaths = ["/ipam", "/user/ip", "/subnet"];

  const isIpamSection = ipamPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const [ipamOpen, setIpamOpen] = useState(isIpamSection);

  return (
    <CSidebar className="border-end" style={{ height: "calc(100vh - 56px)" }}>

      <CSidebarNav>

        {/* My Request */}

        {isDnsSection && (
          <CNavItem>
            <NavLink to="/my/dns-request" className="nav-link">
              <CIcon icon={cilSpeedometer} className="nav-icon" />
              My Request
            </NavLink>
          </CNavItem>)}

        {/* My Approvals */}

        {isDnsSection && (
          <CNavItem>
            <NavLink to="/my/approvals" className="nav-link">
              <CIcon icon={cilCheckCircle} className="nav-icon" />
              My Approvals
            </NavLink>
          </CNavItem>
        )}

        {/* My Domains */}
        {isDnsSection && (
          <CNavItem>
            <NavLink to="/my/domains" className="nav-link">
              <CIcon icon={cilGlobeAlt} className="nav-icon" />
              My Domains
            </NavLink>
          </CNavItem>
        )}

        {/* DNS Request Dropdown */}
        {isDnsSection && (
          <CNavGroup
            toggler={
              <>
                <CIcon icon={cilLayers} className="nav-icon" />
                DNS Request
              </>
            }
          >
            <CNavItem>
              <NavLink to="/add-dns" className="nav-link">
                <CIcon icon={cilPlus} className="nav-icon-bullet me-1" />
                Add
              </NavLink>
            </CNavItem>

            <CNavItem>
              <NavLink to="/modify-dns" className="nav-link">
                <CIcon icon={cilPencil} className="nav-icon-bullet me-1" />
                Modify
              </NavLink>
            </CNavItem>

            <CNavItem>
              <NavLink to="/delete-dns" className="nav-link">
                <CIcon icon={cilTrash} className="nav-icon-bullet me-1" />
                Delete
              </NavLink>
            </CNavItem>

            <CNavItem>
              <NavLink to="/bulk-add-dns" className="nav-link">
                <CIcon icon={cilLayers} className="nav-icon-bullet me-1" />
                Bulk
              </NavLink>
            </CNavItem>
          </CNavGroup>
        )}
        {/* IPAM Dropdown */}

        {isIpamSection && (
          // <CNavGroup
          //   toggler={
          //     <>
          //       <CIcon icon={cilLayers} className="nav-icon" />
          //       IPAM Request
          //     </>
          //   }
          //   visible={ipamOpen}
          //   onClick={() => setIpamOpen(!ipamOpen)}
          // >
          <CNavItem>
            <NavLink to="/ipam/requests" className="nav-link">
              <CIcon icon={cilList} className="nav-icon-bullet me-1" />
              My Requests
            </NavLink>
          </CNavItem>
        )}
        {isIpamSection && (
          <CNavItem>
            <NavLink to="/user/ip" className="nav-link">
              <CIcon icon={cilRouter} className="nav-icon-bullet me-1" />
              Static IP
            </NavLink>
          </CNavItem>
        )}
        {isIpamSection && (
          <CNavItem>
            <NavLink to="/subnet-info" className="nav-link">
              <CIcon icon={cilEthernet} className="nav-icon-bullet me-1" />
              SubNet Info
            </NavLink>
          </CNavItem>
        )}
        {isIpamSection && (
          <CNavItem>
            <NavLink to="/ipam/support" className="nav-link">
              <CIcon icon={cilChatBubble} className="nav-icon-bullet me-1" />
              Feedback
            </NavLink>
          </CNavItem>
        )}
        {isIpamSection && (
          <CNavItem>
            <NavLink to="/ipam/faq" className="nav-link">
              <CIcon icon={cilInfo} className="nav-icon-bullet me-1" />
              FAQ
            </NavLink>
          </CNavItem>

          // </CNavGroup>
        )}
        {/* Advance Dropdown */}
        {isDnsSection && (
          <CNavGroup
            toggler={
              <>
                <CIcon icon={cilLayers} className="nav-icon" />
                Advance
              </>
            }
          >
            <CNavItem>
              <NavLink to="/domownsearch" className="nav-link">
                <CIcon icon={cilSearch} className="nav-icon-bullet me-1" />
                Search Domain Owner
              </NavLink>
            </CNavItem>

          </CNavGroup>
        )}
      </CSidebarNav>
    </CSidebar>
  );
}





