// import PropTypes from "prop-types";
// import React from "react";

// import { IconButton, InputBase, Paper } from "@mui/material";
// import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
// import SearchIcon from "@mui/icons-material/Search";

// import ProfileSection from "./ProfileSection";
// import logo from "assets/images/logo1.png";

// const Header = ({ drawerToggle }) => {
//   const today = new Date().toLocaleDateString();

//   return (
//     <div
//       style={{
//         width: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         height: "64px"
//       }}
//     >
//       {/* LEFT */}
//       <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//         <img src={logo} alt="logo" style={{ width: 34 }} />

//         <span
//           style={{
//             fontSize: "20px",
//             fontWeight: 600,
//             color: "#2d3436"
//           }}
//         >
//           Meditrek
//         </span>

//         <IconButton
//           onClick={drawerToggle}
//           style={{
//             background: "#f5f7fa",
//             marginLeft: "12px"
//           }}
//         >
//           <MenuTwoToneIcon style={{ color: "#1ddec4" }} />
//         </IconButton>

//         {/* Divider */}
//         <div
//           style={{
//             width: "1px",
//             height: "28px",
//             background: "#eaecef",
//             marginLeft: "8px"
//           }}
//         />

//         {/* Breadcrumb */}
//         <span
//           style={{
//             fontSize: "14px",
//             color: "#6c757d"
//           }}
//         >
//           Dashboard
//         </span>
//       </div>

//       {/* SEARCH */}
//       <Paper
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "4px 10px",
//           borderRadius: "8px",
//           background: "#f6f8fa",
//           width: "320px",
//           boxShadow: "none"
//         }}
//       >
//         <SearchIcon style={{ color: "#9aa0a6", fontSize: 20 }} />

//         <InputBase
//           placeholder="Search patients..."
//           style={{
//             marginLeft: "8px",
//             fontSize: "14px",
//             width: "100%"
//           }}
//         />
//       </Paper>

//       {/* RIGHT */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "16px"
//         }}
//       >
//         {/* Date (UI only) */}
//         <span
//           style={{
//             fontSize: "13px",
//             color: "#6c757d"
//           }}
//         >
//           {today}
//         </span>

//         {/* Existing avatar functionality */}
//         <ProfileSection />
//       </div>
//     </div>
//   );
// };

// Header.propTypes = {
//   drawerToggle: PropTypes.func
// };

// export default Header;

import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IconButton, InputBase, Paper } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import SearchIcon from "@mui/icons-material/Search";

import ProfileSection from "./ProfileSection";
import logo from "assets/images/logo1.png";
import { APP_PREFIX_PATH, Base_Url } from "../../../config";
import RefreshIcon from "@mui/icons-material/Refresh";

const Header = ({ drawerOpen, drawerToggle }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [patients, setPatients] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const token = sessionStorage.getItem("token");

    axios.get(`${Base_Url}get_all_patient`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success && res.data.patient !== "NA") {
          setPatients(res.data.patient);
        }
      });
  }, []);

  React.useEffect(() => {
    if (!search) {
      setFiltered([]);
      return;
    }

    const result = patients.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, patients]);

  const handleSelectPatient = (patient) => {
    setSearch("");
    setShowDropdown(false);

    sessionStorage.setItem("selectedPatientId", patient.user_id);

    window.dispatchEvent(new Event("patientChanged"));

    navigate(`${APP_PREFIX_PATH}/patients`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <img src={logo} alt="logo" style={{ width: 32 }} />

        {drawerOpen && (
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600
            }}
          >
            Meditrek
          </span>
        )}

        <IconButton
          onClick={drawerToggle}
          style={{ background: "#f5f7fa" }}
        >
          <MenuTwoToneIcon style={{ color: "#1ddec4" }} />
        </IconButton>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "8px",
            gap: "10px"
          }}
        >
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "#eaecef"
            }}
          />

          <span
            style={{
              fontSize: "14px",
              color: "#6c757d"
            }}
          >
            Dashboard
          </span>
        </div>
      </div>



      <div style={{ position: "relative" }}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            width: 320,
            background: "#f6f8fa",
            boxShadow: "none"
          }}
        >
          <SearchIcon sx={{ fontSize: 20, color: "#9aa0a6" }} />

          <InputBase
            placeholder="Search patients..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            sx={{ ml: 1, fontSize: "14px", flex: 1 }}
          />
        </Paper>

        {showDropdown && filtered.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "105%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
            }}
          >
            {filtered.map((p) => (
              <button
                key={p.user_id}
                onClick={() => handleSelectPatient(p)}
                style={{
                  width: "100%",
                  padding: "10px",
                  cursor: "pointer",
                  border: "none",
                  background: "#fff",
                  textAlign: "left",
                  borderBottom: "1px solid #f1f5f9"
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <IconButton
          onClick={toggleFullscreen}
          style={{ background: "#f5f7fa" }}
        >
          {isFullscreen ? (
            <FullscreenExitIcon style={{ color: "#6c757d" }} />
          ) : (
            <FullscreenIcon style={{ color: "#6c757d" }} />
          )}
        </IconButton>

        <IconButton
          onClick={handleRefresh}
          style={{ background: "#f5f7fa" }}
        >
          <RefreshIcon style={{ color: "#6c757d" }} />
        </IconButton>

        <ProfileSection />
      </div>
    </div >
  );
};

Header.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func
};

export default Header;