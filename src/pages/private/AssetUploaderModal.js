import React from 'react';
import { MdBackup, MdClear, MdDone, MdErrorOutline } from 'react-icons/md';
import Modal from 'react-modal';
import {notify} from 'react-notify-toast';
import update from 'immutability-helper';

import Backend from 'logic/backend/Backend';
import { capitalize, splitCSVLine } from 'logic/shared/utility';

import AddModalSection from 'components/UI/AddModalSection';
import Button from 'components/UI/Button';

import classes from './AssetUploaderModal.module.css';

const UPLOADING = "current";
const SUCCESS = "ok";
const ERROR = "error";

const STATUS_FIELD = "status";
const ERRORMSG_FIELD = "errorMsg";
const OBJ_FIELD = "obj";
const ASSET_FIELDS = ["number", "name", "order", "printSize", "displaySize", "product",
"tags", "notes", "related"];

const maxMbFileSize = 10;
const fileSelectorId = 'file-selector';

const readCSV = (file) => new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = function(e) {
        const lines = reader.result.split("\n");
        const [headerLine, ...assetLines] = lines;

        // Process headers
        const headers = splitCSVLine(headerLine);
        const indexer = {};
        for (const required_header of ASSET_FIELDS) {
          const index = headers.indexOf(required_header);
          if (index < 0) {
            const msg = `Required header "${required_header}" not found in CSV first line. The complete list of required headers is [${ASSET_FIELDS.join(",")}].`;
            reject(msg);
          }
          indexer[index] = required_header;
        }

        resolve(assetLines.reduce((acc, line) => {
          if (line !== "") {
            const asset = {};
            for (const [index, value] of splitCSVLine(line).entries()) {
              asset[indexer[index]] = value;
            }
            acc.push(asset)
          }
          return acc;
        }, []));
      }

      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  }
);

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

const mapAssetsTable = (assets) => {
  return (
    <table className={classes.Table}>
      <thead>
        <tr>
          <th>Status</th>
          {ASSET_FIELDS.map(field => <th key={field}>{capitalize(field)}</th>)}
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(asset => (
          <tr key={[asset.get(OBJ_FIELD).number, asset.get(OBJ_FIELD).order]}>
            <td>{mapStatusIcon(asset.get(STATUS_FIELD))}</td>
            {ASSET_FIELDS.map(field => <td key={field}>{asset.get(OBJ_FIELD)[field]}</td>)}
            <td>{asset.get(ERRORMSG_FIELD)}</td>
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

const applyFields = (asset, fields) => update( asset, {$add: fields} );

const resetState = { isOpen: false, uploading: false, assets: [], index: 0 };

class AssetUploaderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...resetState};
  }

  componentDidUpdate(prevProps, prevState) {
    const { prevUploading, prevIndex } = prevState;
    const { uploading, index, assets } = this.state;

    if ( prevUploading !== uploading || prevIndex !== index ){
      if (uploading) {
        const asset = new Map(assets[index]);
        this.onUpload(asset.get(OBJ_FIELD))
          .then(response => this.onAdvanceUploadIndex(getSuccessFields()))
          .catch(error => this.onAdvanceUploadIndex(getErrorFields(error.message)));
      }
    }
  }

  onReset = () => {
    this.setState({...resetState});
  }

  onChange = e => {
    const file = e.target.files[0];
    const types = ['text/csv']

    if (types.every(type => file.type !== type)) {
      const msg = "Cannot upload: File is not CSV.";
      notify.show(msg, 'error');
      return;
    }

    if (file.size > maxMbFileSize * 1024 * 1024) {
      const msg = `Cannot upload: File is bigger than ${maxMbFileSize} Mb.`;
      notify.show(msg, 'error');
      return;
    }

    Array.from(e.target.files).map(file => new Map([
      [OBJ_FIELD, file]
    ]));

    readCSV(file)
      .then(assets => {
        const mappedAssets = assets.map(asset => new Map([
          [OBJ_FIELD, asset]
        ]));
        this.setState({ assets: mappedAssets, index: 0 })
      })
      .catch(errorMsg => notify.show(errorMsg, 'error'));
  }

  onInitUpload = () => {
    const { index, assets } = { ...this.state };

    assets[index] = applyFields(assets[index], getUploadingFields());

    this.setState({
      assets: assets,
      uploading: true
     });
  }

  onAdvanceUploadIndex = (fieldsPrevious) => {
    const { index, assets, uploading } = { ...this.state };
    let newUploading = uploading;

    assets[index] = applyFields(assets[index], fieldsPrevious);

    if (index < assets.length-1){
      assets[index+1] = applyFields(assets[index+1], getUploadingFields());
    } else {
      newUploading = false;
    }

    this.setState({
      assets: assets,
      index: index+1,
      uploading: newUploading
    });
  }

  onInsertAsset = (asset) => new Promise((resolve, reject) => {
    const backend = new Backend();
    backend.insert_asset(asset)
    .then(response => {
      resolve();
    })
    .catch(error => {
      reject(error);
    })
  })

  onUpload = (assetIn) => new Promise((resolve, reject) => {
    let newTags = [];
    if (assetIn.tags !== "") {
      newTags = splitCSVLine(assetIn.tags)
    }

    let newRelated = [];
    if (assetIn.related !== "") {
      newTags = splitCSVLine(assetIn.related)
    }

    const asset = { ...assetIn, tags: newTags, related: newRelated};
    const backend = new Backend();
    backend.search_asset_upsert(asset.number, asset.order)
    .then(response => {
      /* Make upsert logic on front end */
      if(response.data.assets.length === 0){
        response = this.onInsertAsset(asset);
      } else {
        //TODO: onUpdateAsset
      }

      return response;
    })
    .then(reponse => resolve())
    .catch(error => {
      const msg = `Server error ${error.response.status}: ${error.response.data.message}`;
      reject(new Error(msg));
    })
  });

  onClickSelectFiles = () => {
    document.getElementById(fileSelectorId).click();
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true });
  }

  handleCloseModal = (parentResetFn) => {
    this.onReset();
    parentResetFn();
  }

  render() {
    const { onParentReset } = this.props;
    const { isOpen, uploading, assets, index } = this.state;
    const allowSelect = !uploading;
    const allowUpload = !uploading && assets.length !== 0 && index === 0;

    let table = <p>No file selected.</p>;
    if (assets.length > 0){
      table = mapAssetsTable(assets);
    }

    let uploadStatus = null;
    if (uploading) {
      const uploadStatusText = ["Processing ", index+1, " / ", assets.length].join("");
      uploadStatus = <div className={[classes.Status, classes.Uploading].join(" ")}>
        {uploadStatusText}
      </div>
    } else if (index !== 0) {
      const uploadStatusText = ["Processed ", assets.length, " assets!"].join("");
      uploadStatus = <div className={[classes.Status, classes.Finished].join(" ")}>
        {uploadStatusText}
      </div>
    }

    return (
      <React.Fragment>
        <AddModalSection text="Upload asset CSV" clicked={this.handleOpenModal}/>
        <Modal
          isOpen={isOpen}
          contentLabel="Asset uploader"
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
            onClick={() => this.handleCloseModal(onParentReset)}
          />

          <input
            id={fileSelectorId}
            type='file'
            accept='.csv'
            onChange={(e) => this.onChange(e)}
            hidden
            />

          <Button
            buttonType="Success"
            clicked={() => this.onClickSelectFiles()}
            disabled={!allowSelect}
            >
            Select CSV with assets to upload
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
      </React.Fragment>
    )
  }
}

export default AssetUploaderModal;
