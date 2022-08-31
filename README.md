# codesamples
None of these samples are particularly complex or challenging, but I believe they show my consistent approach to problems. I have not refactored code from past projects.



Database

My User and Auth schemas from Pivotal Retention as database examples. Many "Users" were drivers that didn't need an actual account login or permissions. They received an email with a unique URL for responding to feedback requests, but never logged in or had multi-page sessions. This led me to keep information needed for almost every user search and display inside the User schema while keeping the authentication and permission data for true accounts in a separate Auth schema. I'll note that, I was unhappy with how permissions are stored here and I think I would alter how it was structured if I had a do-over.

Front-end

I'm extremely happy with my portfolio site, and I think it shows a much better approximation of my current code. I set up a CSS UI kit with small but consistent design callouts before starting (similar to TailwindCSS), and made sure to make the layout of the HTML clean. I also wanted to make sure the site performance was exceptional, as I felt it reflected on my skillset. I chose to use an animated background for the design (both aesthetically and to make legibility better), but I delayed loading the GIF until the page renders with a low-size PNG first. You can see the effect in the page load performance: great load speed, but a late contentful paint. Although a late contentful paint is usually an issue, it is nearly imperceptible to a real user.

Back-end

All from Pivotal Retention

Add Profile: A simple sample of profile validation and creation. I start with security checks, then move to formatting data, then the managers validation for last, as it is the most computationally expensive.

Initialize Workflow: A simple validation of the request and creation of the workflow instance. I follow the same order of operations.

Server side render of feedback request: A simple example of validating a unique URL request, then formatting the page for a simple render. I chose to put more of this processing than usual on the server because the driver user would often have a slow device and connection.
