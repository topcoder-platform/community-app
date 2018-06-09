import React from 'react';
import Viewport from 'components/Contentful/Viewport';

export default function MemberProgramsPage() {
  return (
    <Viewport query={{ 'fields.name': 'Member Programs' }} />
  );
}
