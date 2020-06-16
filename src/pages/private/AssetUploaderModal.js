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

const intersection = (listA, listB) => {
  return listA.filter(x => listB.includes(x));
}

const difference = (listA, listB) => {
  return listA.filter(x => !listB.includes(x));
}

const getUpdateData = (assetCSV, assetDB) => {

  const updateData = {}

  if (assetCSV.displaySize.toLowerCase() !== assetDB.display_size.toLowerCase()){
    updateData["updateDisplaySize"] = assetCSV.displaySize.toLowerCase();
  }

  if (assetCSV.printSize.toLowerCase() !== assetDB.printed_size.toLowerCase()){
    updateData["updatePrintSize"] = assetCSV.printSize.toLowerCase();
  }

  const assetDBProduct = assetDB.products[0]?assetDB.products[0]:"";
  if (assetCSV.product.toLowerCase() !== assetDBProduct.toLowerCase()){
    updateData["updateProduct"] = assetCSV.product.toLowerCase();
  }

  if (assetCSV.notes.trim() !== assetDB.notes.trim()){
    updateData["updateNotes"] = assetCSV.notes.trim();
  }

  const processedDBRelated = assetDB.related_assets.map(x => {
    return x.number.toString();
  } );
  const processedCSVRelated = assetCSV.related.map(x => {
    return x.toLowerCase();
  } );
  const intersectionRelated = intersection(processedDBRelated, processedCSVRelated);
  const addRelated = difference(processedCSVRelated, intersectionRelated);
  if (addRelated.length > 0) {
    updateData["addRelated"] = addRelated;
  }
  const deleteRelated = difference(processedDBRelated, intersectionRelated);
  if (deleteRelated.length > 0) {
    updateData["deleteRelated"] = deleteRelated;
  }

  const processedCSVTags = assetCSV.tags.map(x => {
    return x.toString().toLowerCase();
  } );
  const intersectionTags = intersection(assetDB.tags, processedCSVTags);
  const addTags = difference(processedCSVTags, intersectionTags);
  if (addTags.length > 0) {
    updateData["addTags"] = addTags;
  }
  const deleteTags = difference(assetDB.tags, intersectionRelated);
  if (deleteTags.length > 0) {
    updateData["deleteTags"] = deleteTags;
  }

  return updateData;
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

const resetState = { isOpen: false, uploading: false, finished: false,
  assets: [], index: 0, processedTags: new Set(), processedProducts: new Set() };

class AssetUploaderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...resetState};
  }

  componentDidUpdate(prevProps, prevState) {
    const [ prevUploading, prevIndex ] = [ prevState.uploading, prevState.index ];
    const { uploading, finished, index, assets } = this.state;

    if ( prevUploading !== uploading || prevIndex !== index ){
      if (uploading && !finished ) {
        const asset = new Map(assets[index]);
        this.onUpload(asset.get(OBJ_FIELD))
          .then(response => {
            let msg = "";
            if (response && "message" in response) msg = response.message;
            this.onAdvanceUploadIndex(getSuccessFields(msg));
          })
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
        this.setState({...resetState, assets: mappedAssets, isOpen: true});
      })
      .catch(errorMsg => notify.show(errorMsg, 'error'));
  }

  onInitUpload = () => {
    const { index, assets } = { ...this.state };

    assets[index] = applyFields(assets[index], getUploadingFields());

    this.setState({
      assets: assets,
      uploading: true,
      finished: false
     });
  }

  onAdvanceUploadIndex = (fieldsPrevious) => {
    const { index, assets, uploading, finished } = { ...this.state };
    let newUploading = uploading;
    let newFinished = finished;

    assets[index] = applyFields(assets[index], fieldsPrevious);

    if (index < assets.length-1){
      assets[index+1] = applyFields(assets[index+1], getUploadingFields());
    } else {
      newUploading = false;
      newFinished = true;
    }

    this.setState({
      assets: assets,
      index: index+1,
      uploading: newUploading,
      finished: newFinished,
    });
  }

  onInsertAsset = (asset) => new Promise((resolve, reject) => {
    const backend = new Backend();
    backend.insert_asset(asset)
    .then(response => {
      const assetDB = {...asset,  products: [], tags: [], related_assets: []}
      this.onUpdateAsset(asset, assetDB)
        .then(response => resolve())
        .catch(error => {
          reject(error);
        })
    })
    .catch(error => {
      reject(error);
    })
  })

  onAddProduct = (productName) => new Promise((resolve, reject) => {
    if (this.state.processedProducts.has(productName)){
      resolve();
      return;
    }

    const processedProducts = new Set(this.state.processedProducts);
    const backend = new Backend();
    backend.insert_product(productName)
      .then(response => {
        resolve();
      })
      .catch(error => resolve({"product": productName}))
      .finally(() => {
        processedProducts.add(productName);
        this.setState({ processedProducts: processedProducts });
      })
  })

  onAddTag = (tagName) => new Promise((resolve, reject) => {
    if (this.state.processedTags.has(tagName)){
      resolve();
      return;
    }

    const processedTags = new Set(this.state.processedTags);
    const backend = new Backend();
    backend.insert_tag(tagName)
      .then(response => {
        resolve();
      })
      .catch(error => resolve({"tag": tagName}))
      .finally(() => {
        processedTags.add(tagName);
        this.setState({ processedTags: processedTags });
      })
  })

  onUpdateAsset = (assetCSV, assetDB) => new Promise((resolve, reject) => {
    const promises=[];
    const updateData = getUpdateData(assetCSV, assetDB);
    if (updateData === {}) {
      console.log("No need to update: ", assetDB.number, assetDB.order);
      resolve();
      return;
    }

    if ("updateProduct" in updateData ) {
      promises.push(this.onAddProduct(updateData["updateProduct"]));
    }

    if ("addTags" in updateData ) {
      for (let tagName of updateData["addTags"]) {
        promises.push(this.onAddTag(tagName));
      }
    }

    Promise.all(promises)
      .then(responses => {
        const errors = responses.filter(el => el !== undefined);
        if (errors.length !== 0) {
          reject(errors);
          return;
        }

        const backend = new Backend();
        backend.update_asset( {
          number: assetDB.number,
          order: assetDB.order,
          ...updateData } )
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          })
      })
  })

  onUpload = (assetIn) => new Promise((resolve, reject) => {
    let newTags = [];
    if (assetIn.tags !== "") {
      newTags = splitCSVLine(assetIn.tags)
    }

    let newRelated = [];
    if (assetIn.related !== "") {
      newRelated = splitCSVLine(assetIn.related)
    }

    const asset = { ...assetIn, tags: newTags, related: newRelated};
    const backend = new Backend();
    backend.search_asset_upsert(asset.number, asset.order)
    .then(response => {
      /* Make upsert logic on front end */
      if(response.data.assets.length === 0){
        response = this.onInsertAsset(asset);
      } else {
        response = this.onUpdateAsset(asset, response.data.assets[0]);
      }
      return response;
    })
    .then(response => resolve())
    .catch(error => {
      let msg = JSON.stringify(error);
      if ("repsonse" in error) {
        msg = `Server error ${error.response.status}: ${error.response.data.message}`;
      }
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
    const { isOpen, uploading, finished, assets, index } = this.state;
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
    } else if (finished) {
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
