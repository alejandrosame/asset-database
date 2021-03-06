import update from 'immutability-helper';
import React from 'react';

import AddModalSection from 'components/UI/AddModalSection';
import Backend from 'logic/backend/Backend';
import ImageEditor from './ImageEditor';
import ImageUploaderModal from './ImageUploaderModal';
import Spinner from 'components/UI/Spinner/Spinner';

import withAuth from 'logic/hoc/withAuth';

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

  constructor(props) {
    super(props);

    const b = new Backend();

    this.state = {
      images: [],
      filter: '',
      baseImageURL: b.get_base_image_URL(),
      page: null,
      isError: false,
      isLoading: false,
      timeout: null
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
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

  onKeyUp = (event, actionFn) => {
    clearTimeout(this.state.timeout);

    const e = {...event};
    const timeout = setTimeout(() => actionFn(e.target.value), 500);

    this.setState( { timeout: timeout } );
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
      image.number.toString()
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
    this.fetch();
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
            baseImageURL={this.state.baseImageURL}
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
