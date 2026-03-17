// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// // ==============================|| REPORT CARD ||============================== //

// const ReportCard = ({ primary, secondary, iconPrimary, color, footerData, iconFooter }) => {
//   const theme = useTheme();
//   const IconPrimary = iconPrimary;
//   const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
//   const IconFooter = iconFooter;
//   const footerIcon = iconFooter ? <IconFooter /> : null;

//   return (
//     <Card>
//       <CardContent>
//         <Grid container justifyContent="space-between" alignItems="center">
//           <Grid item>
//             <Typography variant="h3" sx={{ color: color }}>
//               {primary}
//             </Typography>
//             <Typography variant="subtitle1" sx={{ marginTop: '.5rem' }}>
//               {secondary}
//             </Typography>
//           </Grid>
//           <Grid item>
//             <Typography variant="h2" sx={{ color: color }}>
//               {primaryIcon}
//             </Typography>
//           </Grid>
//         </Grid>
//       </CardContent>
//       <Box sx={{ background: color }}>
//         <Grid
//           container
//           justifyContent="space-between"
//           sx={{
//             textAlign: 'center',
//             padding: theme.spacing(1.2),
//             pl: 2.5,
//             pr: 2.5,
//             color: theme.palette.common.white
//           }}
//         >
//           <Grid item>
//             <Typography variant="body2">{footerData}</Typography>
//           </Grid>
//           <Grid item>
//             <Typography variant="body2">{footerIcon}</Typography>
//           </Grid>
//         </Grid>
//       </Box>
//     </Card>
//   );
// };

// ReportCard.propTypes = {
//   primary: PropTypes.string,
//   secondary: PropTypes.string,
//   iconPrimary: PropTypes.object,
//   footerData: PropTypes.string,
//   iconFooter: PropTypes.object,
//   color: PropTypes.string
// };

// export default ReportCard;

// ==============================================
// 12/03

// import React from "react";
// import { Card, CardContent, Typography, Box } from "@mui/material";
// import { styled } from "@mui/system";

// const StyledCard = styled(Card)(() => ({
//   borderRadius: 16,
//   padding: 0,
//   height: "100%",
//   position: "relative",
//   overflow: "hidden",
//   boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
//   transition: "all 0.3s ease",

//   "&:hover": {
//     transform: "translateY(-6px)",
//     boxShadow: "0 18px 40px rgba(0,0,0,0.12)"
//   }
// }));

// const IconWrapper = styled(Box)(({ color }) => ({
//   width: 40,
//   height: 40,
//   borderRadius: 14,
//   background: color,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   color: "#fff",
//   boxShadow: `0 6px 18px ${color}55`
// }));

// const BottomBar = styled(Box)(({ color }) => ({
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   width: "100%",
//   height: 6,
//   background: color
// }));

// const ReportCard = ({ primary, secondary, iconPrimary: Icon, color }) => {
//   return (
//     <StyledCard>
//       <CardContent>
//         <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>

//           <Box>
//             <Typography
//               variant="h3"
//               sx={{ fontWeight: 700, color: "#1c1c1c" }}
//             >
//               {primary}
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{ color: "#6b7280", mt: 1,fontWeight:'500' }}
//             >
//               {secondary}
//             </Typography>
//           </Box>

//           <IconWrapper color={color}>
//             <Icon />
//           </IconWrapper>

//         </Box>
//       </CardContent>

//       <BottomBar color={color} />
//     </StyledCard>
//   );
// };

// export default ReportCard;

// ================================
// 13/03

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(() => ({
  borderRadius: 8,
  height: "100%",
  position: "relative",
  overflow: "visible",
  background: "#fff",
  //  background: "linear-gradient(135deg,#0f766e,#14b8a6)",
  // background:"#0E7C86",
   color:"#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  transition: "all .3s ease",


  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
  }
}));

const IconWrapper = styled(Box)(({ color }) => ({
  position: "absolute",
  top: -22,
  left: 20,
  width: 50,
  height: 50,
  borderRadius: 8,
  // background: "linear-gradient(135deg,#0f766e,#14b8a6)",
  // background:"#9eeaf9",
  background:"#1DDEC4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  // color:"#0E7C86",
  boxShadow: `0 10px 30px ${color}55 !important`,
  zIndex: 9,
}));

const ReportCard = ({ primary, secondary, iconPrimary: Icon, color }) => {
  return (
    <StyledCard>

      {/* Floating Icon */}
      <IconWrapper color={color}>
        <Icon sx={{fontSize:"22px"}} />
      </IconWrapper>

      <CardContent sx={{ pt: 3,pb:3,pl:3,pr:3,borderRadius:"6px" }}>

  <Box display="flex" justifyContent="space-between" alignItems="flex-end" flexDirection="column">

    {/* Left Text */}
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
          fontWeight: 500,
          mb: 0.5
        }}
      >
        {secondary}
      </Typography>
    </Box>
    {/* Right Count */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#111827"
      }}
    >
      {primary}
    </Typography>

  </Box>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 400,
        color: "#111827",
        fontSize:"12px",
        marginTop:"12px"
      }}
    >
    <span style={{color:"#1DDEC4"}}> <span style={{fontWeight:700}}>+55%</span>  </span>than last week
    </Typography>

</CardContent>

    </StyledCard>
  );
};

export default ReportCard;


