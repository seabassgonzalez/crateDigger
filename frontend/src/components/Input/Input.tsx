import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

export const Input: React.FC<InputProps> = (props) => {
  return <TextField fullWidth variant="outlined" {...props} />;
};

export default Input;
