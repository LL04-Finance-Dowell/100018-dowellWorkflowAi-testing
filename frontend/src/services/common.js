export const handleAuthenticationBtnClick = (e, linkToGoTo, runExtraFunction) => {
    e.preventDefault();
    if (runExtraFunction) runExtraFunction();
    window.location.href = linkToGoTo;
}

export const clearLocalStorageItems = () => {
    localStorage.clear("workFlowUser")
    localStorage.clear("session_id")
}
