export const handleAuthenticationBtnClick = (e, linkToGoTo, runExtraFunction) => {
    e.preventDefault();
    if (runExtraFunction) runExtraFunction();
    window.location.href = linkToGoTo;
}
