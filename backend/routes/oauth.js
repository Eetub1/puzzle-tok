import express, { response, Router } from "express"
const oauthRouter = express.Router()
const base_url = `https://lichess.org`
const CLIENT_ID = 'puzzle-tok'
const BACKEND_URL = 'http://localhost:3000' // TODO: move
const token_url = `${BACKEND_URL}/api/auth/token`
import {createHash} from 'node:crypto'

const string = `
//<![CDATA[
var theForm = document.forms['ctl00'];
if (!theForm) {
    theForm = document.ctl00;
}
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}
//]]>`
const challenge = 'kissa123trololol1234512345123451111111111111111111111111111111111111111111111111111111'

function generateCodeChallenge(code_verifier) {
    return (createHash('sha256'))
        .update(code_verifier)
        .digest('base64url')
}

oauthRouter.get('/getAuth', async (req,res) => {

    console.log("Sending auth")
    const code_challenge = generateCodeChallenge(challenge)
    const auth_url = `${base_url}/oauth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${token_url}&code_challenge_method=S256&code_challenge=${code_challenge}&scope=puzzle:read`
    res.redirect(auth_url)
})

oauthRouter.get('/token', async (req,res) => {

    console.log("Redirected to token")
    const auth_code = req.query.code
    console.log('auth:code', auth_code)
    console.log('hash', )
    console.log('here',req.query)
    
    let response = await fetch(`${base_url}/api/token`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: auth_code,
            code_verifier: challenge,
            redirect_uri: token_url,
            client_id: CLIENT_ID,
          })
    });
    let data = await response.json();
    console.log('data:',data)
    let token = data.access_token;
    console.log('Token:', token)
    res.appendHeader('Set-Cookie', `Token=${token}`)
    res.redirect("/")

    return token
})

export default oauthRouter