import styled from "styled-components";

export const Box = styled.div`
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#C3D7BE")};
`;

/* export const CardContainer = styled.div`
  height: 280px;
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: 1s ease all;
  border-radius: 5px;
`;

export const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
  text-align: center;
  line-height: 21px;
`;

export const SubTitle = styled.h3`
  font-size: 14px;
  line-height: 21px;
  font-weight: 500;
`;

export const CardBox = styled.div`
  width: 100%;
  padding: 37px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: var(--e-global-color-cd6593d);
`;

export const CurrentCard = styled.div`
  background-color: var(--e-global-color-primary);
`;

export const HoverCard = styled.div`
  transform: translateY(100%);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #4054b2 !important;
  transition: 1s ease all;
`;
 */

{
  /*  <i>
    <FaSignature size={62} />
  </i> */
}
{
  /* <h2 className={styles.title}>To be signed</h2> */
}
/* 
<div className={styles.container}>
<Box bgColor={bgColor} className={`${styles.box}`}>

  <span className={styles.title}>
    {(feature && feature.includes("document") && item.document_name) ||
      (feature === "template" && item.template_name) ||
      (feature === "workflow" && item.workflow_name)}
  </span>
</Box>
<div className={`${styles.box} ${styles.hover__box}`}>
  {feature === "workflow" ? (
    <>
      <h2 className={styles.step__text}>step1 - admin</h2>
      <div className={styles.button__group}>
        <button className={styles.update__button}>update</button>
        <button className={styles.delete__button}>delete</button>
      </div>
    </>
  ) : (
    <>
      <h2 className={styles.title}>{item.document_name}</h2>
      <span className={styles.sub__title}>Thumb nail of file</span>
      <button
        className={styles.detail__button}
        onClick={handleDetail}
        tabIndex={-30}
      >
        Click here
      </button>
    </>
  )}
</div>
</div> */
