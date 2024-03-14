import React, { useState, useCallback, memo } from 'react';

import styles from './assignCollapse.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

import Display from './display/Display';
import Location from './location/Location';
import Time from './time/Time';
import Reminder from './reminder/Reminder';
import { Collapse } from 'react-bootstrap';
import { ImMinus, ImPlus } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AssignCollapse = ({ currentStepIndex, stepsPopulated }) => {
  const [asignCollapses, setAssignCollapses] = useState(collapses);
  const { t } = useTranslation();

  const { processSteps, docCurrentWorkflow } = useSelector(
    (state) => state.processes
  );

  const handleCollapse = useCallback((id) => {
    
    setAssignCollapses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }, []);

  return (
    <div className={styles.container}>
      {processSteps.find(
        (process) => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? (
        <p>{t('Step skipped')}</p>
      ) : (
        <>
          {asignCollapses.map((collapse) => (
            <div key={collapse.id} className={styles.box}>
              <div
                onClick={() => handleCollapse(collapse.id)}
                className={styles.header__box}
              >
                <i className={styles.sign}>
                  {collapse.isOpen ? <ImMinus /> : <ImPlus />}
                </i>
                <span> {t(`${collapse.title}`)}</span>
              </div>
              <Collapse in={collapse.isOpen}>
                <div>
                  {
                    <collapse.component
                      currentStepIndex={currentStepIndex}
                      stepsPopulated={stepsPopulated}
                    />
                  }
                </div>
              </Collapse>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default memo(AssignCollapse);

export const collapses = [
  {
    id: uuidv4(),
    title: 'Display',
    component: Display,
    isOpen: false,
  },
  {
    id: uuidv4(),
    title: 'Location',
    component: Location,
    isOpen: false,
  },
  {
    id: uuidv4(),
    title: 'Time',
    component: Time,
    isOpen: false,
  },
  {
    id: uuidv4(),
    title: 'Reminder',
    component: Reminder,
    isOpen: false,
  },
];

export const displayDocument = [
  { id: uuidv4(), option: 'Display document before processing this step' },
  { id: uuidv4(), option: 'Display document after processing this step' },
  { id: uuidv4(), option: 'Display document only in this step' },
  { id: uuidv4(), option: 'Display document in all steps' },
];

export const continents = [
  { id: uuidv4(), option: 'asia' },
  { id: uuidv4(), option: 'africa' },
  { id: uuidv4(), option: 'europa' },
  { id: uuidv4(), option: 'america' },
];

export const countries = [
  { id: uuidv4(), option: 'india' },
  { id: uuidv4(), option: 'kenya' },
  { id: uuidv4(), option: 'germany' },
  { id: uuidv4(), option: 'USA' },
];

export const cities = [
  { id: uuidv4(), option: 'delhi' },
  { id: uuidv4(), option: 'nairobi' },
  { id: uuidv4(), option: 'munich' },
  { id: uuidv4(), option: 'newyork' },
];

export const times = [
  { id: uuidv4(), option: 'within 1 hour' },
  { id: uuidv4(), option: 'within 8 hours' },
  { id: uuidv4(), option: 'within 24 hours' },
  { id: uuidv4(), option: 'within 3 days' },
  { id: uuidv4(), option: 'within 7 days' },
];

export const reminder = [
  { id: uuidv4(), option: 'No reminder' },
  { id: uuidv4(), option: 'Send reminder every hour' },
  { id: uuidv4(), option: 'Send reminder every day' },
  { id: uuidv4(), option: 'I will decide later' },
];
