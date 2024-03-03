import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { workflowAxiosInstance } from "../../../services/axios";
import { routes } from "../../../services/routes";
import { useUserContext } from "../../../contexts/UserContext";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";

const CreateNewTemplatePage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ createLoading, setCreateLoading ] = useState(false);
    const { currentUser } = useUserContext();

    const handleCreateNewTemplate = async (data) => {
        if (!currentUser) return

        setCreateLoading(true);
        
        const createTemplateData = {
            "created_by": currentUser.username,
            "company_id": currentUser.teamcode,
            "template_name": data.templateName,
            "copy_template": data.templateName,
        }

        try {

            const responseData = await (await workflowAxiosInstance.post(routes.createTemplate, createTemplateData)).data;
            if (!responseData.editor_link) return setCreateLoading(false);

            window.location = responseData.editor_link;

        } catch (err) {
            // console.log(err);
            setCreateLoading(false);
            toast.error("Something went wrong while trying to create your template.")
        }
    }

    return <>
        <WorkflowLayout>
            <div className="create__Template__Container">
                <div className="create__Template__Form">
                    <div className="title__Container">
                        <span className="template__Title__Text">Create Template</span>
                    </div>
                    <form onSubmit={handleSubmit(handleCreateNewTemplate)}>
                        <label>
                            <span>Template name*</span>
                            {errors.templateName && <p className="error__Msg">Please enter a template name.</p>}
                            <input type="text" {...register('templateName', { required: true })} />
                        </label>
                        {createLoading ? <div className="spinner__Btn__Container"><LoadingSpinner /></div> : <input type="submit" value="Go to Editor" /> }
                    </form>
                </div>
            </div>
        </WorkflowLayout>
    </>
}

export default CreateNewTemplatePage;