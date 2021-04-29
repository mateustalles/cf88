import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const CF88Context = createContext();

export default function CF88Provider({ children }) {


  const store = {

  };

  return <CF88Context.Provider value={store}>{children}</CF88Context.Provider>;
}

CF88Provider.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
