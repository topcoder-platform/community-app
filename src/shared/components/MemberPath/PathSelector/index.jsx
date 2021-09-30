import PT from 'prop-types';
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import ArrowLeftIcon from 'assets/images/member-path/icon-left.svg';
import ArrowRightIcon from 'assets/images/member-path/icon-right.svg';
import styles from './styles.scss';

const colorStyles = [styles.purple, styles.blue, styles.teal, styles.orange];

export default function PathSelector({
  data,
  animationTime,
}) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(
    () => {
      setTimer(setInterval(() => {
        setActiveItemIndex(itemIndex => (itemIndex + 1) % data.items.length);
      },
      animationTime));
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    },
    [],
  );
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleOptionSelect = index => () => {
    setActiveItemIndex(index);
    // Stop the animation if user selects an item
    stopTimer();
  };

  const handlePrevButton = () => {
    setActiveItemIndex(activeItemIndex - 1 < 0 ? data.items.length - 1 : activeItemIndex - 1);
    // Stop the animation if user selects an item
    stopTimer();
  };

  const handleNextButton = () => {
    setActiveItemIndex((activeItemIndex + 1) % data.items.length);
    // Stop the animation if user selects an item
    stopTimer();
  };

  const items = data.items.map((item, index) => (
    <button
      key={`path-selector-${item.title}`}
      type="button"
      className={cn(
        styles.option,
        colorStyles[index % colorStyles.length],
        { [styles.active]: activeItemIndex === index },
      )
      }
      onClick={handleOptionSelect(index)}
    >
      <img
        className={styles.icon}
        src={item.iconURL}
        alt={item.title}
      />
      <img
        className={styles.activeIcon}
        src={item.activeIconURL}
        alt={item.title}
      />
      <span>{item.title}</span>
    </button>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.options}>
          <ArrowLeftIcon
            className={styles.arrowIcon}
            onClick={handlePrevButton}
          />
          {items}
          <ArrowRightIcon
            className={styles.arrowIcon}
            onClick={handleNextButton}
          />
        </div>
      </div>
      <div className={cn(styles.content, colorStyles[activeItemIndex % colorStyles.length])}>
        <div className={styles.contentText}>
          <span>{data.items[activeItemIndex].contentText}</span>
        </div>
        <a
          href={data.items[activeItemIndex].btnURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contentButton}
        >
          {data.items[activeItemIndex].btnText}
        </a>
      </div>
    </div>
  );
}

PathSelector.defaultProps = {
  animationTime: 3000,
};

PathSelector.propTypes = {
  data: PT.shape({
    items: PT.arrayOf(PT.shape({
      title: PT.string,
      iconURL: PT.string,
      activeIconURL: PT.string,
      contentText: PT.string,
      btnText: PT.string,
      btnURL: PT.string,
      btnNewTab: PT.bool,
    })),
    title: PT.string,
  }).isRequired,
  animationTime: PT.number,
};
