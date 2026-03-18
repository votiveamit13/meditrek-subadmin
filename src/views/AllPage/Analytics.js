import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import DiseasePatients from './Analytics/DiseasePatients';
import MedicationPatients from './Analytics/MedicationPatients';
import MedicationCombination from './Analytics/MedicationCombination';

const Analytics = () => {
  const [content, setContent] = useState('disease');

  const tabs = [
    { label: 'Disease Patients', value: 'disease' },
    { label: 'Medication Patients', value: 'medication' },
    { label: 'Medication combination', value: 'combination' }
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Analytics
      </Typography>

      {/* TABS */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const active = content === tab.value;

          return (
            <Box
              key={tab.value}
              role="button"
              tabIndex={0}
              onClick={() => setContent(tab.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setContent(tab.value);
                }
              }}
              style={{
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '13px',
                background: active ? '#1ddec4' : '#eef2f7',
                color: active ? '#fff' : '#64748b',
                border: 'none',
                transition: 'all 0.25s ease',
                transform: active ? 'scale(1.05)' : 'scale(1)',
                boxShadow: active ? '0 4px 14px rgba(29,222,196,0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Box>

      {/* CONTENT */}
      {content === 'disease' && <DiseasePatients />}
      {content === 'medication' && <MedicationPatients />}
      {content === "combination" && <MedicationCombination />}
    </Box>
  );
};

export default Analytics;
