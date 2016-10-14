import React from 'react';

import { SwipeableRow3 } from './SwipeableRow';
import { genActions2 } from './Action';

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    // console.log("const",props)
  }
  render() {
    const { bucket, ...props } = this.props;
    // console.log("br1 rend",this.props)
    return (
      <SwipeableRow3
        {...props}
        {...genActions2(bucket)}
      />
    );
  }
}
module.exports = { BookRow1 };
