import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
    mutation relateUserLoginToPerson(
        $username:String!, 
        $password:String!, 
        $firstName:String!, 
        $lastName:String!, 
        $birthDate: String!, 
        $gender: String!) {
        
        relateUserLoginToPerson(
            identity:$username,
            passcode:$password,
            input: [
                { field: FirstName, value: $firstName }
                { field: LastName, value: $lastName }
                { field: BirthDate, value: $birthDate }
                { field: Gender, value: $gender }
            ]
        ) {
            token
        }
    }
`

export const HANDLE_LOGIN = gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`