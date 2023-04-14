import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiFillCheckSquare, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import './typefilter.css';
import { v4 } from 'uuid';
import { setPortfoliosInWorkflowAITeams, setSelectedPortfolioTypeForWorkflowSettings } from '../../features/app/appSlice';

const TypeFilter = () => {
  const [filter, setFilter] = useState('');
  const [filterOpts, setFilterOpts] = useState([
    'user',
    'team_member',
    'public',
  ]);
  const [isDropdown, setIsDropdown] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const [userPortfolios, setUserPortfolios] = useState();
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const { teamsInWorkflowAI } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserPortfolios(userDetail?.selected_product?.userportfolio);
  }, [userDetail]);

  useEffect(() => {
    // console.log(userPortfolios);
    if (filter && userPortfolios)
      setFilteredPortfolios(
        userPortfolios.filter((item) => item.member_type === filter)
      );
    else if (userPortfolios) setFilteredPortfolios(userPortfolios);
  }, [filter, userPortfolios]);

  useEffect(() => {
    if (filteredPortfolios.length || filter) {
      // console.log(filteredPortfolios.map((item) => item.portfolio_name));
      if (filteredPortfolios.length)
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
  }, [filteredPortfolios]);

  return (
    <section className='type_filter_sect'>
      <button className='drop_btn' onClick={() => setIsDropdown(!isDropdown)}>
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
        />
      </div>
    </section>
  );
};

const DropOpt = ({ setFilter, filter, filterOpts }) => {
  const optsRef = useRef([]);
  const dispatch = useDispatch();

  const handleOptClick = (e) => {
    const optsEl = [...new Set(optsRef.current.filter((el) => el))];
    optsEl.forEach((el) => {
      el.classList.remove('active');
    });
    e.currentTarget.classList.toggle('active');
    setFilter(e.currentTarget.id !== 'all' ? e.currentTarget.id : '');
    dispatch(setSelectedPortfolioTypeForWorkflowSettings(e.currentTarget.id));
  };

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
              <span className='select_icon'>
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
