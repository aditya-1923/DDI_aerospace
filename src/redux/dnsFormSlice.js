// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   AddDnsForm: {
//     changeFor: '',
//     domainName: null,
//     recordType: '',
//     businessAffected: '',
//     pointOfContact: '',
//     coordinatedChange: 'no',
//     migrationActivity: 'no',
//     businessImpact: '',
//     reason: '',
//     justification: '',
//     willCauseOutage: 'no',
//     disclaimer: false,
//   },
//   EditDnsForm: {
//     changeFor: '',
//     domainName: null,
//     recordType: '',
//     businessAffected: '',
//     pointOfContact: '',
//     coordinatedChange: 'no',
//     migrationActivity: 'no',
//     businessImpact: '',
//     reason: '',
//     justification: '',
//     willCauseOutage: 'no',
//     disclaimer: false,
//   }
// };

// const dnsFormSlice = createSlice({
//   name: 'dnsForm',
//   initialState,
//   reducers: {
//     setField: (state, action) => {
//       const { formName, field, value } = action.payload;
//       state[formName][field] = value;
//     },
//     resetForm: (state, action) => {
//       const formName = action.payload;
//       state[formName] = initialState[formName];
//     },
//     setMultipleFields: (state, action) => {
//       const { formName, fields } = action.payload;
//       state[formName] = { ...state[formName], ...fields };
//     },
//   },
// });

// export const { setField, resetForm, setMultipleFields } = dnsFormSlice.actions;
// export default dnsFormSlice.reducer;
