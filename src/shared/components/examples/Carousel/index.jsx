import React from 'react';
import XCarousel from 'components/XCarousel';

import Card from './Card';

import './style.scss';

export default function Carousel() {
  return (
    <div styleName="container">
      <h1>
Carousel
      </h1>
      <XCarousel>
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
        <Card color="blue" height={150} />
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
      </XCarousel>
      <XCarousel>
        <Card color="red" height={90} />
        <Card color="green" height={120} />
        <Card color="blue" height={150} />
      </XCarousel>
    </div>
  );
}
