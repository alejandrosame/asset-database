import React from 'react';

import InputWithIcon from '../../../UI/InputWithIcon/InputWithIcon';
import Tag from '../../../UI/Tag/Tag';

import classes from './TagSelector.module.css';

class tagSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      originalValues: props.defaultValues,
      values: props.defaultValues,
      changed: false
    }
  }

  onDeselect(tag) {
    console.log(`Deselect tag ${tag}.`);
  }

  onSelect(tag) {
    console.log(`Select tag ${tag}.`);
  }

  //({ defaultValues, options, clicked }) =>

  render() {
    const selectable = this.props.options.filter(
      value => !this.state.values.includes(value)
    )

    let message = "Select tags from the set below."
    if (this.state.values.length !== 0) message = "";

    return <div>
      <div className={classes.Selected}>
        {message}
        {
          this.state.values.map(tag => {
            return (
              <Tag
                key={tag.id}
                onDelete={() => this.onDeselect(tag)}
              >
                {tag.value}
              </Tag>
            );
          })
          .reduce( (arr, el) => {
            return arr.concat(el);
          }, [] )
        }
      </div>
      <hr/>
      <div className={classes.Selectable}>
        {
          selectable.map(tag => {
            return (
              <Tag
                key={tag.id}
                onClick={() => this.onSelect(tag)}
              >
                {tag.value}
              </Tag>
            );
          })
          .reduce( (arr, el) => {
            return arr.concat(el);
          }, [] )
        }
      </div>
    </div>
  }
}


export default tagSelector;
