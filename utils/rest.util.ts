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

export async function loginWithQR(code: string, domain) {
  const res = await fetch(`https://${domain}/login/oauth2/token`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      client_id: '170000000000004',
      code,
      client_secret: 'GZYy3zjZWHfKxwPasVjP9M3TN6DNUSWt1xPHO4VVbESsDigraTlSQkrj94JZRgZX',
      grant_type: 'authorization_code'
    })
  })

  if (res.status !== 200) return { error: true }

  const json = await res.json()
  console.log(json)
  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token
  }
}

export async function getNewToken(refreshtoken: string, domain: string) {
  const res = await fetch(`https://${domain}/login/oauth2/token`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      client_id: '170000000000004',
      refresh_token: refreshtoken,
      client_secret: 'GZYy3zjZWHfKxwPasVjP9M3TN6DNUSWt1xPHO4VVbESsDigraTlSQkrj94JZRgZX',
      grant_type: 'refresh_token'
    })
  })

  const json = await res.json()

  return {
    access_token: json.access_token
  }
}