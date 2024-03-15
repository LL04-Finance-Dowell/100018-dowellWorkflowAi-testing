import React, { useState, useEffect } from 'react';
import './editTeamModal.css';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../contexts/AppContext';
import TypeFilter from '../infoBox/TypeFilter';
import { setIsSelected } from '../../utils/helpers';

import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setTeamsInWorkflowAI, setUpdateInWorkflowAITeams } from '../../features/processes/processesSlice';

const EditTeamModal = ({ show, setShow, handleUpdateTeam, items }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [spec, setSpec] = useState('');
  const [details, setDetails] = useState('');
  const [uniCode, setUniCode] = useState('');
  const { teamsInWorkflowAI } = useSelector((state) => state.processes);
  // const [selectedTeam, setSelectedTeam] = useState();
  const [isPortfolios, setIsPortfolios] = useState(false);
  const {
    workflowTeams,
    setWorkflowTeams,
    setRerun,
    sync,
    setSync,
    isFetchingTeams,
  } = useAppContext();
  const [portfolios, setPortfolios] = useState([]);
  const dispatch = useDispatch();
  const [clicks, setClicks] = useState(false);
  const [activateBtn, setActivateBtn] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e, item) => {
    const selectedItems = setIsSelected({
      items: teamsInWorkflowAI[0].children,
      item,
      boxId: teamsInWorkflowAI[0].children[1]._id,
      title: teamsInWorkflowAI[0].children[1].column[0].proccess_title,
      type: 'checkbox',
    });
    dispatch(setTeamsInWorkflowAI(selectedItems));
  };

  const handleClose = () => {
    if (!clicks) {
      toast.warn('Changes will not be saved! Click again to close');
      setClicks(true);
    }
    if (clicks) {
      setShow(false);
      setRerun(true);
      setClicks(false);
      setSync(true);
    }
  };

  const handleDone = (e) => {
    e.preventDefault();
    const team = {
      name: name.trim(),
      code: code.trim(),
      spec: spec.trim(),
      details: details.trim(),
      universalCode: uniCode.trim(),
    };
    handleUpdateTeam(team);
    setShow(false);
  };

  useEffect(() => {
    //   setSelectedTeam(
    //     teamsInWorkflowAI[0].children[0].column[0].items.find(
    //       (item) => item.isSelected
    //     )
    //   );

    setPortfolios(teamsInWorkflowAI[0].children[1].column[0].items);
  }, [teamsInWorkflowAI]);

  useEffect(() => {
    if (show || isFetchingTeams)
      document.documentElement.style.overflow = 'hidden';
    else document.documentElement.style.overflow = 'auto';
  }, [show, isFetchingTeams]);

  useEffect(() => {
    if (teamsInWorkflowAI) {
      const updateTeamDetails =
        teamsInWorkflowAI[0].children[2].column[0].items.map(
          (item) => item.content
        );

      if (sync) {
        if (updateTeamDetails.length) {
          updateTeamDetails.forEach(({ title, content }) => {
            switch (title) {
              case 'Name':
                setName(content);
                break;
              case 'Code':
                setCode(content);
                break;
              case 'Specification':
                setSpec(content);
                break;
              case 'Details':
                setDetails(content);
                break;
              case 'Universal code':
                setUniCode(content);
                break;
              default:
                throw new Error('Something is wrong');
            }
          });
        } else {
          setName('');
          setCode('');
          setSpec('');
          setDetails('');
          setUniCode('');
        }
        setSync(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, teamsInWorkflowAI]);

  useEffect(() => {
    const checkSelectedPortfolios =
      teamsInWorkflowAI[0].children[1].column[0].items.find(
        (item) => item.isSelected
      );
    if (
      !name ||
      !code ||
      !spec ||
      !details ||
      !uniCode ||
      !checkSelectedPortfolios
    )
      setActivateBtn(false);
    else setActivateBtn(true);
  }, [teamsInWorkflowAI, name, code, spec, details, uniCode]);

  useEffect(() => {
    if (
      show &&
      workflowTeams.find((item) => item._id === items[0]._mId).newly_created
    ) {
      setWorkflowTeams([]);
      dispatch(setUpdateInWorkflowAITeams());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <section className={`edit_modal_sect ${show ? 'show' : ''}`}>
      <div className={`edit_form_wrapper ${show ? 'show' : ''}`}>
        <h3 className='title'>
          Edit Team{' '}
          <button
            className='close_btn'
            style={{ marginTop: 0 }}
            type='button'
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </h3>

        <form className='edit_form' onSubmit={handleSubmit}>
          <div className={`team_details ${isPortfolios ? 'hide_segment' : ''}`}>
            <div className='form_opt'>
              <label>
                Name{' '}
                <input
                  type='text'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>

            <div className='form_opt'>
              <label>
                Code{' '}
                <input
                  type='text'
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
            </div>

            <div className='form_opt'>
              <label>
                Specification{' '}
                <input
                  type='text'
                  required
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                />
              </label>
            </div>

            <div className='form_opt'>
              <label>
                Details{' '}
                <input
                  type='text'
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </label>
            </div>

            <div className='form_opt'>
              <label>
                Universal Code{' '}
                <input
                  type='text'
                  required
                  value={uniCode}
                  onChange={(e) => setUniCode(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div
            className={`portfolio_details ${
              !isPortfolios ? 'hide_segment' : ''
            }`}
          >
            <TypeFilter edit={true} />
            {portfolios.map((item) => {
              return item.isShow ? (
                <div className='form_opt' key={item._id}>
                  <label>
                    <input
                      type='checkbox'
                      name='portfolios'
                      value={item.content}
                      checked={item.isSelected ? true : false}
                      onChange={(e) => handleChange(e, item)}
                    />
                    {item.content}
                  </label>
                </div>
              ) : (
                ''
              );
            })}
          </div>

          <div className='btns_wrapper'>
            <button
              className='done_btn'
              type='submit'
              disabled={!activateBtn}
              style={
                !activateBtn
                  ? {
                      filter: 'grayscale(0.5)',
                      cursor: 'not-allowed',
                      marginTop: 0,
                    }
                  : { marginTop: 0 }
              }
              onClick={handleDone}
            >
              Done
            </button>
            <button
              className='nav_btn'
              type='button'
              style={{ marginTop: 0 }}
              onClick={() => setIsPortfolios(!isPortfolios)}
            >
              {isPortfolios ? 'Team Details' : 'Portfolios'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditTeamModal;
