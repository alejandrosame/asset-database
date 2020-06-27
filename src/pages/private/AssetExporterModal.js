import React, {useState} from 'react';
import Modal from 'react-modal';
import {notify} from 'react-notify-toast';

import Backend from 'logic/backend/Backend';
import { getErrorMessage } from 'logic/shared/utility';

import AddModalSection from 'components/UI/AddModalSection';
import Spinner from 'components/UI/Spinner/Spinner';

const downloadCSVFile = (content, filename) => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: 'text/csv;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
}

const AssetExporterModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);

    const b = new Backend();
    b.export_assets()
      .then(response => {
        console.log(response.data);
        downloadCSVFile(response.data, "assets.csv");
        notify.show('Assets exported succesfully', 'success')
      })
      .catch(error => {
        const msg = getErrorMessage(error);
        notify.show(`Error found while exporting assets: ${msg}`, 'error');
      })
      .finally(() => setIsOpen(false));
  }

  return (
    <React.Fragment>
      <AddModalSection text="Export assets as CSV file" clicked={handleOpenModal} />
      <Modal
        isOpen={isOpen}
        contentLabel="Asset exporter"
        style={{
          content: {
            height:"250px",
            width:"250px",
            margin: "auto",
            textAlign: "center",
          }
        }}
        >
          <div>Processing CSV file</div>
          <Spinner />
      </Modal>
    </React.Fragment>
  )
}

export default AssetExporterModal;
