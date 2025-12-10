# shiftHub-assesment
All the steps which are being asked for is being included in the single script in the tests folder with appropriate assertions
pls add an .env file which consists of:- 
JIRA_URL='YOUR JIRA URL'
JIRA_EMAIL='YOUR LOGIN ID'
JIRA_PASSWORD='YOUR PASSWORD'

from the env credentials the script will proceed with the execution

also in the login.setup.js is used to store the auth session of your login state to avoid the step of login at every execution which use the same credentials as stored in out env file
