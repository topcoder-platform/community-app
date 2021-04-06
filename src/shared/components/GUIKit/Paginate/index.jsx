/**
 * Paginate component.
 * Based on https://github.com/AdeleD/react-paginate
 */
import React from 'react';
import ReactPaginate from 'react-paginate';
import PT from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import './style.scss';

function Paginate({
  pages,
  page,
  onChange,
}) {
  const isMobile = useMediaQuery({
    query: '(max-device-width: 768px)',
  });
  return (
    <div styleName="container">
      <ReactPaginate
        pageCount={pages}
        initialPage={page}
        forcePage={page}
        pageRangeDisplayed={isMobile ? 1 : 3}
        marginPagesDisplayed={isMobile ? 1 : 2}
        onPageChange={onChange}
        activeClassName="active"
        previousLabel="PREV"
        nextLabel="NEXT"
        containerClassName="paginator"
        previousLinkClassName="previous-link"
        nextLinkClassName="next-link"
        pageLinkClassName="paginator-btn"
        activeLinkClassName="paginator-btn-active"
        breakLinkClassName="paginator-break-link"
      />
    </div>
  );
}

Paginate.defaultProps = {
  page: 1,
};

Paginate.propTypes = {
  pages: PT.number.isRequired,
  page: PT.number,
  onChange: PT.func.isRequired,
};

export default Paginate;
