interface User {
  id?:number
  name:string
  email:string
  role:string
  rate:number
}

function isValidUser(userJson: User): userJson is User {
  return (
    typeof userJson === 'object' &&
    (userJson.id === undefined || typeof userJson.id === 'number') &&
    'name' in userJson &&
    'email' in userJson &&
    'role' in userJson &&
    'rate' in userJson &&
    typeof userJson.name === 'string' &&
    typeof userJson.email === 'string' &&
    typeof userJson.role === 'string' &&
    typeof userJson.rate === 'number'
  );
}

export {User,isValidUser}