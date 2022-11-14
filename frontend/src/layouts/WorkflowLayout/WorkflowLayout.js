import "./style.css";

const WorkflowLayout = ({ children }) => {
    return <>
        <>
            <main className="workflow_Layout_Content">
                { children }
            </main>
        </>
    </>
}

export default WorkflowLayout;
