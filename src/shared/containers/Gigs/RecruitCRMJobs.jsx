/**
 * A block that fetches and renders a job listing page
 * driven by recruitCRM
 */
import _ from 'lodash';
import actions from 'actions/recruitCRM';
import LoadingIndicator from 'components/LoadingIndicator';
import SearchCombo from 'components/GUIKit/SearchCombo';
import Paginate from 'components/GUIKit/Paginate';
import JobListCard from 'components/GUIKit/JobListCard';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './jobLisingStyles.scss';

const GIGS_PER_PAGE = 10;

class RecruitCRMJobsContainer extends React.Component {
  constructor(props) {
    super(props);
    // Filter initial state
    this.state = {
      term: '',
      page: 0,
      sortBy: 'created_on',
    };

    this.onSearch = this.onSearch.bind(this);
    this.onPaginate = this.onPaginate.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    const {
      getJobs,
      jobs,
    } = this.props;

    // This gets all jobs.
    // Pagination and filtering on front-side
    if (!jobs.length) {
      getJobs({
        job_status: 1, // Open jobs only
      });
    }
  }

  /**
   * Wraps all calls to setState
   * @param {Object} newState the state update
   */
  onFilter(newState) {
    // Do updates

    // update the state
    this.setState(newState);
  }

  onSearch(newTerm) {
    this.onFilter({
      term: newTerm,
      page: 0,
    });
  }

  onPaginate(newPage) {
    this.onFilter({
      page: newPage.selected,
    });
  }

  render() {
    const {
      loading,
      jobs,
    } = this.props;
    const {
      term,
      page,
      sortBy,
    } = this.state;

    if (loading) {
      return <LoadingIndicator />;
    }

    let jobsToDisplay = jobs;
    // Filter by term
    if (term) {
      jobsToDisplay = _.filter(jobs, (job) => {
        // eslint-disable-next-line no-underscore-dangle
        const _term = term.toLowerCase();
        // name search
        if (job.name.toLowerCase().includes(_term)) return true;
        // skills search
        const skills = _.find(job.custom_fields, ['field_name', 'Technologies Required']);
        if (skills && skills.value && skills.value.toLowerCase().includes(_term)) return true;
        // location
        if (job.country.toLowerCase().includes(_term)) return true;
        // no match
        return false;
      });
    }
    // Sort controlled by sortBy state
    jobsToDisplay = jobsToDisplay.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
    // Calc pages
    const pages = Math.ceil(jobsToDisplay.length / GIGS_PER_PAGE);
    // Paginate the results
    jobsToDisplay = _.slice(
      jobsToDisplay,
      page * GIGS_PER_PAGE, (page * GIGS_PER_PAGE) + GIGS_PER_PAGE,
    );

    return (
      <div styleName="container">
        <div styleName="filters">
          <SearchCombo placeholder="Search Gig Listings by Name, Skills, or Location" onSearch={this.onSearch} term={term} />
        </div>
        <div styleName="jobs-list-container">
          {
            jobsToDisplay.length
              ? jobsToDisplay.map(job => <JobListCard job={job} key={job.slug} />)
              : <span styleName="no-results">No Results</span>
          }
        </div>
        {
          jobsToDisplay.length
            ? <Paginate onChange={this.onPaginate} pages={pages} page={page} /> : null
        }
      </div>
    );
  }
}

RecruitCRMJobsContainer.defaultProps = {
  jobs: [],
};

RecruitCRMJobsContainer.propTypes = {
  getJobs: PT.func.isRequired,
  loading: PT.bool.isRequired,
  jobs: PT.arrayOf(PT.shape),
};

function mapStateToProps(state) {
  const data = state.recruitCRM;
  return {
    jobs: data ? data.jobs : [],
    loading: data ? data.loading : true,
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.recruit;
  return {
    getJobs: (ownProps) => {
      dispatch(a.getJobsInit(ownProps));
      dispatch(a.getJobsDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(RecruitCRMJobsContainer);
