import React from 'react';

import { SwipeableRow3 } from './SwipeableRow';
import { genActions2 } from './Action';

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lock: false };
  }
  render() {
    const { bucket, onSwipeEnd, onSwipeStart, ...props } = this.props;
    // TODO:parameterize leftActions & rightActions
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
