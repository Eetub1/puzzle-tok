import express, { response, Router } from "express"
const oauthRouter = express.Router()
const base_url = `https://lichess.org`
const CLIENT_ID = 'puzzle-tok'
const BACKEND_URL = 'http://localhost:5173' // TODO: move
//const BACKEND_URL = '/api/puzzles'
const token_url = `${BACKEND_URL}/api/auth/token`
import {createHash} from 'node:crypto'

const challenge = 'kissa123trololol1234512345123451111111111111111111111111111111111111111111111111111111' //TODO: auto gen

function generateCodeChallenge(code_verifier) {
    return (createHash('sha256'))
        .update(code_verifier)
        .digest('base64url')
}

oauthRouter.get('/getAuth', async (req,res) => {

    console.log("Sending auth")
    const code_challenge = generateCodeChallenge(challenge)
    const auth_url = `${base_url}/oauth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${token_url}&code_challenge_method=S256&code_challenge=${code_challenge}&scope=puzzle:read`
    res.setHeader("Referer-policy",'origin')
    res.setHeader("Access-Control-Allow-Origin",'*')
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
    res.appendHeader('Set-Cookie', `Token=${token}; path=/api`)
    res.redirect("/")
    
})

export default oauthRouter