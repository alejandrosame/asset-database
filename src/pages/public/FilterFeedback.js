import React from 'react';

import Tag from 'components/UI/Tag';

import classes from './FilterFeeback.module.css';

const filterFeedback = ({ productsShowFilter, tagsShowFilter,
                          productsHideFilter, tagsHideFilter,
                          onDeleteShowProduct, onDeleteShowTag,
                          onDeleteHideProduct, onDeleteHideTag }) => {

  const filterCount = productsShowFilter.size + tagsShowFilter.size +
                      productsHideFilter.size + tagsHideFilter.size;

  if ( filterCount === 0) return null;

  const showProductTags = [...productsShowFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteShowProduct(element)}
    >
      {element} (Product)
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  const showTags = [...tagsShowFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteShowTag(element)}
    >
      {element}
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  const hideProductTags = [...productsHideFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteHideProduct(element)}
    >
      {element} (Product)
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  const hideTags = [...tagsHideFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteHideTag(element)}
    >
      {element}
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  return (
    <div className={classes.FeedbackArea}>
      <div>
        <strong className={classes.FeedbackText}>Currently showing:</strong> {showProductTags} {showTags}
      </div>
      <div>
        <strong className={classes.FeedbackText}>Currently hiding:</strong> {hideProductTags} {hideTags}
      </div>
    </div>
  );
}

export default filterFeedback;
