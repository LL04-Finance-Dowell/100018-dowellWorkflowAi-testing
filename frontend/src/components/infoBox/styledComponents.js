import styled from "styled-components";

export const InfoBoxContainer = styled.div`
  display: flex;
  /*  width: min(14vw, 160px); */
  flex-direction: column;
  color: var(--e-global-color-text);
  font-weight: 700;
  border: 1px solid var(--e-global-color-text);
  overflow: hidden;
  align-self: flex-start;
`;

export const InfoTitleBox = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--e-global-color-text);
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
  display: flex;
  flex-direction: column;
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
  /*   height: 100px;
  overflow-y: auto;
  overflow-x: hidden; */
  display: flex;
  flex-direction: column;
  transition: ease all 1s;
  scrollbar-width: none;
  padding-right: 10px;
  margin-block: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const InfoContentText = styled.li`
  line-height: 18px;
  text-align: start;
  font-size: 12px;
  white-space: break-spaces;
  font-weight: 400;
  font-family: "Roboto";
  cursor: pointer;
`;

export const InfoContentFormText = styled.li`
  display: flex;
  gap: 10px;
  align-items: center;
`;
