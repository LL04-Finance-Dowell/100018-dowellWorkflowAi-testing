import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiFillCheckSquare, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import './typefilter.css';

import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'react-toastify';
import { setIsSelected } from '../../utils/helpers';
import { setPortfoliosInWorkflowAITeams, setTeamsInWorkflowAI } from '../../features/processes/processesSlice';
import { setSelectedPortfolioTypeForWorkflowSettings } from '../../features/app/appSlice';

const TypeFilter = ({ edit }) => {
  const filterOpts = ['user', 'team_member', 'public'];
  const [isDropdown, setIsDropdown] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const [userPortfolios] = useState(
    userDetail?.portfolio_info?.find((item) => item.product === 'Workflow AI' && item.member_type === 'owner')
      ? userDetail?.userportfolio
      : userDetail?.selected_product?.userportfolio
  );

  const { filter, setFilter } = useAppContext();

  const dispatch = useDispatch();

  useEffect(() => {
    let filteredPortfolios;
    if (filter && userPortfolios)
      filteredPortfolios = userPortfolios.filter(
        (item) => item.member_type === filter
      );
    else if (userPortfolios) filteredPortfolios = userPortfolios;

    if (
      (Array.isArray(filteredPortfolios) && filteredPortfolios.length) ||
      filter
    ) {
      if (filteredPortfolios && filteredPortfolios.length)
        dispatch(
          setPortfoliosInWorkflowAITeams({
            type: 'filter',
            payload: filteredPortfolios.map((item) => item.portfolio_name),
          })
        );
      else
        dispatch(
          setPortfoliosInWorkflowAITeams({
            type: 'filter',
            payload: [],
          })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <section
      className='type_filter_sect'
      style={edit ? { top: '-28px', right: '200px' } : {}}
    >
      <button
        className='drop_btn'
        onClick={() => setIsDropdown(!isDropdown)}
        style={edit ? { backgroundColor: '#0d6efd' } : {}}
        type='button'
      >
        type{' '}
        <span className='drop_icon'>
          {isDropdown ? <AiOutlineUp /> : <AiOutlineDown />}
        </span>
      </button>

      <div className={`drop_opts_wrapper ${isDropdown ? 'active' : ''}`}>
        <DropOpt
          setFilter={setFilter}
          filter={filter}
          filterOpts={filterOpts}
          edit={edit}
        />
      </div>
    </section>
  );
};

const DropOpt = ({ setFilter, filter, filterOpts, edit }) => {
  const optsRef = useRef([]);
  const dispatch = useDispatch();
  const { workflowTeams, selectedTeamIdGlobal } = useAppContext();
  const [clicks, setClicks] = useState(false);
  const { teamsInWorkflowAI } = useSelector((state) => state.processes);

  const portfolios = teamsInWorkflowAI[0]?.children[1]?.column[0]?.items;

  const unselectAllPortfolios = () => {
    const selectedItems = setIsSelected({
      items: teamsInWorkflowAI[0]?.children,
      item: null,
      title: '',
      boxId: teamsInWorkflowAI[0]?.children[1]._id,
      type: 'unselect_all',
    });
    dispatch(setTeamsInWorkflowAI(selectedItems));
  };

  const handleOptClick = (e) => {
    const optsEl = [...new Set(optsRef.current.filter((el) => el))];
    // *Prevent user from adding portfolios of different types to teams
    // TODO Add condition to let use same fuctionality for Editting
    if (
      selectedTeamIdGlobal &&
      (!workflowTeams.find((team) => team._id === selectedTeamIdGlobal) ||
        edit) &&
      portfolios.find((prt) => prt.isSelected)
    ) {
      if (!clicks) {
        toast.warn(
          'Changing type will unselect previously selected portfolios!'
        );
        toast.info('Click again to select type');
        setClicks(true);
      }

      if (clicks) {
        unselectAllPortfolios();
        optsEl.forEach((el) => {
          el.classList.remove('active');
        });
        e.currentTarget.classList.toggle('active');
        setFilter(e.currentTarget.id !== 'all' ? e.currentTarget.id : '');
        dispatch(
          setSelectedPortfolioTypeForWorkflowSettings(e.currentTarget.id)
        );
        setClicks(false);
      }
    } else {
      optsEl.forEach((el) => {
        el.classList.remove('active');
      });
      e.currentTarget.classList.toggle('active');
      setFilter(e.currentTarget.id !== 'all' ? e.currentTarget.id : '');
      dispatch(setSelectedPortfolioTypeForWorkflowSettings(e.currentTarget.id));
    }
  };

  useEffect(() => {
    if (optsRef.current.length) {
      const optsEl = [...new Set(optsRef.current.filter((el) => el))];
      optsEl.forEach((el) => {
        el.classList.remove('active');
      });
      optsEl.find((el) => el.id === filter).classList.add('active');
    }
  }, [optsRef, filter]);

  useEffect(() => {
    dispatch(setSelectedPortfolioTypeForWorkflowSettings(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {filterOpts.map((name, ind) => {
        return (
          <article
            key={ind}
            className={`drop_opt_wrapper ${name === 'all' ? 'active' : ''}`}
            onClick={handleOptClick}
            ref={(el) => optsRef.current.push(el)}
            id={name}
          >
            <div className={`drop_opt`}>
              <span className='filter_name'>{name.replace('_', ' ')}</span>
              <span
                className='select_icon'
                style={edit ? { color: '#0d6efd' } : {}}
              >
                <AiFillCheckSquare />
              </span>
            </div>
          </article>
        );
      })}
    </>
  );
};

export default TypeFilter;
