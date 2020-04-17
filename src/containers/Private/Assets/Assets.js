import React from 'react';

import Assets from '../../Public/Assets/Assets';
import AddModalSection from '../../../components/UI/AddModalSection/AddModalSection';
import InputWithIcon from '../../../components/UI/InputWithIcon/InputWithIcon';

import withAuth from '../../../hoc/withAuth/withAuth';


const assets = (props) =>
  <React.Fragment>
    <AddModalSection clicked={() => console.log("clicked")} text="Add assets" />
    <InputWithIcon
      icon='search'
      keyPressed={() => console.log("keyPressed")}
      placeholder="Type to filter assets"
    />
    <Assets />
  </React.Fragment>


export default withAuth(assets);
