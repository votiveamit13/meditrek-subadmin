import { createSlice } from '@reduxjs/toolkit';

const timezoneSlice = createSlice({
  name: 'timezone',
  initialState: {
    value: 'UTC'
  },
  reducers: {
    setTimezone: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;