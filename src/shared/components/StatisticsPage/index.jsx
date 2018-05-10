/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import Header from './Header';
import styles from './styles.scss';
import { Link } from 'react-router-dom';
import SubtrackStats from './SubtrackStats';
import StatisticsModal from './StatisticsModal';
import StatisticsCarousel from './StatisticsCarousel';
import StatisticsDevelopDetails from './StatisticsDevelopDetails';
import {Line as LineChart} from 'react-chartjs';

var subtrackArray;

var statsTabStyle = "header"
var challengeTabStyle = "header"
var subtrackStatsDiv;

function chartData(data) {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: data,
      },
      {
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ]
  }
}
const percentage = (number) => {
    return Math.round(number*100)
}
const options = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: false,
  bezierCurveTension: 0,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: false,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
}

class StatisticsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statisticsModalOpen: false,
      developTrackDetailsArray: {
          "Win Percentage": "809%",
          "Submission Rate": "988%",
          "Screening Success Rate": "889%",
          "Review Success Rate": "889%",
          "Appeals Success Rate": "120%",
          "Average Placement": "1.0.0"
      },
      subtrackArray: {
        "Percentile": "-",
        "Challenges": "",
        "Wins": "",
      },
      showDetails: true,
      data: chartData([1,2,3])
    };
    if (this.props.tab && this.props.tab == "challenges") {
        challengeTabStyle += " selected"
    } else {
        statsTabStyle += " selected"
    }

    console.log("props.statsHistory: ", props.statsHistory)

    switch(props.subTrack) {
      case "COPILOT":
        var subTrack = props.stats[props.track]
        this.state.subtrackArray = {
          "Active Challenges": subTrack.activeContests,
          "Active Projects": subTrack.activeProjects,
          "Total Challenges": subTrack.contests,
          "topTenFinishesal Projects": subTrack.projects,
          "FulFillment": Math.round(subTrack.fulfillment) + "%",
        }
        console.log("subTrack: ", subTrack)
        this.state.showDetails = false
        break;

        case "UI_PROTOTYPE_COMPETITION":
          var statsHistory = props.statsHistory[props.track].subTracks
            .filter(item=>item.name == props.subTrack)[0]
            console.log("MystatsHistory: ", statsHistory)
          var thissetStatedataSetHistory = statsHistory.history.map(item =>
          item.newRating)
          console.log("thissetStatedataSetHistory: ", thissetStatedataSetHistory)
          this.state.data = chartData(thissetStatedataSetHistory)

    }





    switch(props.subTrack){
      case "FIRST_2_FINISH":
      case "BUG_HUNT":
      case "DESIGN_FIRST_2_FINISH":
      case "CODE":
        this.state.showDetails = true
        console.log("this.props.track:", props.track)
        console.log("this.props.subTrack:", props.subTrack)
        console.log("this.props.subTrack:", props.subTrack)
        console.log("Win Percentage: ", )
        var subTrack = props.stats[props.track].subTracks
          .filter(item=>item.name == props.subTrack)[0]
        // console.log("subTrack: ", subTrack)

        const submissions = subTrack.submissions.submissions
        const wins = subTrack.wins
        const winsPercentage = subTrack.submissions.winPercent
        const submissionRate = subTrack.submissions.submissionRate
        const screeningSuccessRate = subTrack.submissions.screeningSuccessRate
        const reviewSuccessRate = subTrack.submissions.reviewSuccessRate
        const appealSuccessRate = subTrack.submissions.appealSuccessRate
        const avgPlacement = subTrack.submissions.avgPlacement


        this.state.developTrackDetailsArray = {
          "Win Percentage": percentage(winsPercentage) + "%",
          "Submission Rate": percentage(submissionRate) + "%",
          "Screening Success Rate": percentage(screeningSuccessRate) + "%",
          "Review Success Rate": percentage(reviewSuccessRate) + "%",
          "Appeals Success Rate": percentage(appealSuccessRate) + "%",
          "Average Placement": avgPlacement.toFixed(2)
        }

        console.log("Win", wins)
        console.log("Challenges:", submissions)
        console.log("winsPercentage", winsPercentage)

        this.state.subtrackArray = {
          "Percentile": "-",
          "Challenges": submissions,
          "Wins": wins,
        }
        break;

        case "UI_PROTOTYPE_COMPETITION":
          var subTrack = props.stats[props.track].subTracks
            .filter(item=>item.name == props.subTrack)[0]
          console.log("subTrack: ", subTrack)
          const rating = subTrack.rank.rating;
          this.state.subtrackArray = {
            "Rating": subTrack.rank.rating,
            "Rank": subTrack.rank.overallRank,
            "Percentile": Math.round(subTrack.rank.overallPercentile) + "%",
            "Challenges": subTrack.challenges,
            "Win": subTrack.wins,
            "reliability": percentage(subTrack.rank.reliability) + "%",
          }
          this.state.developTrackDetailsArray = {
            "Win Percentage": percentage(subTrack.submissions.winPercent) + "%",
            "Country Rank": subTrack.rank.overallCountryRank,
            "Volatility": subTrack.rank.volatility,
            "Maximum Rating": subTrack.rank.maxRating,
            "Submission Rate": percentage(subTrack.submissions.submissionRate) + "%",
            "Screening Success Rate": percentage(subTrack.submissions.screeningSuccessRate) + "%",
            "Review Success Rate": percentage(subTrack.submissions.reviewSuccessRate) + "%",
            "Appeals Success Rate": percentage(subTrack.submissions.appealSuccessRate) + "%",
            "Average Success Rate": subTrack.submissions.avgPlacement.toFixed(2),
          }
          break;
    }
  }

  render() {
    return (
      <div styleName="view-container">
        {
          this.state.statisticsModalOpen &&
          <StatisticsModal
            onClose={() => this.setState({ statisticsModalOpen: false })}
          />
        }

        <div styleName="page-container">
            <div styleName="profile-container">
                <div styleName="profile-subtrack-container">
                    <div styleName="content">
                        <Header
                            title={this.props.subTrack}
                            modalOpen={()=> this.setState({ statisticsModalOpen: true })}
                            numberOfChallenges={4}
                            activeTitle={'active challenges'}
                        />
                        <nav styleName="tab-panel">
                            <ul styleName="tab-set">
                                <li>
                                    <a href="?track=DEVELOP&subTrack=DESIGN_FIRST_2_FINISH212&tab=statistics">
                                        <div styleName={statsTabStyle}>
                                            statistics
                                        </div>

                                    </a>
                                </li>
                                <li>
                                    <a styleName="selected" href="?track=DEVELOP&subTrack=DESIGN12&tab=challenges">
                                        <div styleName={challengeTabStyle}>
                                            Challenges
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <StatisticsCarousel
                            subtrackArray={this.state.subtrackArray}/>

                        <LineChart data={this.state.data} options={options}
                              width="600" height="250"/>

                        {
                          this.state.showDetails?
                          <StatisticsDevelopDetails
                            subtrackDetailsArray={this.state.developTrackDetailsArray}/>
                            :null
                        }
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default StatisticsPage;
