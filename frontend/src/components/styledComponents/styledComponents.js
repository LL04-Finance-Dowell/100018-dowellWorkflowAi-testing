import styled from "styled-components";

export const PrimaryButton = styled.button`
  padding: 10px 20px;
  width: 100%;
  background-color: var(--e-global-color-9d2ac19);
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  border-radius: 2px;
  cursor: pointer;
  text-transform: capitalize;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${(props) =>
      props.hoverBg === "success"
        ? "var(--e-global-color-accent )"
        : props.hoverBg === "error"
        ? "var(--e-global-color-1342d1f )"
        : "var(--e-global-color-9d2ac19)"};
    color: white;
    filter: ${(props) => 
      props.darkBgOnHover ? 
      "brightness(0.9)" 
      : 
      "brightness(1)"
    };
  }
  &:focus {
    border: solid 2px black;
  }
`;
