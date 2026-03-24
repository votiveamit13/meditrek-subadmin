import React from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(() => ({
  borderRadius: 12,
  height: "100%",
  background: "#fff",
  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  transition: "all .25s ease",
  // cursor: "pointer",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
  }
}));

const IconBox = styled(Box)(({ color }) => ({
  width: 42,
  height: 42,
  borderRadius: 10,
  background: `${color}20`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: color
}));

const Growth = styled(Box)(() => ({
  fontSize: 12,
  marginTop: 6,
  color: "#6b7280"
}));

const ReportCard = ({ primary, secondary, iconPrimary: Icon, color, loading, growth }) => {
  const value = parseFloat(growth);
  const isPositive = value > 0;
  const isZero = value === 0;
  return (
    <StyledCard>
      <CardContent
        sx={{
          p: 2
        }}
      >
        {/* Top Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontWeight: 600
            }}
          >
            {secondary}
          </Typography>

          <IconBox color={color}>
            <Icon sx={{ fontSize: 20 }} />
          </IconBox>
        </Box>

        {/* Stat */}
        {loading ? (
          <CircularProgress size="20px" />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827"
            }}
          >
            {primary}
          </Typography>
        )}

        {/* Growth */}
        <Growth>
          <span
            style={{
              color: isZero
                ? "#6b7280"
                : isPositive
                  ? "#16a34a"
                  : "#dc2626",
              fontWeight: 700
            }}
          >
            {isPositive ? "+" : ""}
            {isNaN(value) ? 0 : value}%
          </span>{" "}
          from last week
        </Growth>
      </CardContent>
    </StyledCard>
  );
};

export default ReportCard;