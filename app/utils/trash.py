

def verification_link(username, role, portfolio, user_type, org_name, process_id):
    params = {
        "org": "WorkflowAI",
        "username": username,
        "auth_role": role,
        "portfolio": portfolio,
        "user_type": user_type,
        "org_name": org_name,
        "process_id": process_id,
    }
    encoded_param = urllib.parse.urlencode(params)
    return f"{VERIFICATION_LINK}/?{encoded_param}"


def begin_process(process):
    links = []
    process["links"] = []
    for step in process["process_steps"]:
        for user in step.get("stepTeamMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "team",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
        for user in step.get("stepUserMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "user",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
        for user in step.get("stepPublicMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "team",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
    step1users = []
    for user in process["process_steps"][0].get("stepTeamMembers"):
        step1users.append(user["member"])
    for user in process["process_steps"][0].get("stepUserMembers"):
        step1users.append(user["member"])

    single_document = cloning_document(
        process["parent_item_id"], step1users, process["parent_item_id"], process["_id"]
    )
    for user in step1users:
        process["process_steps"][0].get("stepDocumentCloneMap").append(
            {user: single_document}
        )

    for user in process["process_steps"][0].get("stepPublicMembers"):
        public_document = cloning_document(
            process["parent_item_id"], user, process["parent_item_id"], process["_id"]
        )
        process["process_steps"][0].get("stepDocumentCloneMap").append(
            {user: public_document}
        )
    update_process_with_links(
        process["_id"], process["process_steps"], "processing", process["links"]
    )
    return {"links": links}


def give_access(process, role, username, user_type):
    for step in process["process_steps"]:
        if step.get("stepRole") == role:
            if user_type == "public":
                username = username[0]
            if any(username in dmap for dmap in step.get("stepDocumentCloneMap")):
                for dmap in step.get("stepDocumentCloneMap"):
                    document_id = dmap.get(username)
    editor_link = access_editor(document_id, "document")
    return editor_link


def multistep(document_id, process):
    steps = process["process_steps"]
    parent_id = process["parent_item_id"]
    process_id = process["_id"]
    process_type = process["process_type"]
    no_of_steps = sum(isinstance(e, dict) for e in steps)
    for document_map in steps[0].get("stepDocumentCloneMap"):
        for _, v in document_map.items():
            if get_document_object(v).get("document_state") != "finalized":
                return
    if no_of_steps > 1:
        if steps[1]:
            print("2")
            if steps[1]["stepDocumentCloneMap"]:
                for document_map in steps[1].get("stepDocumentCloneMap"):
                    for _, v in document_map.items():
                        if get_document_object(v).get("document_state") != "finalized":
                            return
            else:
                if steps[1].get("stepTaskType") == "request_for_task":
                    for user in steps[1].get("stepTeamMembers"):
                        clone_id = cloning_document(
                            document_id, user, parent_id, process_id
                        )
                        steps.get("stepDocumentCloneMap").append({user: clone_id})
                    for user in steps[1].get("stepPublicMembers"):
                        clone_id = (
                            document_id,
                            user,
                            parent_id,
                            process_id,
                        )
                        steps.get("stepDocumentCloneMap").append({user: clone_id})
                    for user in steps[1].get("stepUserMembers"):
                        clone_id = cloning_document(
                            document_id, user, parent_id, process_id
                        )
                        steps.get("stepDocumentCloneMap").append({user: clone_id})
                if steps[1].get("stepTaskType") == "assign_task":
                    step1_documents = []
                    for _, v in steps[0].get("stepDocumentCloneMap"):
                        step1_documents.append(v)
                    for document in step1_documents:
                        for user in steps[1].get("stepTeamMembers"):
                            authorize(
                                document, user, process_id, process_type
                            )
                            steps[1].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
                        for user in steps[1].get("stepPublicMembers"):
                            authorize(
                                document, user, process_id, process_type
                            )
                            steps[1].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
                        for user in steps[1].get("stepUserMembers"):
                            authorize(
                                document, user, process_id, process_type
                            )
                            steps[1].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
            if steps[2]:
                print("3")
                if steps[2]["stepDocumentCloneMap"]:
                    for document_map in steps[2].get("stepDocumentCloneMap"):
                        for _, v in document_map.items():
                            if (
                                get_document_object(v).get("document_state")
                                != "finalized"
                            ):
                                return
                else:
                    if steps[2].get("stepTaskType") == "request_for_task":
                        for user in steps[2].get("stepTeamMembers"):
                            clone_id = cloning_document(
                                document_id, user, parent_id, process_id
                            )
                            steps.get("stepDocumentCloneMap").append({user: clone_id})
                        for user in steps[2].get("stepPublicMembers"):
                            clone_id = (
                                document_id,
                                user,
                                parent_id,
                                process_id,
                            )
                            steps.get("stepDocumentCloneMap").append({user: clone_id})
                        for user in steps[2].get("stepUserMembers"):
                            clone_id = cloning_document(
                                document_id, user, parent_id, process_id
                            )
                            steps.get("stepDocumentCloneMap").append({user: clone_id})
                    if steps[2].get("stepTaskType") == "assign_task":
                        step2_documents = []
                        for _, v in steps[1].get("stepDocumentCloneMap"):
                            step2_documents.append(v)
                        for document in step2_documents:
                            for user in steps[2].get("stepTeamMembers"):
                                authorize(
                                    document, user, process_id, process_type
                                )
                                steps[2].get("stepDocumentCloneMap").append(
                                    {user: document}
                                )
                            for user in steps[2].get("stepPublicMembers"):
                                authorize(
                                    document, user, process_id, process_type
                                )
                                steps[2].get("stepDocumentCloneMap").append(
                                    {user: document}
                                )
                            for user in steps[2].get("stepUserMembers"):
                                authorize(
                                    document, user, process_id, process_type
                                )
                                steps[2].get("stepDocumentCloneMap").append(
                                    {user: document}
                                )
    update_process(process_id, steps, process["processing_state"])
