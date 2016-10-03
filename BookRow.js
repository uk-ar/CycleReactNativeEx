import React from 'react';

import { SwipeableRow3 } from './SwipeableRow';
import { genActions2 } from './Action';

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lock: false };
  }
  render() {
    const { bucket, ...props } = this.props;
    //onSwipeEnd
    // TODO:parameterize leftActions & rightActions
    console.log("br1 rend",this.props)
    return (
      <SwipeableRow3
        {...props}
        ref={c => (this.row = c)}
        {...genActions2(bucket)}
      />
    );
  }
}
module.exports = { BookRow1 };
