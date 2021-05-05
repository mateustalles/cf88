import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const CF88Context = createContext();

export default function CF88Provider({ children }) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalItem, setModalItem] = useState();
  const [modalHeaders, setModalHeaders] = useState();
  const [modalType, setModalType] = useState('update');
  const [sheet, setSheet] = useState('teses-sem-repercussao-geral')
  const [oAuth2Token, setOAuth2Token] = useState({});

  const store = {
    editionModal: [
      [displayModal, setDisplayModal],
      [modalItem, setModalItem],
      [modalHeaders, setModalHeaders],
      [modalType, setModalType],
    ],
    cpTable: [
      sheet, setSheet,
    ],
    gOAuth2: [
      oAuth2Token, setOAuth2Token,
    ]
  };

  return <CF88Context.Provider value={store}>{children}</CF88Context.Provider>;
}

CF88Provider.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
