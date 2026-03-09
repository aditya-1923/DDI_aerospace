import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import MyRequest from "./pages/MyRequest/MyRequest";
import MyApprovals from "./pages/MyApproval/MyApprovals";
import AddDns from "./pages/AddDns/AddDns";
import MyDomains from "./pages/MyDomains/MyDomains";
import ModifyDnsPage from "./pages/EditDns/EditDns";
import MyIpamRequests from "./pages/Ipam/MyIpamRequests";
import IpReservationPage from "./pages/Ipam/StaticIpReservation";
import SubnetInfoPage from "./pages/Ipam/SubnetInfo";
import IpamFeedbackPage from "./pages/Ipam/IpamFeedBackPage";
import IpamFaq from "./pages/ipam/IpamFaq";
import BulkAddDnsPage from "./pages/BulkUplaodDns/BulkUplaodDns";
import DeleteDnsPage from "./pages/DeleteDns/DeleteDns";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          
          {/* DNS Route starts from here  */}
          <Route path="/my/dns-request" element={<MyRequest />} />
          <Route path="/my/approvals" element={<MyApprovals />} />
          <Route path="/my/domains" element={<MyDomains />} />          
          <Route path="add-dns" element={<AddDns />}/>
          <Route path="modify-dns" element={<ModifyDnsPage />}/>

          
          <Route path="delete-dns" element={<DeleteDnsPage />}/>
          
          <Route path="bulk-add-dns" element={<BulkAddDnsPage />}/>

          {/* IPAM Route starts from here */}
          <Route path="/ipam/requests" element={<MyIpamRequests />} />
          <Route path="/user/ip" element={<IpReservationPage />} />          
          <Route path="/subnet-info" element={<SubnetInfoPage />} />
          <Route path="/ipam/support" element={<IpamFeedbackPage />} />           
          <Route path="/ipam/faq" element={<IpamFaq />} /> 

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

