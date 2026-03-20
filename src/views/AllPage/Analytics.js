import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import DiseasePatients from './Analytics/DiseasePatients';
import MedicationPatients from './Analytics/MedicationPatients';
import MedicationCombination from './Analytics/MedicationCombination';
import DiseaseMedication from './Analytics/DiseaseMedication';
import CombinedDiseases from './Analytics/CombinedDiseases';
import AgeVsDiseaseChart from './Analytics/AgeVsDiseaseChart';
import AgeVsMedication from './Analytics/AgeVsMedication';
import AgeVsSex from './Analytics/AgeVsGender';

const Analytics = () => {
  const [content, setContent] = useState('disease');

  const tabs = [
    { label: 'Disease Patients', value: 'disease' },
    { label: 'Medication Patients', value: 'medication' },
    { label: 'Medication combination', value: 'combination' },
    { label: 'Disease Medication', value: 'diseasemedication' },
    { label: 'Combined diseases', value: 'combineddiseases' },
    // { label: 'Combination of Drugs', value: 'combinationofdrugs' },
    { label: 'Age vs Disease', value: 'agevsdisease' },
    { label: 'Age vs medication', value: 'agevsmedication' },
    { label: 'Age vs sex', value: 'agevssex' }
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
                background: active ? '#1ddec4' : '#fff',
                color: active ? '#fff' : '#64748b',
                border: 'none',
                transition: 'all 0.25s ease',
                transform: active ? 'scale(1.05)' : 'scale(1)',
                boxShadow: active ? '0 4px 14px rgba(29,222,196,0.4)' : '0 2px 10px rgba(0,0,0,0.05)'
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
      {content === 'combination' && <MedicationCombination />}
      {content === 'diseasemedication' && <DiseaseMedication />}
      {content === 'combineddiseases' && <CombinedDiseases />}
      {/* {content === 'combinationofdrugs' && <DiseaseMedication />} */}
      {content === 'agevsdisease' && <AgeVsDiseaseChart />}
      {content === 'agevsmedication' && <AgeVsMedication />}
      {content === 'agevssex' && <AgeVsSex />}
    </Box>
  );
};

export default Analytics;
