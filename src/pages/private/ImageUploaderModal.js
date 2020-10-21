import React from 'react';
import Modal from 'react-modal';
import { MdBackup, MdClear, MdDone, MdErrorOutline } from 'react-icons/md';

import update from 'immutability-helper';

import Backend from 'logic/backend/Backend';
import Button from 'components/UI/Button';

import classes from './ImageUploaderModal.module.css';

const UPLOADING = "current";
const SUCCESS = "ok";
const ERROR = "error";

const STATUS_FIELD = "status";
const ERRORMSG_FIELD = "errorMsg";
const FILE_FIELD = "obj";

const maxMbFileSize = 10;
const fileSelectorId = 'file-selector';


export const processFilename = (str) => {
  const validateNumber = (number) => {
    return /^\d+$/.test(number);
  }
  const processSide = (side) => {
    switch(side.toLowerCase()) {
      case "a":
      case "front": {
        return "front";
      }
      case "b":
      case "back":{
        return "back";
      }
      default: {
        return null;
      }
    }
  }


  const out = {};

  try {
    const noExtension = str.split(".")[0];
    const noExtraInfo = noExtension.split("[")[0];
    const [number, noNumber] = noExtraInfo.split(" ");
    const nameWithSide = noNumber.split("_");
    const side = nameWithSide.pop();
    const name = nameWithSide.join(" ");

    if (!validateNumber(number)) {
      out["errorMsg"] = "Could not extract number from filename.";
      return out;
    }
    out["side"] =  processSide(side);
    if (!out["side"]) {
      out["errorMsg"] = "Could not extract side from filename.";
      return out;
    }

    out["number"] = number;
    out["name"] = name;

  } catch(error) {
    out["errorMsg"] = "Could not extract number and side from filename.";
  }

  return out;
}

const mapStatusIcon = (status) => {
  switch(status) {
    case (UPLOADING): {
      return <MdBackup />;
    }
    case (SUCCESS): {
      return <MdDone />;
    }
    case (ERROR): {
      return <MdErrorOutline />;
    }
    default: {
      return "--";
    }
  }
}

const mapFilesTable = (files) => {
  return (
    <table className={classes.Table}>
      <thead>
        <tr>
          <th>Status</th><th>Filename</th><th>Message</th>
        </tr>
      </thead>
      <tbody>
        {files.map(file => (
          <tr key={file.get(FILE_FIELD).name}>
            <td>{mapStatusIcon(file.get(STATUS_FIELD))}</td>
            <td>{file.get(FILE_FIELD).name}</td><td>{file.get(ERRORMSG_FIELD)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const getUploadingFields = () => [
  [STATUS_FIELD, UPLOADING],
  [ERRORMSG_FIELD, ""]
];

const getSuccessFields = () => [
  [STATUS_FIELD, SUCCESS],
  [ERRORMSG_FIELD, ""]
];

const getErrorFields = (msg) => [
  [STATUS_FIELD, ERROR],
  [ERRORMSG_FIELD, msg]
];

const applyFields = (file, fields) => update( file, {$add: fields} );

const resetState = { uploading: false, files: [], index: 0 };

class ImageUploaderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...resetState};
  }

  componentDidUpdate(prevProps, prevState) {
    const { prevUploading, prevIndex } = prevState;
    const { uploading, index, files } = this.state;

    if ( prevUploading !== uploading || prevIndex !== index ){
      if (uploading) {
        const file = new Map(files[index]);
        this.onUpload(file.get(FILE_FIELD))
          .then(response => this.onAdvanceUploadIndex(getSuccessFields()))
          .catch(error => this.onAdvanceUploadIndex(getErrorFields(error.message)));
      }
    }
  }

  onReset = () => {
    this.setState({...resetState});
  }

  onCloseModal = (closeFn) => {
    this.onReset();
    closeFn();
  }

  onChange = e => {
    const files = Array.from(e.target.files).map(file => new Map([
      [FILE_FIELD, file]
    ]));

    this.setState({ files: files, index: 0 });
  }

  onInitUpload = () => {
    const { index, files } = { ...this.state };

    files[index] = applyFields(files[index], getUploadingFields());

    this.setState({
      files: files,
      uploading: true
     });
  }

  onAdvanceUploadIndex = (fieldsPrevious) => {
    const { index, files, uploading } = { ...this.state };
    let newUploading = uploading;

    files[index] = applyFields(files[index], fieldsPrevious);

    if (index < files.length-1){
      files[index+1] = applyFields(files[index+1], getUploadingFields());
    } else {
      newUploading = false;
    }

    this.setState({
      files: files,
      index: index+1,
      uploading: newUploading
    });
  }

  onUpload = (file) => new Promise((resolve, reject) => {
    const types = ['image/png']

    if (types.every(type => file.type !== type)) {
      const msg = "Cannot upload: File is not PNG.";
      reject(new Error(msg));
      return;
    }

    if (file.size > maxMbFileSize * 1024 * 1024) {
      const msg = `Cannot upload: File is bigger than ${maxMbFileSize} Mb.`;
      reject(new Error(msg));
      return;
    }

    const { number, name, side, errorMsg } = processFilename(file.name);
    if (errorMsg) {
      reject(new Error(errorMsg));
      return;
    }

    const backend = new Backend();
    backend.upload_image(file, number, name, side)
    .then(response => {
      resolve();
    })
    .catch(error => {
      const msg = `Server error ${error.response.status}: ${error.response.data.message}`;
      reject(new Error(msg));
    })
  });

  onClickSelectFiles = () => {
    document.getElementById(fileSelectorId).click();
  }

  render() {
    const { isOpen, closeFn } = this.props;
    const { uploading, files, index } = this.state;
    const allowSelect = !uploading;
    const allowUpload = !uploading && files.length !== 0 && index === 0;

    let table = <p>No files selected.</p>;
    if (files.length > 0){
      table = mapFilesTable(files);
    }

    let uploadStatus = null;
    if (uploading) {
      const uploadStatusText = ["Processing ", index+1, " / ", files.length].join("");
      uploadStatus = <div className={[classes.Status, classes.Uploading].join(" ")}>
        {uploadStatusText}
      </div>
    } else if (index !== 0) {
      const uploadStatusText = ["Processed ", files.length, " images!"].join("");
      uploadStatus = <div className={[classes.Status, classes.Finished].join(" ")}>
        {uploadStatusText}
      </div>
    }

    return (
      <Modal
        isOpen={isOpen}
        contentLabel="Image uploader"
        style={{
          content: {
            height:"700px",
            margin: "auto",
            textAlign: "center",
          }
        }}
      >
        <MdClear
          className={classes.CloseModal}
          onClick={() => this.onCloseModal(closeFn)}
        />

        <input
          id={fileSelectorId}
          type='file'
          accept='.png'
          onChange={(e) => this.onChange(e)}
          multiple
          hidden
        />

        <Button
          buttonType="Success"
          clicked={() => this.onClickSelectFiles()}
          disabled={!allowSelect}
        >
          Select images to upload
        </Button>
        <Button
          buttonType="Success"
          clicked={() => this.onInitUpload()}
          disabled={!allowUpload}
        >
          Start upload
        </Button>

        {uploadStatus}

        <div className={classes.TableArea}>
          {table}
        </div>

      </Modal>
    )
  }
}

export default ImageUploaderModal;
