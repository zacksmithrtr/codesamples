//API to assign a workflow to a user
router.post("/init", token.verify, async (req,res) => {
    try{
        const flow = await Workflow.findById(escapeHtml(req.body.workflowId));
        if(!flow || req.account.permissions.run_timelines != true || req.account.org != flow.organization){
            return res.status(401).send({error: 'Access Denied.'});
        }
        //Check for required information
        if(!req.body.assignedTo || !req.body.workflowId || !req.body.startDate){
            return res.status(400).send(JSON.stringify({error: "Missing required information."}));
        }

        //Initialize the status object
        let workflowStatus = new WorkflowStatus({});
 
        //Add the workflow start date, and set it to 5AM CST
        workflowStatus.startDate = new Date(req.body.startDate);
        if(isNaN(workflowStatus.startDate.getTime())){
            return res.status(400).send(JSON.stringify({error: "Invalid start date."}));
        }else{
            workflowStatus.startDate.setHours(5, 0, 0);
            workflowStatus.startDate = new Date(workflowStatus.startDate).getTime() - 21600000;
        }

        //Check that the specified workflow exits, then validate the target's account type matches the workflow's specified targets
        const assignedTo = await User.findById(escapeHtml(req.body.assignedTo));
        if(!assignedTo || assignedTo.organization != req.account.org){
            return res.status(400).send(JSON.stringify({error: "Invalid target. Target not found."}));
        }

        if(flow.accountTypes.includes(assignedTo.accountType)){
            return res.status(400).send(JSON.stringify({error: "Invalid target."}));
        }
        workflowStatus.assignedTo = assignedTo._id;
        workflowStatus.workflowId = flow._id;
        
        //Check that the workflow target has all required managers
        const flowList = await WorkflowTask.find({workflow: flow._id});
        for await (task of flowList){
            if(!getManager(task.assignedTo, assignedTo.managers)){
                return res.status(400).send(JSON.stringify({error: "Workflow target does not have required managers."}));
            }
        }

        //Move to the next upcomping position if the flow has already started
        if(workflowStatus.startDate > Date.now()){
            workflowStatus.taskPosition = 0;
            const timeIn = Date.now() - workflowStatus.startDate;
            flow.taskTimes.forEach(time => {
                if(timeIn > time){
                    workflowStatus.taskPosition++;
                }
            });
        }

        //Add the flows working days
        if(req.body.workingDays){
            workflowStatus.workingDays = [];
            for await (ele of req.body.workingDays){
                if(ele > 6 || ele < 0){
                    return res.status(400).send(JSON.stringify({error: "Invalid working day."}));
                }
                workflowStatus.workingDays.push(Number(ele));
            }
        }

        //Save the status
        const savedWorkflowStatus = await workflowStatus.save();

        //Return and send the status
        return res.status(201).send(savedWorkflowStatus);
    }catch(error){
        console.log('[error] error caught in api/workflow/init!')
        console.log(error);
        return res.status(500).send(JSON.stringify({error: "Internal server error."}));
    }
});
