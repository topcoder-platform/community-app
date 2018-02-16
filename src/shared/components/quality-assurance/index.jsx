
import React from 'react';
import PT from 'prop-types';
import { IntlProvider, FormattedRelative } from 'react-intl';
import './style.scss';

export default function QualityAssuranceListing(props) {
  const repositories = props.repositories.map((repository) => {
    if (repository.has_issues) {
      return (
        <div styleName="flex-cell" key={repository.id}>
          <div styleName="flex-repository" key={`${repository.id}_repository`}>
            <div styleName="flex-repository-name" key={`${repository.id}_name`}>
              <a href={`/quality-assurance/${repository.owner.login}/${repository.name}`}>{repository.name}</a>
            </div>
            <div styleName="flex-repository-language" key={`${repository.id}_language`}>
              {repository.language ? repository.language : '--------'}
            </div>
            <div styleName="flex-repository-updated" key={`${repository.id}_updated`}>
              <IntlProvider locale="en">
                <FormattedRelative value={repository.pushed_at} />
              </IntlProvider>
            </div>
            <div styleName="flex-repository-counts" key={`${repository.id}_counts`}>
              <svg styleName="flex-repository-counts-icons" aria-label="Open Issues" height="16" width="14" role="img" version="1.1" viewBox="0 0 14 16">
                <path fillRule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z" />
              </svg>&nbsp;{repository.open_issues_count}&nbsp;&nbsp;
              <svg styleName="flex-repository-counts-icons" aria-label="Stargazers" height="16" width="14" role="img" version="1.1" viewBox="0 0 14 16">
                <path fillRule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z" />
              </svg>&nbsp;{repository.stargazers_count}&nbsp;&nbsp;
              <svg styleName="flex-repository-counts-icons" aria-label="Forks" height="16" width="10" role="img" version="1.1" viewBox="0 0 10 16">
                <path fillRule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z" />
              </svg>&nbsp;{repository.forks_count}&nbsp;&nbsp;
              <svg styleName="flex-repository-counts-icons" aria-label="Watchers" height="16" width="16" role="img" version="1.1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z" />
              </svg>&nbsp;{repository.watchers_count}
            </div>
          </div>
        </div>
      );
    }
    return ('');
  });

  return (
    <div styleName="flex-container">
      {repositories}
    </div>
  );
}

QualityAssuranceListing.defaultProps = {
  repositories: [],
};

QualityAssuranceListing.propTypes = {
  repositories: PT.arrayOf(PT.shape),
};
