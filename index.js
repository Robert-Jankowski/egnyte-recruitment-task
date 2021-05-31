const axios = require("axios")

const makeZeroRequest = () => {
    return axios.get("https://integrations-staging.qa-egnyte.com/intern-task/")
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            description: data.description
        }))

}

const makeFirstRequest = ({url, method}) => {
    return axios({url, method, data: { email:"robert.jankowski.kontakt@gmail.com" }})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            token: data.token,
            description: data.description
        }))
}

const makeSecondRequest = async ({url, method, token}) => {
    return axios({url, method, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            query: data.query,
            code: data.code,
            description: data.description,
            token
        }))
}
const makeThirdRequest = async ({url, method, query, code, token}) => {
    const encoded = Buffer.from(code, 'base64').toString('ASCII')
    return axios({url, method, params: {[query.split('=')[0]]: encoded}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            query: data.query,
            number: data.number,
            description: data.description,
            token
        }))
}

const makeFourthRequest = async ({url, method, query, number, token}) => {

    const factorial = [...Array(number + 1).keys()].slice(1).reduce((acc, next) => acc * next, 1)

    return axios({url, method, params: {[query.split('=')[0]]: factorial}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            episodeID: data.episodeID,
            rickAndMortApiUrl: data.rickAndMortApiUrl,
            description: data.description,
            token
        }))
}

const makeFifthRequest = async ({url, method, episodeID, rickAndMortApiUrl, token}) => {

    const links = await axios.get(`${rickAndMortApiUrl}/${episodeID}`).then(res => res.data.characters)
    const characters = await Promise.all(links.map(link => axios.get(link).then(res => res.data.name)))
    return axios({url, method, data: {result: characters}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            stringArray: data.stringArray,
            description: data.description,
            token
        }))
}

const makeSixthRequest = async ({url, method, stringArray, token}) => {

    const sorted = await stringArray.sort().reverse()

    return axios({url, method, data: {result: sorted}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            numberArray: data.numberArray,
            description: data.description,
            token
        }))
}

const makeSeventhRequest = async ({url, method, numberArray, token}) => {

    const sorted = await numberArray.sort((a,b) => b - a )

    return axios({url, method, data: {result: sorted}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            equalizeArray: data.equalizeArray,
            description: data.description,
            token
        }))
}

const makeEigthRequest = async ({url, method, equalizeArray, token}) => {

    const reduced = await equalizeArray.reduce((acc, a, i, array) => {
		const n = array.filter(x => x !== a).length
        return n < acc ? n : acc
        },Infinity)

    return axios({url, method, data: {result: reduced}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            method: data.method,
            url: data.url,
            description: data.description,
            token
        }))
}

const makeNinthRequest = async ({url, method, token}) => {

    const pages = await Promise.all([1,2,3,4,5]
        .map(page => axios({method, url, params: {page}, headers: {Authorization: `Bearer ${token}`}})
            .then(res => res.data)))
    
    const keys = [...new Set(pages.flatMap(a => Object.keys(a)))].reduce((acc,a) => ({...acc, [a]: 0}), {})
    pages.forEach(page => {
        Object.keys(page).forEach(key => {
        keys[key] += page[key]
        })
    })
    return axios({url, method:"POST", data: {result: keys}, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            ...data
        }))
}

const makeTenthRequest = async ({url, method, token}) => {

    return axios({url, method, data: { githubUrl: "https://github.com/Robert-Jankowski/egnyte-task" }, headers: {Authorization: `Bearer ${token}`}})
        .then(({data}) => ({
            ...data
        }))
}

const consoleLog = x => {
    console.log()
    console.log({["task_" + x.url.split("intern-task/")[1]]:x})

    return Promise.resolve(x)
}

const pipe = (...funcs) =>
    funcs.reduce((acc ,next) => acc.then(x => next(x)),
        Promise.resolve())

pipe(makeZeroRequest,
    consoleLog,
    makeFirstRequest,
    consoleLog,
    makeSecondRequest,
    consoleLog, 
    makeThirdRequest,
    consoleLog,
    makeFourthRequest,
    consoleLog,
    makeFifthRequest,
    consoleLog,
    makeSixthRequest,
    consoleLog,
    makeSeventhRequest,
    consoleLog,
    makeEigthRequest,
    consoleLog,
    makeNinthRequest,
    consoleLog,
    makeTenthRequest,
    consoleLog
    ).catch(error => console.log({error}))