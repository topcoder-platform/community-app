import PathSelector from 'components/MemberPath/PathSelector';
import React from 'react';
import mockData from 'assets/mock-data/member-path-selector-data.json';
import './styles.scss';

export default function MemberPathSelectorExample() {
  return (
    <div styleName="container">
      <h1>
        Member Path - Path Selector Component Preview
      </h1>
      <PathSelector data={mockData} animationTime={4000} />
    </div>
  );
}
