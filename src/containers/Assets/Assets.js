import React from 'react';

import Asset from '../../components/Asset/Asset';

import assetsData from '../../assets/data/assets.json';
import classes from './Assets.module.css';

const assets = (props) => {
  const assetsOutput = assetsData.map(asset =>
    <Asset
      key={asset.id}
      {...asset}
    />
  );

  return (
    <table className={classes.Assets}>
      <tbody>
        {assetsOutput}
      </tbody>
    </table>
  );
}
export default assets;
