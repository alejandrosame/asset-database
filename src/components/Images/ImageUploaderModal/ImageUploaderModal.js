import React from 'react';
import Modal from 'react-modal';
import { MdClear } from 'react-icons/md';

import update from 'immutability-helper';

import Backend from '../../../Backend/Backend';
import Button from '../../UI/Button/Button';

import classes from './ImageUploaderModal.module.css';

const UPLOADING = "current";
const SUCCESS = "ok";
const ERROR = "error";

const STATUS_FIELD = "status";
const ERRORMSG_FIELD = "errorMsg";
const FILE_FIELD = "obj";

const maxMbFileSize = 10;
const fileSelectorId = 'file-selector';


/*
{imageList.map((image) => {
  const filename_splitted = image.file.name.split(" ");
  const name_splitted = filename_splitted[1].split("_");
  const number = filename_splitted[0]
  const name = name_splitted.slice(0,-1).join(" ");
  const side = name_splitted.slice(-1)[0].split(".")[0];
  return (
    <div className={classes.ImageContainer} key={image.key}>
      <img src={image.dataURL} alt={image.key} />
      <div>{number}</div>
      <div>{name}</div>
      <div>{capitalize(processSide(side))}</div>
      <div className={classes.RemoveButton} onClick={image.onRemove} >
        x
      </div>
    </div>
  )
})}
 */

const mapStatusIcon = (status) => {
  switch(status) {
    case (UPLOADING): {
      return "->";
    }
    case (SUCCESS): {
      return "v";
    }
    case (ERROR): {
      return "x";
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

const resetState = { uploading: false, files: [], index: 0 };

class ImageUploaderModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {...resetState};
  }

  applyStatus = (id, status) => {

  }

  onReset = () => {
    this.setState({...resetState});
  }

  onCloseModal = (closeFn) => {
    this.onReset();
    closeFn();
  }

  onChange = e => {
    const errs = []
    const files = Array.from(e.target.files).map(file => new Map([
      [FILE_FIELD, file]
    ]));

    console.log(files);
    this.setState({ files: files, index: 0 });
  }

  onInitUpload = () => {
    const { index, files } = { ...this.state };

    const fileStatusAdded = update(
      files[index],
      {$add: getUploadingFields() }
    );

    files[index] = fileStatusAdded;

    this.setState({
      files: files,
      uploading: true
     });
  }

  onAdvanceUploadIndex = () => {
    const { index } = { ...this.state };

    this.setState({ index: index+1 });
  }

  onUpload = () => {
    this.onInitUpload();
    return;
    const { files } = this.state;

    const formData = new FormData()
    const types = ['image/png']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        //errs.push(`'${file.type}' is not a supported format`)
        return;
      }

      if (file.size > maxMbFileSize * 1024 * 1024) {
        //errs.push(`'${file.name}' is larger than ${maxMbFileSize}MB, please pick a smaller file`)
        return;
      }

      formData.append(i, file)
    })

    this.setState({ uploading: true })

    const backend = new Backend();
    backend.upload_image(formData)
    .then(response => {
      this.setState({
        uploading: false
      })
    })
    .catch(err => {
      err.json().then(e => {
        this.setState({ uploading: false })
      })
    })
  }

  onClickSelectFiles = () => {
    document.getElementById(fileSelectorId).click();
  }

  render() {
    const { isOpen, closeFn } = this.props;
    const { uploading, files, index } = this.state;
    const allowSelect = !uploading;
    const allowUpload = !uploading && files.length !== 0;

    let table = <p>No files selected.</p>;
    if (files.length > 0){
      table = mapFilesTable(files);
    }

    let uploadStatus = null;
    if (uploading) {
      const uploadingText = ["Uploading ", index+1, " / ", files.length].join("");
      uploadStatus = <div className={[classes.Status, classes.Uploading].join(" ")}>
        {uploadingText}
      </div>
    } else if (index !== 0) {
      uploadStatus = <div className={[classes.Status, classes.Uploading].join(" ")}>
        Finished uploading!
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
          clicked={() => this.onUpload()}
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
