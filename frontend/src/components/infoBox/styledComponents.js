import styled from "styled-components";

export const InfoBoxContainer = styled.div`
  border: none;
  display: flex;
  /*  width: min(14vw, 160px); */
  flex-direction: column;
  color: var(--e-global-color-text);
  font-weight: 700;
  /*  border: 1px solid var(--e-global-color-text); */
  overflow: hidden;
  align-self: flex-start;
`;

export const InfoTitleBox = styled.div`
  width: 100%;
  /* border-bottom: 1px solid var(--e-global-color-text); */
  border: 1px solid var(--e-global-color-text);
  padding: 15px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  flex-wrap: wrap;
  text-transform: capitalize;
  color: var(--e-global-color-text) !important;
`;

export const InfoContentContainer = styled.div`
  /* border: solid red 1px; */
  border: 1px solid var(--e-global-color-text);
  border-top: 0;
  display: flex;
  flex-direction: column;
  line-height: 18px;
  text-align: start;
  font-size: 12px;
  white-space: break-spaces;
  font-weight: 400;
  font-family: "Roboto";
`;

export const InfoSearchbar = styled.input`
  max-width: 100%;
  margin-inline: auto;
  background-color: transparent;
  outline: none;
  border-bottom: 1px solid var(--e-global-color-text);
  padding-left: 10px;
  padding-block: 6px;
`;

export const InfoContentBox = styled.ol`
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  transition: ease all 1s;
  scrollbar-width: none;
  padding-right: 10px;
  margin-block: 10px;
  list-style: none;
  padding-inline: 20px;
  gap: 2px;
`;

export const InfoContentText = styled.li`
  padding-left: 5px;
`;

export const InfoContentFormText = styled.li`
  display: flex;
  padding-left: 5px;
  gap: 10px;
  align-items: center;
`;
