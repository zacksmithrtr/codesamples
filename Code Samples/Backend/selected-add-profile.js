//Function for escaping HTML - regex for unsafe characters
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

//Function for formatting phone number to: (XXX) XXX-XXXX
function phoneNumber(phone) {
    phone = phone.replace(/[^\d]/g, "");
    if (phone.length == 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return null;
}

//Function for loosely validating email. Regex checks that format is str@str.str
function validateEmail(email) 
{
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

//API for creating a new account
router.post('/add', token.verify, async (req, res) => {
    try{
        if(req.account.permissions.edit_accounts != true){
            return res.status(401).send({error: 'Access Denied.'});
        }
        //Check that all required information for creating an account is present
        if(!req.body.email || !req.body.phone || !req.body.firstName || !req.body.lastName || !req.body.accountType || !req.body.team){
            return res.status(400).send(JSON.stringify({error: "Missing required information."}));
        }

        //Verify that new member is not already part of the organization
        const emailExists = await User.findOne({email: escapeHtml(req.body.email).toLowerCase(), organization: req.account.org});
        if(emailExists) return res.status(400).send(JSON.stringify({error: "Email already in use."}));
        
        //Reformat the given phone number to (XXX) XXX-XXX
        req.body.phone = phoneNumber(req.body.phone);
        //If there was a problem reformatting the phone number, return an error.
        if(req.body.phone === null){
            return res.status(400).send(JSON.stringify({error: "Invalid phone number."}));
        }

        //Validate the provided email fits the format str@str.str
        if(validateEmail(req.body.email) === false){
            return res.status(400).send(JSON.stringify({error: "Invalid email."}));
        };

        //Fetch the organization's account and location template
        const organization = await Organization.findById(req.account.org);

        //Check that the provided account type fits the organization's template
        if(!organization.positions.includes(req.body.accountType)){
            return res.status(400).send(JSON.stringify({error: "Invalid account type."}));
        }

        //Check that the organization locations include the provided team ***Note locations/team disparity***
        if(!organization.locations.includes(req.body.team)){
            return res.status(400).send(JSON.stringify({error: "Invalid location."}));
        }

        //Validate manager roles and push them to a safe managers object
        let new_managers = [];
        if(req.body.managers && Array.isArray(req.body.managers) === true){
            for await (manager of req.body.managers){
                if(!organization.positions.includes(manager.position)){
                    return res.status(400).send(JSON.stringify({error: "Invalid manager account type."}));
                }else{
                    const manager_acct = await User.findById(manager.userId);
                    if(manager_acct.accountType === manager.position){
                        new_managers.push({
                            position: manager_acct.accountType,
                            userId: manager_acct._id
                        });
                    }else{
                        return res.status(400).send(JSON.stringify({error: "Manager account type does not match."}));
                    }
                }
            }
        }

        //Create the user object and escape all fields
        let user = new User({
            email: escapeHtml(req.body.email.toLowerCase()),
            phone: escapeHtml(req.body.phone),
            firstName: escapeHtml(req.body.firstName),
            lastName: escapeHtml(req.body.lastName),
            accountType: escapeHtml(req.body.accountType),
            team: escapeHtml(req.body.team),
            organization: organization._id,
            managers: new_managers
        });

        //If focus provided, append it
        if(req.body.focus && req.body.focus != ""){
            user.focus = escapeHtml(req.body.focus);
        }

        //Save the user profile
        const savedUser = await user.save();

        //Return and respond with the user profile
        return res.status(201).send(savedUser);
    }catch(error){
        console.log('[error] error caught in api/profile/add!')
        console.log(error);
        return res.status(500).send(JSON.stringify({error: "Internal server error."}));
    }
});
