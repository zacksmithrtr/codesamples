router.get('/:id', async (req, res) => {
    try{
        //Validate Request
        const ObjectId = require('mongoose').Types.ObjectId;
        if(ObjectId.isValid(req.params.id) === false){
            const return404 = require('./404-export');
            const page404 = return404.return404();
            res.set('Content-Type', 'text/html');
            return res.send(Buffer.from(page404));
        }
        //Validate Action
        const action = await Action.findById(req.params.id);
        if(!action){
            const return404 = require('./404-export');
            const page404 = return404.return404();
            res.set('Content-Type', 'text/html');
            return res.send(Buffer.from(page404));
        }
        //Fetch profile information for HTML render
        const profile = await User.findById(action.assignedTo);
        //Render optimisms checkboxes
        let optimisms = "";
        action.positives.forEach(e => {
            optimisms += `
                <input type="radio" class="toggle_box" id="opt_${e}" name="opts">
                <label class="toggle_label noise" for="opt_${e}"> 
                    ${e}
                </label>
            `
        });
        //Render negatives checkboxes
        let negatives = "";
        action.negatives.forEach(e => {
            negatives += `
                <input type="radio" class="toggle_box" id="con_${e}" name="negs">
                <label class="toggle_label noise" for="con_${e}"> 
                    ${e}
                </label>
            `
        });
        //Render page HTML
        var htmlRes = `
            <!DOCTYPE html>
            <html lang="en" class="noise">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://use.typekit.net/sas6fjp.css">
                <script src="https://www.pivotalretention.com/js/amplitude.js"></script>
                <link rel="stylesheet" href="https://www.pivotalretention.com/css/style.css">
                <title>Feedback Request | Pivotal Retention</title>
                <meta name="description" content="Feedback request submission page.">
                <meta property="og:url" content="https://www.pivotalretention.com/feedback/${req.params.id}">
                <meta property="og:title" content="Organization Editor | Pivotal Retention">
                <meta property="og:description" content="Feedback request submission page.">
                <meta property="og:locale" content="en-US">
                <meta property="og:image" content="https://www.pivotalretention.com/assets/banner.png">
            </head>
            <body>
                <main class="bodyWrapper multiCol" style="margin-top: 32px">
                    <div class="doubleCol">
                        <h1 class="sectionTitle" style="margin-top: 8px;">
                            Submit Feedback Request
                        </h1>
                        <div class="tileOuter wideTile noise">
                            <div class="tileInner noise">
                                <p class="tileTextLabel">
                                    You have a new feedback request from
                                </p>
                                <p class="tileHeader">
                                    ${profile.firstName + " " + profile.lastName}
                                </p>
                                <legend for="opts" class="tileTextLabel">
                                    What positives did you discuss in this conversation?
                                </legend>
                                <fieldset class="checkboxes" id="opts_checks">
                                    ${optimisms}
                                </fieldset>
                                <legend for="negs" class="tileTextLabel">
                                    What concerns did you discuss in this conversation?
                                </legend>
                                <fieldset class="checkboxes" id="negs_checks">
                                    ${negatives}
                                </fieldset>
                                <button class="doubleBtn" id="submitBtn">
                                    <div class="btnLabel">
                                        Submit
                                    </div>
                                    <div class="btnDetail noise">
                                        >
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <nav class="footerNav noise">
                    <div class="footerLinkWrapper">
                        <a href="https://www.pivotalretention.com/p/contact" class="footerLink">Contact</a>
                        <a href="https://www.pivotalretention.com/p/termsofuse" class="footerLink">Terms of Use</a>
                        <a href="https://www.pivotalretention.com/p/privacypolicy" class="footerLink">Privacy Policy</a>
                        <a href="https://www.pivotalretention.com/p/cookiepolicy" class="footerLink">Cookie Policy</a>
                    <a href="https://www.pivotalretention.com/p/dmca" class="footerLink">DMCA Policy</a>
                        <a href="https://www.pivotalretention.com/team" class="footerLink">Admin Pages</a>
                        <button id="signOut" class="signOut">Sign Out</button>
                    </div>
                    <p class="tileText footerText">
                        Copyright 2022 ?? Pivotal Retention, LLC. All rights reserved. 
                    </p>
                </nav>
                <script src="https://www.pivotalretention.com/js/pageJs/feedback.js"></script>
            </body>
            </html>
        `;
        //Send page
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(htmlRes));
    }catch(error){
        console.log('[error] error caught in dynamicHtml/tl-open')
        console.log(error);
        return res.status(500).send(JSON.stringify({error: "Internal server error."}));
    }
});

module.exports = router;
