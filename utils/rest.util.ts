export function makeApiRequest(url: string, state: any) {
  let res;
  if (url.includes('/login')) {
    res = fetch(`https://${state.domain}/${url}`, {
      "headers": {
        "accept": "application/json+canvas-string-ids, application/json",
        "authorization": `Bearer ${state.token}`
      },
      "referrer": `https://${state.domain}/`,
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "mode": "cors",
    })
  } else {
  res = fetch(`https://${state.domain}/api/v1${url}`, {
      "headers": {
        "accept": "application/json+canvas-string-ids, application/json",
        "authorization": `Bearer ${state.token}`
      },
      "referrer": `https://${state.domain}/`,
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "mode": "cors",
    })
  }

    return res
}