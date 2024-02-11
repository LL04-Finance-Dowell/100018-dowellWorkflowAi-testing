
import { useNavigate } from 'react-router-dom';
import { DocumentProcessDetailReport } from '../../../utils/helpers';
import { Bar, Pie } from 'react-chartjs-2';
import styles from './ProcessDetail.module.css'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { processReport } from '../../../httpCommon/httpCommon';
import axios from 'axios';
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

export default function DocumentDetailReport() {
	const { ProcessDetail } = useSelector((state) => state.app);
	const { userDetail } = useSelector((state) => state.auth);
	const [documentReportData, setDocumentReportData] = useState(DocumentProcessDetailReport);

	const navigate = useNavigate();

  console.log("ProcessDetail", ProcessDetail)
  console.log("userDetail", userDetail)
  const apiUrl = 'https://100035.pythonanywhere.com/evaluation/evaluation-api/?report_type=document';
  const payload = {
    process_id: 'abcdef12345',
    document_id: ProcessDetail.parent_item_id || 'zyx12345'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(apiUrl, payload);
				setDocumentReportData(response.data.success)
        console.log('API Response:', response.data.success);
        // Do something with the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const normalityAnalysisData = {
    labels: ['Actual Areas', 'Rectangle Area', 'Slope', 'Slope Percentage Deviation', 'Calculated Slope'],
    datasets: [
      {
        label: 'Analysis Value',
        data:
          [
            documentReportData?.normality_analysis?.list1?.actual_areas || 3.42,
            documentReportData?.normality_analysis?.list1?.rectangle_area || 3.73,
            documentReportData?.normality_analysis?.list1?.slope[0] || 1.84, // assuming only one value in slope array
            documentReportData?.normality_analysis?.list1?.slope_percentage_deviation || 0.25,
            documentReportData?.normality_analysis?.list1?.calculated_slope || 1.84
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
          documentReportData?.central_tendencies?.normal_dist?.mergedMean || 5.0,
          documentReportData?.central_tendencies?.normal_dist?.mergedMedian || 4.0,
          documentReportData?.central_tendencies?.normal_dist?.mergedMode?.length || 4.0
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
        data: documentReportData?.score_list || [1, 3, 2, 10, 7, 4, 8], // Values from the 'score_list'
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
  if (documentReportData && documentReportData.score_list) {
    const scoreListLength = documentReportData.score_list.length;

    promotersScores = ((documentReportData.score_list.filter(score => score === 9 || score === 10).length) / scoreListLength) * 100;
    passiveScores = ((documentReportData.score_list.filter(score => score === 7 || score === 8).length) / scoreListLength) * 100;
    DetractorsScores = ((documentReportData.score_list.filter(score => score > 0 && score <= 6).length) / scoreListLength) * 100;
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

  if (!documentReportData) {
    return <Spinner animation="grow" variant="success" />;
  }

  // Process documentReportData and structure it for chart display
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
      {documentReportData ? (
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
            <Bar data={barChartData} options={barChartOptions} />x
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
    </div>
  );
}
