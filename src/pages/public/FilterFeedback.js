import React from 'react';

import Tag from 'components/UI/Tag';

import classes from './FilterFeeback.module.css';

const filterFeedback = ({productsFilter, tagsFilter, onDeleteProduct, onDeleteTag}) => {

  if (productsFilter.size + tagsFilter.size === 0) return null;

  const productTags = [...productsFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteProduct(element)}
    >
      {element} (Product)
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  const tags = [...tagsFilter].map(element =>
    <Tag
      key={element}
      onDelete={() => onDeleteTag(element)}
    >
      {element}
    </Tag>
  ).reduce( (arr, el) => {
  return arr.concat(el);
  }, [] )

  return (
    <div className={classes.FeedbackArea}>
      <strong className={classes.FeedbackText}>Currently only showing items that include:</strong> {productTags} {tags}
    </div>
  );
}

export default filterFeedback;
