import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import cn from 'classnames';

import TimelineHeader from './Header';
import Timeline from './Timeline';
import Gallery from './Gallery';

import './styles.scss';
import AdminTimeline from './AdmineTimeline';
import Filter from './Filter';

const TimelineWall = ({
  events, pendingApprovals, userLoggedIn, isAdmin,
}) => {
  const [currentAssets, setCurrentAssets] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const id = `${selectedYear}-${selectedMonth}`;
      if (document.getElementById(id)) {
        document.getElementById(id).scrollIntoView();
      }
    }
  }, [selectedYear, selectedMonth]);

  const onSelectAsset = (assets, index) => {
    setCurrentAssets(assets);
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const onNext = (newIndex) => {
    if (newIndex < 0) {
      setCurrentIndex(currentAssets.length - 1);
    } else if (newIndex >= currentAssets.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <React.Fragment>
      <div styleName="container">
        <TimelineHeader
          userLoggedIn={userLoggedIn}
          isAdmin={isAdmin}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          numOfPendingApprovals={pendingApprovals.length}
        />
        {
          currentTab ? (
            <AdminTimeline
              pendingApprovals={pendingApprovals}
              onSelectAsset={onSelectAsset}
            />
          ) : (
            <Timeline
              events={events}
              onSelectAsset={onSelectAsset}
            />
          )
        }
      </div>
      <div styleName={cn({ overlay: galleryOpen })} />
      <Gallery
        open={galleryOpen}
        assets={currentAssets}
        currentIndex={currentIndex}
        onClose={() => { setGalleryOpen(false); }}
        onNext={onNext}
      />
      {
        !currentTab && (
          <Filter
            selectedYear={selectedYear}
            setSelectedYear={(year) => {
              if (year === selectedYear) {
                setSelectedMonth(null);
                setSelectedYear(0);
              } else {
                setSelectedYear(year);
              }
            }}
            setSelectedMonth={(month) => {
              if (selectedMonth === month) {
                setSelectedMonth(null);
              } else {
                setSelectedMonth(month);
              }
            }}
            selectedMonth={selectedMonth}
          />
        )
      }
    </React.Fragment>
  );
};

TimelineWall.defaultProps = {
  events: [],
  pendingApprovals: [],
  userLoggedIn: false,
  isAdmin: false,
};

TimelineWall.propTypes = {
  events: PT.arrayOf(PT.shape()),
  pendingApprovals: PT.arrayOf(PT.shape()),
  userLoggedIn: PT.bool,
  isAdmin: PT.bool,
};

export default TimelineWall;
