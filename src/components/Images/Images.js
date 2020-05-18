import update from 'immutability-helper';
import React from 'react';

import AddModalSection from '../UI/AddModalSection/AddModalSection';
import Backend from '../../Backend/Backend';
import ImageEditor from './ImageEditor/ImageEditor';
import ImageUploaderModal from './ImageUploaderModal/ImageUploaderModal';
import Spinner from '../UI/Spinner/Spinner';

import withAuth from '../../hoc/withAuth/withAuth';

const applySetResult = (result) => (prevState) => ({
  images: result.images,
  isError: false,
  isLoading: false,
});

const applySetCollection = (collection, newCollection) => (prevState) => ({
  [collection]: newCollection,
  isError: false,
  isLoading: false,
});

const applySetError = (prevState) => ({
  isError: true,
  isLoading: false,
});

class Images extends React.Component {
  state = {
    images: [],
    filter: '',
    page: null,
    isError: false,
    isLoading: false,
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let images = [];
    backend.get_images()
      .then(response => {
        images = response.data.images;

        const result = { images: images }
        this.onSetResult(result);
      })
      .catch( error => this.onSetError() );
  }

  onSetError = () => this.setState(applySetError);

  onSetResult = (result) => this.setState(applySetResult(result));

  onSetCollection = (collection, newCollection) =>
    this.setState(applySetCollection(collection, newCollection));

  onKeyUp = (event, actionFn) =>
    event.key === 'Enter'
      ? actionFn(event.target.value)
      : null

  onAdd = (collection) => (tagValue) => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    let request;
    if (collection === "tags") {
      request = backend.insert_tag(tagValue);
    } else {
      request = backend.insert_product(tagValue);
    }

    request
      .then( response => {
        const newCollection = update(this.state[collection], {
          $push: [{
            id: response.id,
            value: tagValue
          }]}
        );
        this.onSetCollection(collection, newCollection);
      })
      .catch( error => this.onSetError() );
  }

  onDelete = (collection) => (id) => {
    this.setState({ isLoading: true });
    const backend = new Backend();

    backend.delete_image(id)
      .then( response => {
        const newCollection = update(
          this.state.images,
          {$set: this.state.images.filter(item => item.id !== id)}
        );
        this.onSetCollection(collection, newCollection);
      })
      .catch( error => this.onSetError() );
  }

  onAddFilter = () => (filterValue) =>
    this.setState( { "filter": filterValue } );

  applyFilter = () => {
    const filteredNumbers = this.state.images.filter(image =>
      image.number.toLowerCase()
      .includes(this.state.filter.toLowerCase())
    );

    const filteredNames = this.state.images.filter(image =>
      image.name.toLowerCase()
      .includes(this.state.filter.toLowerCase())
    );

    return [...new Set([...filteredNumbers, ...filteredNames])];
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    let content = (
      <React.Fragment>
        <AddModalSection clicked={() => this.handleOpenModal()} text="Upload images" />
        <ImageUploaderModal
          isOpen={this.state.showModal}
          closeFn={this.handleCloseModal}
        />
        <div>
          <ImageEditor
            label="Uploaded images"
            images={this.applyFilter()}
            onKeyUpSearch={
              (event) => this.onKeyUp(event, this.onAddFilter())
            }
            onDelete={(id) => this.onDelete('images')(id)}
          />
        </div>
      </React.Fragment>
    );
    if (this.state.isLoading){
      content = <Spinner />;
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default withAuth(Images);
