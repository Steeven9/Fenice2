import { JsonForms } from '@jsonforms/react';
import React, { useContext, useState } from 'react';
import schema from '../../form/trackerSchema.json';
import uischema from '../../form/trackerUISchema.json';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { SocketContext } from '../../SocketContext';

const Form = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const handleChange = (data) => {
    setFormData(data);
  };

  // TODO read from localStorage without exploding

  const registerInitiative = () => {
    if (formData.errors.length > 0) {
      alert('There are errors in the form');
    } else {
      localStorage['playerData'] = JSON.stringify(formData.data);
      socket.emit('registerInitiative', [formData.data]);
      dispatch({
        type: 'SET_PLAYER_DATA',
        payload: formData.data,
      });
    }
  };

  return (
    <>
      <JsonForms
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={handleChange}
      />
      <Button sx={{ mt: '20px', mr: '20px' }} variant="contained" onClick={registerInitiative}>
        Submit
      </Button>
    </>
  );
};

export default Form;
