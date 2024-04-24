import React, { useEffect, useState } from 'react';
import parentStyles from '../assignCollapse.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import Radio from '../../../../../radio/Radio';
import Select from '../../../../../select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { continentsData } from '../../../../../../../utils/continentsData';
import { getRegionsInCountry } from '../../../../../../../services/locationServices';
import ProgressBar from '../../../../../../progressBar/ProgressBar';

import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from '../../../../../../../features/processes/processesSlice';


const Location = ({ currentStepIndex, stepsPopulated }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    watch,
  } = useForm();
  const { t } = useTranslation();
  const { continent, country } = watch();
  const dispatch = useDispatch();
  const [currentLocationChoice, setCurrentLocationChoice] = useState(null);
  const [showLocationDropdowns, setShowLocationDropdowns] = useState(false);
  const { docCurrentWorkflow, processSteps } =
    useSelector((state) => state.processes);
  const { continents, continentsLoaded } = useSelector(state => state.continent);
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [regions, setRegions] = useState([]);

  const handleSetLocation = (data) => {
    if (data.locationChoice === 'selectLocation') {
      dispatch(
        updateSingleProcessStep({
          stepLocation: 'select',
          stepContinent: data.continent,
          stepCountry: data.country,
          stepCity: data.displayDocitycument,
          workflow: docCurrentWorkflow._id,
          indexToUpdate: currentStepIndex,
        })
      );
      return;
    }
    dispatch(
      updateSingleProcessStep({
        stepLocation: 'any',
        workflow: docCurrentWorkflow._id,
        indexToUpdate: currentStepIndex,
      })
    );
  };

  useEffect(() => {
    if (currentLocationChoice && currentLocationChoice === 'selectLocation')
      return setShowLocationDropdowns(true);

    setShowLocationDropdowns(false);
  }, [currentLocationChoice]);

  useEffect(() => {
    if (!continent || !continentsData[continent]) {
      setCountries([]);
      setRegions([]);
      return;
    }

    setCountries(
      continentsData[continent].map((country) => {
        const countryOption = {};
        countryOption.id = crypto.randomUUID();
        countryOption.option = country;
        return countryOption;
      })
    );
    setRegions([]);
  }, [continent]);

  useEffect(() => {
    if (!country || !continent) return;

    setRegionsLoading(true);

    getRegionsInCountry(userDetail?.userinfo?.username, session_id, country)
      .then((res) => {
        const formattedData = res.data.map((item) => {
          const regionOption = { ...item };
          regionOption.option = regionOption.name;
          return regionOption;
        });
        setRegions(formattedData);
        setRegionsLoading(false);
      })
      .catch((err) => {
        // console.log('Failed to fetch regions in ', country);
        setRegionsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent, country]);

  return (
    <>
      <form
        className={parentStyles.content__box}
        onSubmit={handleSubmit(handleSetLocation)}
      >
        <div>
          <div   style={{marginBottom: '5px'}}>
          <Radio
            register={register}
            value='anyLocation'
            name={'locationChoice'}
            onChange={() => setCurrentLocationChoice('anyLocation')}
            checked={
              processSteps.find(
                (process) => process.workflow === docCurrentWorkflow?._id
              )?.steps[currentStepIndex]?.stepLocation === 'any'
            }
          
          >
            {t('Any Location')}
          </Radio>
          </div>
          <Radio
            register={register}
            value='selectLocation'
            name={'locationChoice'}
            onChange={() => setCurrentLocationChoice('selectLocation')}
            checked={
              processSteps.find(
                (process) => process.workflow === docCurrentWorkflow?._id
              )?.steps[currentStepIndex]?.stepLocation === 'select'
            }
          >
            {t('Select Location')}
          </Radio>
        </div>
        {showLocationDropdowns ? (
          <div>
            {!continentsLoaded ? (
              <ProgressBar durationInMS={6000} />
            ) : continents.length === 0 ? (
              <span style={{ fontSize: '0.8rem' }}>
                No continents available
              </span>
            ) : (
              <Select
                options={continents}
                register={register}
                name='continent'
                takeOptionValue={true}
              />
            )}
            {continent ? (
              countries.length < 1 ? (
                <span style={{ fontSize: '0.8rem' }}>
                  No countries found for {continent}
                </span>
              ) : (
                <Select
                  options={countries}
                  register={register}
                  name='country'
                  takeOptionValue={true}
                />
              )
            ) : (
              <></>
            )}
            {!continent || !country ? (
              <></>
            ) : regionsLoading ? (
              <div>
                <span style={{ fontSize: '0.8rem' }}>
                  Regions in {country} loading...
                </span>
                <ProgressBar durationInMS={6000} style={{ height: '2rem' }} />
              </div>
            ) : (
              <Select
                options={regions}
                register={register}
                name='displayDocitycument'
                takeOptionValue={true}
              />
            )}
          </div>
        ) : (
          <></>
        )}
        <button className={parentStyles.primary__button}>{t('set location')}</button>
      </form>
      {isSubmitted ||
      processSteps.find(
        (process) => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.stepLocation ? (
        <p style={{ margin: '0', padding: '0px 20px 10px' }}>{t('Saved')}</p>
      ) : (
        <></>
      )}
    </>
  );
};

export default Location;

// export const continents = [
//   { id: uuidv4(), option: "asia" },
//   { id: uuidv4(), option: "africa" },
//   { id: uuidv4(), option: "europa" },
//   { id: uuidv4(), option: "america" },
// ];

// export const countries = [
//   { id: uuidv4(), option: "india" },
//   { id: uuidv4(), option: "kenya" },
//   { id: uuidv4(), option: "germany" },
//   { id: uuidv4(), option: "USA" },
// ];

export const cities = [
  { id: uuidv4(), option: 'delhi' },
  { id: uuidv4(), option: 'nairobi' },
  { id: uuidv4(), option: 'munich' },
  { id: uuidv4(), option: 'newyork' },
];
