import React from 'react';

import ImageSelector from './ImageSelector/ImageSelector';

import classes from './VizInput.module.css';

class VizInput extends React.Component {
  onChange = (imageList) => {
    // data for submit
    console.log(imageList);
  };

  render() {
    return (
      <div className={classes.VizInput} >
        <div className={classes.SelectorGroup} >
          <div className={classes.Selector} >
            <ImageSelector
              selectorText={"Select front image"}
              onChangeFn={this.onChange}
              defaultValue={[]}
            />
          </div>
          <div className={classes.Selector} >
            <ImageSelector
              selectorText={"Select back image"}
              onChangeFn={this.onChange}
              defaultValue={[]}
            />
          </div>
        </div>
        <div>
          <div className={classes.Group} >
            <input type="text" required />
            <span className={classes.Highlight}></span>
            <span className={classes.Bar}></span>
            <label>Number</label>
          </div>

          <div className={classes.Group} >
            <input type="text" required />
            <span className={classes.Highlight}></span>
            <span className={classes.Bar}></span>
            <label>Name</label>
          </div>
        </div>
      </div>
    );
  }
}


export default VizInput;
