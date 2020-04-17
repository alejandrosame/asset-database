import React from 'react';

import Assets from '../../../containers/Assets/Assets';
import AddModalSection from '../../../components/UI/AddModalSection/AddModalSection';

import withAuth from '../../../hoc/withAuth/withAuth';

const assets = (props) =>
  <React.Fragment>
    <AddModalSection clicked={() => console.log("clicked")} text="Add assets" />
    <Assets />
  </React.Fragment>


export default withAuth(assets);
