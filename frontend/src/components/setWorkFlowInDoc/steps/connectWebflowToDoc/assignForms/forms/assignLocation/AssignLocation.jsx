import Select from '../../../../../select/Select';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import FormLayout from '../../../../../formLayout/FormLayout';
import { useState } from 'react';
import AssignButton from '../../../../../assignButton/AssignButton';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { continentsData } from '../../../../../../../utils/continentsData';
import ProgressBar from '../../../../../../progressBar/ProgressBar';
import { getRegionsInCountry } from '../../../../../../../services/locationServices';
import { updateSingleProcessStep } from '../../../../../../../features/processes/processesSlice';

const AssignLocation = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { docCurrentWorkflow, continents, continentsLoaded } = useSelector(
    (state) => state.processes
  );
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { continent, country } = watch();
  const [countries, setCountries] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [regions, setRegions] = useState([]);

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
    if (!country) return;

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
       
        setRegionsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const onSubmit = (data) => {
    setLoading(true);
   
    dispatch(
      updateSingleProcessStep({
        ...data,
        indexToUpdate: currentStepIndex,
        workflow: docCurrentWorkflow._id,
      })
    );
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      {!continentsLoaded ? (
        <ProgressBar durationInMS={6000} />
      ) : continents.length > 0 ? (
        <>
          <Select
            register={register}
            name='continent'
            options={continents}
            takeNormalValue={true}
          />
          {continent && (
            <Select
              register={register}
              name='country'
              options={countries}
              takeNormalValue={true}
            />
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            {!country ? (
              <></>
            ) : regionsLoading ? (
              <div>
                <span style={{ fontSize: '0.8rem' }}>
                  Regions in {country} loading...
                </span>
                <ProgressBar durationInMS={6000} />
              </div>
            ) : (
              <Select
                register={register}
                name='location'
                options={regions}
                takeNormalValue={true}
              />
            )}
            <AssignButton buttonText='Assign Location' loading={loading} />
          </form>
        </>
      ) : (
        <></>
      )}
    </FormLayout>
  );
};

export default AssignLocation;

export const locations = [
  { id: uuidv4(), option: 'Mumbai' },
  { id: uuidv4(), option: 'London' },
  { id: uuidv4(), option: 'Newyork' },
];
