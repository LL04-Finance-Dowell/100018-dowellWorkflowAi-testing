import styled from "styled-components";

export const Box = styled.div`
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#ECF0F1")};
`;

export const Button = styled.div`
  padding: 6px 12px;
  border: 2px solid var(--e-global-color-secondary);
  color: var(--e-global-color-secondary);
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: transparent;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
`;
