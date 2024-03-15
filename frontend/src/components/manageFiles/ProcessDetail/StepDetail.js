import { Bar, Pie } from 'react-chartjs-2';
import styles from './ProcessDetail.module.css'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { processReport } from '../../../httpCommon/httpCommon';
import axios from 'axios';
import { processDetailReport } from '../../../utils/helpers';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

const EvaluationReportComponent = () => {
  const [reportData, setReportData] = useState(processDetailReport);


  useEffect(() => {
    // console.log('EvaluationReportComponent mounted');
  }, []);

  const normalityAnalysisData = {
    labels: ['Actual Areas', 'Rectangle Area', 'Slope', 'Slope Percentage Deviation', 'Calculated Slope'],
    datasets: [
      {
        label: 'Analysis Value',
        data:
          [
            reportData?.normality_analysis?.list1?.actual_areas || 3.42,
            reportData?.normality_analysis?.list1?.rectangle_area || 3.73,
            reportData?.normality_analysis?.list1?.slope[0] || 1.84, // assuming only one value in slope array
            reportData?.normality_analysis?.list1?.slope_percentage_deviation || 0.25,
            reportData?.normality_analysis?.list1?.calculated_slope || 1.84
          ],
        backgroundColor: '#FFCE56'
      }
    ]
  };

  const barChartData = {
    labels: ['Mean', 'Median', 'Mode'],
    datasets: [
      {
        label: 'Scores Statistics',
        data: [
          reportData?.central_tendencies?.normal_dist?.mergedMean || 5.0,
          reportData?.central_tendencies?.normal_dist?.mergedMedian || 4.0,
          reportData?.central_tendencies?.normal_dist?.mergedMode?.length || 4.0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const pieChartData = {
    labels: ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5', 'Score 6', 'Score 7'],
    datasets: [
      {
        label: 'score list',
        data: reportData?.score_list || [1, 3, 2, 10, 7, 4, 8], // Values from the 'score_list'
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8B4513',
          '#98FB98',
          '#20B2AA',
          '#FF4500'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8B4513',
          '#98FB98',
          '#20B2AA',
          '#FF4500'
        ],
        borderWidth: 1,
      }
    ]
  };

  let promotersScores = 0;
  let passiveScores = 0;
  let DetractorsScores = 0;
  if (reportData && reportData.score_list) {
    const scoreListLength = reportData.score_list.length;

    promotersScores = ((reportData.score_list.filter(score => score === 9 || score === 10).length) / scoreListLength) * 100;
    passiveScores = ((reportData.score_list.filter(score => score === 7 || score === 8).length) / scoreListLength) * 100;
    DetractorsScores = ((reportData.score_list.filter(score => score > 0 && score <= 6).length) / scoreListLength) * 100;
  }

  const npsScoreDistributionData = {
    labels: ['Detractors', 'Passives', 'Promoters'],
    datasets: [
      {
        data: [DetractorsScores || 20, passiveScores || 10, promotersScores || 65], // Assuming percentages for each category
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  useEffect(() => {
    // console.log("ProcessDetail", ProcessDetail);
    const fetchData = async () => {
      try {
        const requestBody = { process_id: 'abc0099986567abcd' };
        const response = await axios.post('https://100035.pythonanywhere.com/evaluation/evaluation-api/?report_type=process', requestBody);
        // console.log("response", response.data.score_list)
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!reportData) {
    return <Spinner animation="grow" variant="success" />;
  }

  // Process reportData and structure it for chart display
  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: false,  // Set to false to prevent resizing
    // scales: {
    //   y: {
    //     beginAtZero: true
    //   }
    // },
    height: "222px",    // Set your desired height
    width: "450px"      // Set your desired width
  };
  return (
    <div>
      {reportData ? (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className={styles.processHeadingChart2}>
              <h3>Normality Analysis Data:</h3>
            </div>

            <div className={styles.processHeadingChart2}>
              <h3>Bar Chart for Central Tendencies:</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

            <Bar data={normalityAnalysisData} options={barChartOptions} />
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <br />

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className={styles.processHeadingChart2}>
              <h3>Pie Chart for Score List:</h3>
            </div>

            <div className={styles.processHeadingChart2}>
              <h3>Pie Chart for NPS Score Distribution:</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

            <Pie
              data={pieChartData}
              options={barChartOptions}
            />
            <Pie
              data={npsScoreDistributionData}
              options={barChartOptions}
            />
          </div>
        </div>
      ) : (
        <div>
          <h3>No scale attached with this process</h3>
        </div>
      )}

      {/* <div className={styles.processHeadingChart}>
        <h3>Normality Analysis Data:</h3>
      </div>
      <Bar data={normalityAnalysisData} options={barChartOptions}/>
      <br />

      <div className={styles.processHeadingChart}>
        <h3>Bar Chart for Central Tendencies:</h3>
      </div>
      <Bar data={barChartData} options={barChartOptions}/>
      <br />

      <div className={styles.processHeadingChart}>
        <h3>Pie Chart for Score List:</h3>
      </div>
      <Pie
        data={pieChartData}
        options={barChartOptions}
      />
      <br />

      <div className={styles.processHeadingChart}>
        <h3>Pie Chart for NPS Score Distribution:</h3>
      </div>
      <Pie
        data={npsScoreDistributionData}
        options={barChartOptions}
      /> */}
    </div>
  );
};
export default EvaluationReportComponent;
